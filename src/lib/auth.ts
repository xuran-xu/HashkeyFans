import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { ApiError, ErrorCode } from '@/types/api';

export async function getAuthUser(req: NextRequest) {
  const walletAddress = req.headers.get('x-wallet-address');
  
  console.log('Auth wallet address:', walletAddress);
  
  if (!walletAddress) {
    throw new ApiError(ErrorCode.UNAUTHORIZED, 'Wallet address not provided');
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: { initialCard: true }
  });

  console.log('Found user:', user);

  if (!user) {
    throw new ApiError(ErrorCode.UNAUTHORIZED, 'User not found');
  }

  return user;
} 