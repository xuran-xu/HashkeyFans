export interface User {
  id: number;
  walletAddress: string;
  displayAddress: string;
  shareLink: string;
  initialCardId: number | null;
}

export interface Card {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
}

export interface UserCard {
  id: number;
  userId: number;
  cardId: number;
  originalOwnerId: number;
  originalOwnerAddress: string;
  quantity: number;
}

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_CONNECTED = 'ALREADY_CONNECTED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export class ApiError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
  }
} 