import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { generateShareCode } from '@/lib/utils';
import { ApiError, ErrorCode } from '@/types/api';

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { wallet_address } = await req.json();
    const shareCode = generateShareCode(wallet_address);

    let user = await prisma.user.findUnique({
      where: { walletAddress: wallet_address },
      include: { initialCard: true }
    });

    if (!user) {
      // 只创建用户，不分配卡片
      user = await prisma.user.create({
        data: {
          walletAddress: wallet_address,
          displayAddress: wallet_address.slice(0, 6) + '...' + wallet_address.slice(-4),
          shareCode: generateShareCode(wallet_address),
        },
        include: { initialCard: true }
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        wallet_address: user.walletAddress,
        display_address: user.displayAddress,
        has_initial_card: user.initialCard !== null
      }
    });
  });
} 