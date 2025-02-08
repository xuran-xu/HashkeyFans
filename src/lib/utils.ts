import crypto from 'crypto';

export function formatWalletAddress(address: string): string {
  return address;
}

export function generateShareCode(walletAddress: string): string {
  // 先统一转换为小写
  const normalizedAddress = walletAddress.toLowerCase();
  const hash = crypto.createHash('sha256').update(normalizedAddress).digest('hex');
  return hash.slice(0, 8);
}

export function generateShareLink(shareCode: string): string {
  return `/consensuscard/${shareCode}`;
}
