export interface RedPacketInfo {
  creator: `0x${string}`;
  message: string;
  totalAmount: string;
  remainingAmount: string;
  totalCount: number;
  remainingCount: number;
  claimed: number;
  createdAt: Date;
  canClaim: boolean;
  canRefund: boolean;
  isRefunded: boolean;
}

export interface RedPacketClaim {
  address: string;
  amount: string;
  timestamp: number;
}

export interface RedPacketInfoResponse {
  isLoading: boolean;
  refetch?: () => void;
  info: RedPacketInfo | null;
} 