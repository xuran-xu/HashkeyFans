import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { ApiError, ErrorCode } from '@/types/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  return withErrorHandler(async () => {
    const userId = parseInt(params.user_id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        initialCard: true,
        _count: {
          select: {
            connections: true
          }
        }
      }
    });

    if (!user) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'User not found');
    }

    return NextResponse.json({
      user: {
        id: user.id,
        display_address: user.displayAddress,
        connect_count: user._count.connections
      },
      initial_card: user.initialCard
    });
  });
} 