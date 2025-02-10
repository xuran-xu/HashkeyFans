import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { generateShareCode } from '@/lib/utils';
import { ApiError, ErrorCode } from '@/types/api';
import { Prisma } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  return withErrorHandler(async () => {
    const walletAddress = req.headers.get('x-wallet-address');
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 401 }
      );
    }

    const userShareCode = generateShareCode(walletAddress);

    // 1. 如果是用户自己的 shareCode
    if (userShareCode === params.code) {
      // 查找用户是否已存在
      const user = await prisma.user.findUnique({
        where: { walletAddress },
        include: {
          initialCard: true,
          _count: { select: { connections: true } }
        }
      });

      // 如果用户不存在，创建新用户
      if (!user) {
        // 先随机获取一个初始卡片
        const totalCards = await prisma.card.count();
        const skip = Math.floor(Math.random() * totalCards);

        const randomCard = await prisma.card.findFirst({
          skip: skip,
          take: 1
        });

        if (!randomCard) {
          throw new ApiError(ErrorCode.INTERNAL_ERROR, 'No initial cards available');
        }

        // 创建新用户并关联初始卡片
        const newUser = await prisma.user.create({
          data: {
            walletAddress,
            displayAddress: walletAddress,
            shareCode: generateShareCode(walletAddress),
            initialCardId: randomCard.id
          },
          include: {
            initialCard: true,
            _count: { select: { connections: true } }
          }
        });

        return NextResponse.json({
          card: {
            id: randomCard.id,
            title: randomCard.title,
            description: randomCard.description,
            image_url: randomCard.imageUrl,
            createdAt: randomCard.createdAt
          },
          owner: {
            address: newUser.walletAddress,
            display_address: newUser.displayAddress,
            connect_count: 0
          },
          is_owner: true,
          has_card: true,
          can_claim: false
        });
      }

      return NextResponse.json({
        card: user.initialCard ? {
          id: user.initialCard.id,
          title: user.initialCard.title,
          description: user.initialCard.description,
          image_url: user.initialCard.imageUrl,
          createdAt: user.initialCard.createdAt
        } : null,
        owner: {
          address: user.walletAddress,
          display_address: user.displayAddress,
          connect_count: user._count.connections
        },
        is_owner: true,
        has_card: user.initialCard !== null,
        can_claim: !user.initialCard
      });
    }

    // 2. 如果是查看其他用户的卡片
    const cardOwner = await prisma.user.findUnique({
      where: { shareCode: params.code },
      include: {
        initialCard: true,
        _count: { select: { connections: true } }
      }
    });

    if (!cardOwner) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Card not found');
    }

    // 检查是否已经连接
    const currentUser = walletAddress ? await prisma.user.findUnique({
      where: { walletAddress }
    }) : null;

    const isConnected = currentUser ? await prisma.userConnection.findFirst({
      where: {
        OR: [
          {
            userId: currentUser.id,
            connectedUserId: cardOwner.id
          },
          {
            userId: cardOwner.id,
            connectedUserId: currentUser.id
          }
        ]
      }
    }) : null;

    return NextResponse.json({
      card: cardOwner.initialCard ? {
        id: cardOwner.initialCard.id,
        title: cardOwner.initialCard.title,
        description: cardOwner.initialCard.description,
        image_url: cardOwner.initialCard.imageUrl,
        createdAt: cardOwner.initialCard.createdAt
      } : null,
      owner: {
        id: cardOwner.id,
        address: cardOwner.walletAddress,
        display_address: cardOwner.displayAddress,
        connect_count: cardOwner._count.connections
      },
      is_owner: false,
      has_card: cardOwner.initialCard !== null,
      can_claim: false,
      is_connected: !!isConnected
    });
  });
} 