import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';

interface UserResponse {
  user: {
    id: number;
    display_address: string;
    connect_count: number;
    has_claimed: boolean;  // 新增字段，表示是否已领取初始卡
  };
  initial_card: {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
  } | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
): Promise<NextResponse<UserResponse>> {
  return withErrorHandler(async () => {
    // 尝试通过 shareLink 或钱包地址查找用户
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { shareCode: params.code },
          { walletAddress: params.code }  // 添加对钱包地址的支持
        ]
      },
      include: {
        initialCard: true,
        _count: {
          select: {
            connections: true
          }
        }
      }
    });

    // 如果找不到用户，返回一个默认的未认领状态
    if (!user) {
      return NextResponse.json({
        user: {
          id: 0,
          display_address: 'Unknown User',
          connect_count: 0,
          has_claimed: false
        },
        initial_card: null
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        display_address: user.displayAddress,
        connect_count: user._count.connections,
        has_claimed: user.initialCard !== null
      },
      initial_card: user.initialCard ? {
        id: user.initialCard.id,
        title: user.initialCard.title,
        description: user.initialCard.description,
        image_url: user.initialCard.imageUrl
      } : null
    });
  });
} 