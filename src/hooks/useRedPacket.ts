'use client'

import { useState, useEffect, useCallback } from 'react';
import { ethers, formatEther, parseEther } from 'ethers';
import { REDPACKET_CONTRACT } from '@/config/contracts';
import { useAccount, useWallets } from '@particle-network/connectkit';
import { RedPacketClaim } from '@/types/redpacket';

interface RedPacketInfo {
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

// interface RedPacketInfoResponse {
//   isLoading: boolean;
//   refetch?: () => void;
//   info: RedPacketInfo | null;
// }

export function useCreateRedPacket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}`>('0x0');
  const { address } = useAccount();
  const [primaryWallet] = useWallets();


  const handleCreate = async (message: string, amount: number, count: number) => {
    if (!address) throw new Error('Wallet not connected');

    const provider = await primaryWallet.connector.getProvider();
    const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
    const signer = await ethersProvider.getSigner();
    const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, signer);

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.createPacket(message, count, { value: parseEther(amount.toString()) });
      setHash(tx.hash);
      await tx.wait(); // 等待交易确认
      return tx.hash;
    } catch (err) {
      console.error('Failed to create red packet:', err);
      setError(err instanceof Error ? err.message : '创建红包失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRedPacket: handleCreate,
    isLoading: loading,
    error,
    hash,
  };
}

export function useRedPacketInfo(id?: string) {
  const { address } = useAccount();
  const [info, setInfo] = useState<RedPacketInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryWallet] = useWallets();

  const fetchRedPacketInfo = useCallback(async () => {
    if (!id || !address) return;

    try {
      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, signer);
        
      const packetInfo = await contract['getPacketInfo(uint256,address)'](BigInt(id), address);
      setInfo({
        creator: packetInfo[0],
        message: packetInfo[1],
        totalAmount: formatEther(packetInfo[2]),
        remainingAmount: formatEther(packetInfo[3]),
        totalCount: Number(packetInfo[4]),
        remainingCount: Number(packetInfo[5]),
        claimed: Number(packetInfo[4]) - Number(packetInfo[5]),
        createdAt: new Date(Number(packetInfo[6]) * 1000),
        canClaim: Boolean(packetInfo[7]),
        canRefund: Boolean(packetInfo[8]),
        isRefunded: Boolean(packetInfo[9])
      });
    } catch (err) {
      console.error('Failed to fetch red packet info:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, address, primaryWallet]);

  useEffect(() => {
    fetchRedPacketInfo();
  }, [fetchRedPacketInfo]);

  return { 
    info, 
    isLoading,
    refetch: fetchRedPacketInfo 
  };
}

export function useRedPacketClaimed(id?: string) {
  const { address } = useAccount();
  const [primaryWallet] = useWallets();
  const [isLoading, setIsLoading] = useState(true);
  const [claimedAmount, setClaimedAmount] = useState('0');
  const [canClaim, setCanClaim] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  const fetchClaimInfo = useCallback(async () => {
    if (!id || !address) return;

    try {
      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, signer);

      const packetInfo = await contract['getPacketInfo(uint256,address)'](BigInt(id), address);
      const claimedAmt = packetInfo[6];
      
      setClaimedAmount(formatEther(claimedAmt));
      setCanClaim(packetInfo[7]);
      setHasClaimed(claimedAmt > 0);
    } catch (err) {
      console.error('Failed to fetch claim info:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, address, primaryWallet]);

  useEffect(() => {
    fetchClaimInfo();
  }, [fetchClaimInfo]);

  return {
    isLoading,
    refetch: fetchClaimInfo,
    claimedAmount,
    hasClaimed,
    canClaim
  };
}

export function useClaimRedPacket() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}`>('0x0');
  const [primaryWallet] = useWallets();

  const handleClaim = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, signer);

      const tx = await contract.claimPacket(id);
      setHash(tx.hash);
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error('Failed to claim red packet:', err);
      setError(err instanceof Error ? err.message : '领取红包失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimRedPacket: handleClaim,
    isLoading,
    error,
    hash
  };
}

export function useRedPacketClaims(packetId: string) {
  const [claims, setClaims] = useState<RedPacketClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryWallet] = useWallets();

  const fetchClaims = useCallback(async () => {
    try {
      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, ethersProvider);

      const [addresses, amounts] = await contract.getPacketClaimers(packetId);
      const claimsData: RedPacketClaim[] = addresses.map((address: string, index: number) => ({
        address,
        amount: formatEther(amounts[index]),
        timestamp: Date.now() / 1000
      }));
      setClaims(claimsData);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setIsLoading(false);
    }
  }, [packetId, primaryWallet]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return { claims, isLoading, refetch: fetchClaims };
}

export function useUserRedPackets() {
  const { address } = useAccount();
  const [primaryWallet] = useWallets();
  const [created, setCreated] = useState<bigint[]>([]);
  const [claimed, setClaimed] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPackets = useCallback(async () => {
    if (!address || !primaryWallet) return;

    try {
      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, ethersProvider);

      const [createdPackets, claimedPackets] = await contract['getUserRelatedPackets(address)'](address);
      setCreated(createdPackets);
      setClaimed(claimedPackets);
    } catch (err) {
      console.error('Failed to fetch user packets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, primaryWallet]);

  useEffect(() => {
    fetchUserPackets();
  }, [fetchUserPackets]);

  return {
    isLoading,
    refetch: fetchUserPackets,
    created,
    claimed
  };
}

export function useRefundRedPacket() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}`>('0x0');
  const [primaryWallet] = useWallets();

  const handleRefund = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = await primaryWallet.connector.getProvider();
      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(REDPACKET_CONTRACT.address, REDPACKET_CONTRACT.abi, signer);

      const tx = await contract.refundExpiredPacket(id);
      setHash(tx.hash);
      await tx.wait();
      return tx.hash;
    } catch (err) {
      console.error('Failed to refund red packet:', err);
      setError(err instanceof Error ? err.message : '退回红包失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    refundRedPacket: handleRefund,
    isLoading,
    error,
    refundHash: hash,
  };
} 