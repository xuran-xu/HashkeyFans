import { NextResponse } from 'next/server';
import { ApiError, ErrorCode } from '../types/api';

export async function withErrorHandler(handler: Function) {
  try {
    return await handler();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message } },
        { status: getStatusCode(err.code) }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: { code: ErrorCode.INTERNAL_ERROR, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

function getStatusCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.UNAUTHORIZED:
      return 401;
    case ErrorCode.FORBIDDEN:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.ALREADY_CONNECTED:
    case ErrorCode.INVALID_REQUEST:
      return 400;
    default:
      return 500;
  }
} 