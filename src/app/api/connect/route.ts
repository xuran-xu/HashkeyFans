import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
import { redis, CACHE_KEYS } from '@/lib/redis';

interface ConnectResponse {
  success: boolean;
  message: string;
  data?: {
    givenCard: UserCard;
    receivedCard: UserCard;
  };
}

interface UserCard {
  id: number;
  userId: number;
  cardId: number;
  originalOwnerId: number;
  originalOwnerAddress: string;
  quantity: number;
  createdAt: Date;
}

export async function POST(req: NextRequest): Promise<NextResponse<ConnectResponse>> {
  return withErrorHandler(async () => {
    const { target_user_id } = await req.json();
    const walletAddress = req.headers.get('x-wallet-address')?.toLowerCase();

    if (!walletAddress) {
      throw new ApiError(ErrorCode.UNAUTHORIZED, 'Wallet address is required');
    }

    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { initialCard: true }
    });

    if (!user) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    // 获取目标用户
    const targetUser = await prisma.user.findUnique({
      where: { id: target_user_id },
      include: { initialCard: true }
    });

    if (!targetUser) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Target user not found');
    }

    // 创建连接并交换卡片
    const result = await prisma.$transaction(async (tx) => {
      // 创建双向连接
      await Promise.all([
        tx.userConnection.create({
          data: {
            userId: user.id,
            connectedUserId: targetUser.id
          }
        }),
        tx.userConnection.create({
          data: {
            userId: targetUser.id,
            connectedUserId: user.id
          }
        })
      ]);

      // 交换卡片
      const [givenCard, receivedCard] = await Promise.all([
        tx.userCard.create({
          data: {
            userId: targetUser.id,
            cardId: user.initialCard!.id,
            originalOwnerId: user.id,
            originalOwnerAddress: user.walletAddress,
            quantity: 1
          }
        }),
        tx.userCard.create({
          data: {
            userId: user.id,
            cardId: targetUser.initialCard!.id,
            originalOwnerId: targetUser.id,
            originalOwnerAddress: targetUser.walletAddress,
            quantity: 1
          }
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
      message: 'Successfully connected and exchanged cards',
      data: result
    });
  });
} 