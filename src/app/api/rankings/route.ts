import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandler } from '@/lib/middleware';
import { redis, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

interface RankingUser {
  id: number;
  displayAddress: string | null;
  _count: {
    connections: number;
  };
}

export async function GET() {
  return withErrorHandler(async () => {
    // Try to get from cache
    const cached = await redis.get(CACHE_KEYS.RANKINGS);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Get rankings from database
    const users = await prisma.user.findMany({
      orderBy: {
        connections: {
          _count: 'desc'
        }
      },
      select: {
        id: true,
        displayAddress: true,
        _count: {
          select: {
            connections: true
          }
        }
      }
    });

    const rankings = users.map((user: RankingUser, index: number) => ({
      user_id: user.id,
      display_address: user.displayAddress || '',
      connect_count: user._count.connections,
      rank: index + 1
    }));

    const response = { rankings };

    // Cache the result
    await redis.set(
      CACHE_KEYS.RANKINGS,
      response,
      { ex: CACHE_TTL.RANKINGS }
    );

    return NextResponse.json(response);
  });
} 