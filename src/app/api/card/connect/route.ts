import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { target_user_id } = await req.json();
    
    // 确保 target_user_id 是数字
    const targetUserId = parseInt(target_user_id);
    if (isNaN(targetUserId)) {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Invalid target user ID');
    }

    const user = await getAuthUser(req);

    // 验证目标用户存在
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },  // 使用转换后的数字
      include: { initialCard: true }
    });

    if (!targetUser) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    if (!targetUser.initialCard) {
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Target user has no card');
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
      throw new ApiError(ErrorCode.ALREADY_CONNECTED, 'Already connected with this user');
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

      // 检查是否已经有这些卡片
      const [existingGivenCard, existingReceivedCard] = await Promise.all([
        tx.userCard.findUnique({
          where: {
            userId_cardId_originalOwnerId: {
              userId: targetUser.id,
              cardId: user.initialCard!.id,
              originalOwnerId: user.id
            }
          }
        }),
        tx.userCard.findUnique({
          where: {
            userId_cardId_originalOwnerId: {
              userId: user.id,
              cardId: targetUser.initialCard.id,
              originalOwnerId: targetUser.id
            }
          }
        })
      ]);

      // 交换卡片
      const [givenCard, receivedCard] = await Promise.all([
        // 对方获得我的卡片
        existingGivenCard 
          ? tx.userCard.update({
              where: { id: existingGivenCard.id },
              data: { quantity: { increment: 1 } }
            })
          : tx.userCard.create({
              data: {
                userId: targetUser.id,
                cardId: user.initialCard!.id,
                originalOwnerId: user.id,
                originalOwnerAddress: user.displayAddress!,
                quantity: 1
              }
            }),
        // 我获得对方的卡片
        existingReceivedCard
          ? tx.userCard.update({
              where: { id: existingReceivedCard.id },
              data: { quantity: { increment: 1 } }
            })
          : tx.userCard.create({
              data: {
                userId: user.id,
                cardId: targetUser.initialCard.id,
                originalOwnerId: targetUser.id,
                originalOwnerAddress: targetUser.displayAddress!,
                quantity: 1
              }
            })
      ]);

      return { givenCard, receivedCard };
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully connected and exchanged cards'
    });
  });
} 