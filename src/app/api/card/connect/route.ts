import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { shareCode } = await req.json();
    const walletAddress = req.headers.get('x-wallet-address')?.toLowerCase();

    if (!walletAddress || !shareCode) {
      console.log('Error: Missing required parameters');
      throw new ApiError(ErrorCode.INVALID_REQUEST, 'Missing required parameters');
    }

    console.log('Wallet address being queried:', walletAddress);

    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      console.log('Error: User not found for wallet address:', walletAddress);
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    console.log('Current user found:', user);

    // 获取目标用户
    const targetUser = await prisma.user.findUnique({
      where: { shareCode },
      include: {
        initialCard: true
      }
    });

    if (!targetUser) {
      console.log('Error: Target user not found for share code:', shareCode);
      throw new ApiError(ErrorCode.NOT_FOUND, 'Target user not found');
    }

    if (!targetUser.initialCard) {
      console.log('Error: Target user has no initial card');
      throw new ApiError(ErrorCode.NOT_FOUND, 'Target user has no initial card');
    }

    console.log('Target user found:', targetUser);

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
      console.log('Error: Already connected between users:', user.id, 'and', targetUser.id);
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
      // 创建反向连接
      prisma.userConnection.create({
        data: {
          userId: targetUser.id,
          connectedUserId: user.id
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

    console.log('Connection and card creation successful:', result);

    return NextResponse.json(result[2]); // 返回创建的卡片信息
  });
} 