import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { redis, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const user = await getAuthUser(req);

    // Try to get from cache
    const cached = await redis.get(CACHE_KEYS.USER_CARDS(user.id));
    if (cached) {
      return NextResponse.json(cached);
    }

    const userCards = await prisma.userCard.findMany({
      where: { userId: user.id },
      include: { card: true }
    });

    const response = {
      cards: userCards.map((uc: { card: { id: any; title: any; description: any; imageUrl: any; }; quantity: any; originalOwnerAddress: any; }) => ({
        id: uc.card.id,
        title: uc.card.title,
        description: uc.card.description,
        image_url: uc.card.imageUrl,
        quantity: uc.quantity,
        owner_address: uc.originalOwnerAddress
      }))
    };

    // Cache the result
    await redis.set(
      CACHE_KEYS.USER_CARDS(user.id),
      response,
      { ex: CACHE_TTL.USER_CARDS }
    );

    return NextResponse.json(response);
  });
} 