import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { useDidContract } from './useDidContract';

interface ProfileResult {
  profile?: ProfileData;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 获取指定地址的资料信息
 */
export const useProfile = (address?: string): ProfileResult => {
  const [profile, setProfile] = useState<ProfileData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { getProfile } = useDidContract();
  
  const fetchProfile = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const profileData = await getProfile(address);
      setProfile(profileData || undefined);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 当地址改变时重新获取资料
  useEffect(() => {
    fetchProfile();
  }, [address]);
  
  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile
  };
};

export default useProfile; 