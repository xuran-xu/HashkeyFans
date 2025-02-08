export interface ProfileData {
  exists: boolean;
  nickname: string;
  bio: string;
  avatar: {
    avatarType: number;
    value: string;
    nftContract: string;
    tokenId: bigint;
  };
  socials: {
    platform: string;
    handle: string;
    verified: boolean;
    verifier: string;
  }[];
  addresses: {
    chain: string;
    addr: string;
    verified: boolean;
    verifier: string;
  }[];
  history: {
    updateType: string;
    fieldType: string;
    key: string;
    timestamp: bigint;
  }[];
}

type ChainType = keyof typeof icons;

interface Address {
  chain: ChainType;
  addr: string;
} 