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

    // 获取用户信息和所有卡片
    const [userWithData, allCards] = await Promise.all([
      prisma.user.findUnique({
        where: { walletAddress },
        include: {
          userCards: {
            include: {
              card: true
            }
          },
          initialCard: true
        }
      }),
      prisma.card.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
        },
      })
    ]);

    if (!userWithData) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'User not found');
    }

    // 创建收集卡片的映射
    const collectedCards = new Set(userWithData.userCards.map(uc => uc.cardId));
    
    // 如果有初始卡片，添加到收集集合中
    if (userWithData.initialCard) {
      collectedCards.add(userWithData.initialCard.id);
    }

    // 创建卡片所有者映射
    const cardOwners = new Map(
      userWithData.userCards.map(uc => [uc.cardId, uc.originalOwnerAddress])
    );
    
    // 如果有初始卡片，添加其所有者信息
    if (userWithData.initialCard) {
      cardOwners.set(userWithData.initialCard.id, walletAddress);
    }

    // 创建卡片数量映射
    const cardQuantities = new Map(
      userWithData.userCards.map(uc => [uc.cardId, uc.quantity])
    );
    
    // 如果有初始卡片，添加其数量信息
    if (userWithData.initialCard) {
      cardQuantities.set(userWithData.initialCard.id, 1);
    }

    // 组装响应数据
    const cards: CardResponse[] = allCards.map(card => ({
      id: card.id,
      title: card.title,
      description: card.description,
      image_url: card.imageUrl,
      collected: collectedCards.has(card.id),
      quantity: cardQuantities.get(card.id) || 0,
      owner_address: cardOwners.get(card.id) || null
    }));

    // 计算统计数据
    const stats: StatsResponse = {
      total_cards: allCards.length,
      collected_cards: collectedCards.size,
      total_quantity: Array.from(cardQuantities.values()).reduce((sum, qty) => sum + qty, 0)
    };

    return NextResponse.json({ cards, stats });
  });
} 