import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
interface CardData {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

interface UserCardData {
  id: number;
  userId: number;
  cardId: number;
  originalOwnerId: number;
  originalOwnerAddress: string;
  quantity: number;
  createdAt: Date;
  card: CardData;
}

interface CardResponse {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  collected: boolean;
  quantity: number;
  owner_address: string | null;
}

export async function GET(req: NextRequest): Promise<NextResponse<CardResponse[]>> {
  return withErrorHandler(async () => {
    const walletAddress = req.headers.get('x-wallet-address')?.toLowerCase();
    if (!walletAddress) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'Wallet address is required');
    }

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
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    const cards: CardResponse[] = userWithCards.userCards.map((userCard: UserCardData) => ({
      id: userCard.card.id,
      title: userCard.card.title,
      description: userCard.card.description,
      image_url: userCard.card.imageUrl,
      collected: true,
      quantity: userCard.quantity,
      owner_address: userCard.originalOwnerAddress
    }));

    return NextResponse.json(cards);
  });
} 