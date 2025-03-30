import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useAccount, useWallets } from '@particle-network/connectkit';
import { didContract } from '../config/didContract';
import { ProfileData } from '../types/profile';

interface BatchUpdateData {
  nickname: string;
  bio: string;
  avatarUrl: string;
  socialAccounts: {
    platform: string;
    handle: string;
  }[];
  cryptoAddresses: {
    chain: string;
    addr: string;
  }[];
}

interface RawSocialAccount {
  platform: string;
  handle: string;
}

interface RawCryptoAddress {
  chain: string;
  addr: string;
}

interface RawHistoryItem {
  timestamp: bigint;
  updateType: string;
  fieldType: string;
  key: string;
  oldValue: string;
  newValue: string;
}

interface RawAvatar {
  avatarType: bigint;
  value: string;
  nftContract: string;
  tokenId: bigint;
}

interface RawProfileData {
  exists: boolean;
  nickname: string;
  bio: string;
  avatar: RawAvatar;
  socials: RawSocialAccount[];
  addresses: RawCryptoAddress[];
  history: RawHistoryItem[];
}

export function useDidContract() {
  const { isConnected } = useAccount();
  const [primaryWallet] = useWallets();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !primaryWallet) return;

      try {
        const provider = await primaryWallet.connector.getProvider();
        const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
        const signer = await ethersProvider.getSigner();
        
        const contractInstance = new ethers.Contract(
          didContract.address,
          didContract.abi,
          signer
        );
        
        setContract(contractInstance);
      } catch (error) {
        console.error('Failed to initialize contract:', error);
      }
    };

    initContract();
  }, [isConnected, primaryWallet]);

  const getProfile = useCallback(async (address: string): Promise<ProfileData | null> => {
    if (!contract) return null;
    try {
      const fullProfile = await contract.getFullProfile(address) as RawProfileData;
      console.log('Raw profile data:', fullProfile);

      return {
        exists: fullProfile.exists,
        nickname: fullProfile.nickname,
        bio: fullProfile.bio,
        avatar: {
          avatarType: Number(fullProfile.avatar.avatarType),
          value: fullProfile.avatar.value,
          nftContract: fullProfile.avatar.nftContract,
          tokenId: fullProfile.avatar.tokenId
        },
        socials: fullProfile.socials.map((s: RawSocialAccount) => ({
          platform: s.platform,
          handle: s.handle,
          verified: false,
          verifier: ''
        })),
        addresses: fullProfile.addresses.map((a: RawCryptoAddress) => ({
          chain: a.chain,
          addr: a.addr,
          verified: false,
          verifier: ''
        })),
        history: fullProfile.history.map((h: RawHistoryItem) => ({
          timestamp: h.timestamp,
          updateType: h.updateType,
          fieldType: h.fieldType,
          key: h.key,
          oldValue: h.oldValue,
          newValue: h.newValue
        }))
      } as ProfileData;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }, [contract]);

  const initProfile = useCallback(async (nickname: string, bio: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.initProfile(nickname, bio);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error initializing profile:', error);
      throw error;
    }
  }, [contract]);

  const updateProfile = useCallback(async (nickname: string, bio: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.updateProfile(nickname, bio);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [contract]);

  const updateSocialAccount = useCallback(async (platform: string, handle: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.updateSocialAccount(platform, handle);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error updating social account:', error);
      throw error;
    }
  }, [contract]);

  const updateCryptoAddress = useCallback(async (chain: string, addr: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.updateCryptoAddress(chain, addr);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error updating crypto address:', error);
      throw error;
    }
  }, [contract]);

  const getAllSocialAccounts = useCallback(async (address: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const [platforms, handles] = await contract.getAllSocialAccounts(address);
      return platforms.map((platform: string, index: number) => ({
        platform,
        handle: handles[index]
      }));
    } catch (error) {
      console.error('Error getting all social accounts:', error);
      throw error;
    }
  }, [contract]);

  const verifyProfile = useCallback(async (address: string): Promise<boolean> => {
    // 由于合约中可能还没有实现验证方法，我们可以先模拟这个功能
    if (!contract) throw new Error('Contract not initialized');
    try {
      // 这里可以调用合约的验证方法
      // const tx = await contract.verifyProfile(address);
      // const receipt = await tx.wait();
      
      // 临时方案：模拟验证，将来可以替换为真实合约调用
      console.log('Verifying profile for:', address);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟网络延迟
      return true; // 模拟验证成功
    } catch (error) {
      console.error('Error verifying profile:', error);
      throw error;
    }
  }, [contract]);

  const batchUpdateProfile = useCallback(async (data: BatchUpdateData) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      console.log('Batch update profile data:', JSON.stringify(data, null, 2));
      
      // 验证数据格式是否正确
      if (!data.nickname) {
        console.warn('Nickname is empty, will use empty string');
      }
      
      if (!data.cryptoAddresses || !Array.isArray(data.cryptoAddresses)) {
        console.warn('No crypto addresses or invalid format:', data.cryptoAddresses);
        data.cryptoAddresses = [];
      } else {
        console.log('Crypto addresses count:', data.cryptoAddresses.length);
        data.cryptoAddresses.forEach((addr, i) => {
          console.log(`Crypto address ${i}:`, addr);
          // 确保地址数据格式正确
          if (!addr.chain || !addr.addr) {
            console.error(`Invalid address data at index ${i}:`, addr);
          }
        });
      }
      
      // 验证社交账户
      if (!data.socialAccounts || !Array.isArray(data.socialAccounts)) {
        console.warn('No social accounts or invalid format:', data.socialAccounts);
        data.socialAccounts = [];
      }
      
      // 准备发送交易
      console.log('Sending batchUpdateProfile transaction with data:', data);
      const tx = await contract.batchUpdateProfile(data);
      console.log('Transaction sent:', tx.hash);
      
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return receipt;
    } catch (error) {
      console.error('Error batch updating profile:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      throw error;
    }
  }, [contract]);

  return {
    contract,
    getProfile,
    initProfile,
    updateProfile,
    updateSocialAccount,
    updateCryptoAddress,
    getAllSocialAccounts,
    verifyProfile,
    batchUpdateProfile,
  };
} 