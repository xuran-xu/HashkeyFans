import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { redis, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    // Try to get from cache
    const cached = await redis.get(CACHE_KEYS.RANKINGS);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Get rankings from database
    const rankings = await prisma.user.findMany({
      select: {
        id: true,
        displayAddress: true,
        _count: {
          select: {
            connections: true
          }
        }
      },
      orderBy: {
        connections: {
          _count: 'desc'
        }
      },
      take: 100
    });

    const response = {
      rankings: rankings.map((user: { id: string; displayAddress: string; _count: { connections: string; }; }, index: number) => ({
        user_id: user.id,
        display_address: user.displayAddress,
        connect_count: user._count.connections,
        rank: index + 1
      }))
    };

    // Cache the result
    await redis.set(
      CACHE_KEYS.RANKINGS,
      response,
      { ex: CACHE_TTL.RANKINGS }
    );

    return NextResponse.json(response);
  });
} 