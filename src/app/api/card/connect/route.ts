import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { shareCode } = await req.json();
    const walletAddress = req.headers.get('x-wallet-address')?.toLowerCase();

    if (!walletAddress || !shareCode) {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Missing required parameters');
    }

    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    // 获取目标用户
    const targetUser = await prisma.user.findUnique({
      where: { shareCode },
      include: {
        initialCard: true
      }
    });

    if (!targetUser) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Target user not found');
    }

    if (!targetUser.initialCard) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Target user has no initial card');
    }

    // 检查是否已经连接
    const existingConnection = await prisma.userConnection.findUnique({
      where: {
        userId_connectedUserId: {
          userId: user.id,
          connectedUserId: targetUser.id
        }
      }
    });

    if (existingConnection) {
      throw new ApiError(ErrorCode.ALREADY_CONNECTED, 'Already connected');
    }

    // 创建连接和卡片
    const result = await prisma.$transaction([
      // 创建连接
      prisma.userConnection.create({
        data: {
          userId: user.id,
          connectedUserId: targetUser.id
        }
      }),
      // 创建卡片
      prisma.userCard.create({
        data: {
          userId: user.id,
          cardId: targetUser.initialCard.id,
          originalOwnerId: targetUser.id,
          originalOwnerAddress: targetUser.walletAddress
        },
        include: {
          card: true
        }
      })
    ]);

    return NextResponse.json(result[1]);
  });
} 