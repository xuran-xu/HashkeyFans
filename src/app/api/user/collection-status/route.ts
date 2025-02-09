import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';

// Define response types
interface CardResponse {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  collected: boolean;
  quantity: number;
  owner_address: string | null;
}

interface StatsResponse {
  total_cards: number;
  collected_cards: number;
  total_quantity: number;
}

interface CollectionResponse {
  cards: CardResponse[];
  stats: StatsResponse;
}

export async function GET(req: NextRequest): Promise<NextResponse<CollectionResponse>> {
  return withErrorHandler(async () => {
    const walletAddress = req.headers.get('x-wallet-address')?.toLowerCase();
    if (!walletAddress) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'Wallet address is required');
    }

    // 使用单个查询获取所需数据
    const userWithCards = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        userCards: {
          include: {
            card: true
          }
        }
      }
    });

    if (!userWithCards) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'User not found');
    }

    // 获取所有卡片（使用缓存或预加载）
    const allCards = await prisma.card.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
    });

    // 创建用户卡片映射
    const userCardMap = new Map(
      userWithCards.userCards.map(uc => [uc.cardId, uc])
    );

    // 组装响应数据
    const cards: CardResponse[] = allCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description,
      image_url: card.imageUrl,
      collected: userCardMap.has(card.id),
      quantity: userCardMap.get(card.id)?.quantity || 0,
      owner_address: userCardMap.get(card.id)?.originalOwnerAddress || null
    }));

    const stats: StatsResponse = {
      total_cards: allCards.length,
      collected_cards: userWithCards.userCards.length,
      total_quantity: userWithCards.userCards.reduce((sum, uc) => sum + uc.quantity, 0)
    };

    return NextResponse.json({ cards, stats });
  });
} 