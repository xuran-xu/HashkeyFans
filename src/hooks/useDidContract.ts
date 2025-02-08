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
      const fullProfile = await contract.getFullProfile(address);
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
        socials: fullProfile.socials.map((s: any) => ({
          platform: s.platform,
          handle: s.handle,
          verified: false,
          verifier: ''
        })),
        addresses: fullProfile.addresses.map((a: any) => ({
          chain: a.chain,
          addr: a.addr,
          verified: false,
          verifier: ''
        })),
        history: fullProfile.history.map((h: any) => ({
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

  const batchUpdateProfile = useCallback(async (data: BatchUpdateData) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.batchUpdateProfile(data);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error batch updating profile:', error);
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
    batchUpdateProfile,
  };
} 