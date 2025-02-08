import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
import { redis, CACHE_KEYS } from '@/lib/redis';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { target_user_id } = await req.json();
    const user = await getAuthUser(req);

    // Validate users exist
    const [targetUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: target_user_id },
        include: { initialCard: true }
      })
    ]);

    if (!targetUser) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    if (!user.initialCard || !targetUser.initialCard) {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Initial card not found');
    }

    // Check if already connected
    const existingConnection = await prisma.userConnection.findUnique({
      where: {
        userId_connectedUserId: {
          userId: user.id,
          connectedUserId: targetUser.id
        }
      }
    });

    if (existingConnection) {
      throw new ApiError(ErrorCode.ALREADY_CONNECTED, 'Users are already connected');
    }

    // Create connection and exchange cards in a transaction
    const result = await prisma.$transaction(async (tx: { userConnection: { create: (arg0: { data: { userId: any; connectedUserId: any; }; }) => any; }; userCard: { create: (arg0: { data: { userId: any; cardId: any; originalOwnerId: any; originalOwnerAddress: any; quantity: number; } | { userId: any; cardId: any; originalOwnerId: any; originalOwnerAddress: any; quantity: number; }; include: { card: boolean; } | { card: boolean; }; }) => any; }; }) => {
      // Create connection
      await tx.userConnection.create({
        data: {
          userId: user.id,
          connectedUserId: targetUser.id
        }
      });

      // Exchange cards
      const [givenCard, receivedCard] = await Promise.all([
        tx.userCard.create({
          data: {
            userId: targetUser.id,
            cardId: user.initialCard!.id,
            originalOwnerId: user.id,
            originalOwnerAddress: user.displayAddress,
            quantity: 1
          },
          include: { card: true }
        }),
        tx.userCard.create({
          data: {
            userId: user.id,
            cardId: targetUser.initialCard!.id,
            originalOwnerId: targetUser.id,
            originalOwnerAddress: targetUser.displayAddress,
            quantity: 1
          },
          include: { card: true }
        })
      ]);

      return { givenCard, receivedCard };
    });

    // Invalidate cache
    await Promise.all([
      redis.del(CACHE_KEYS.USER_CARDS(user.id)),
      redis.del(CACHE_KEYS.USER_CARDS(target_user_id)),
      redis.del(CACHE_KEYS.USER_CONNECTIONS(user.id)),
      redis.del(CACHE_KEYS.USER_CONNECTIONS(target_user_id)),
      redis.del(CACHE_KEYS.RANKINGS)
    ]);

    return NextResponse.json({
      success: true,
      received_card: {
        ...result.receivedCard.card,
        owner_address: result.receivedCard.originalOwnerAddress
      },
      given_card: {
        ...result.givenCard.card,
        owner_address: result.givenCard.originalOwnerAddress
      }
    });
  });
} 