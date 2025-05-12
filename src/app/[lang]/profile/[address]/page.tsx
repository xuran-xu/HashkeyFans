'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ProfileView } from '@/components/profile/ProfileView';
import { useDidContract } from '@/hooks/useDidContract';
import { ProfileData } from '@/types/profile';

export default function ProfilePage({ params }: { params: { address: string; lang: string } }) {
  const { verifyProfile, getProfile } = useDidContract();
  const [isVerifying, setIsVerifying] = useState(false);
  const [profile, setProfile] = useState<ProfileData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if the profile is the user's own profile
  const { address: userAddress } = useAccount();
  const isOwner = userAddress?.toLowerCase() === params.address.toLowerCase();

  // 直接使用getProfile替代useProfile hook
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!params.address) return;
      
      setIsLoading(true);
      setError(null);
      console.log('Fetching profile for address:', params.address);
      
      try {
        const profileData = await getProfile(params.address);
        console.log('Profile data received:', profileData);
        setProfile(profileData || undefined);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [params.address, getProfile]);

  const handleVerify = async () => {
    if (!profile) return;
    
    setIsVerifying(true);
    try {
      await verifyProfile(params.address);
      // Update would happen via the contract events
    } catch (error) {
      console.error('Error verifying profile:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  // 添加调试信息
  useEffect(() => {
    console.log('Current address param:', params.address);
    console.log('Current profile state:', profile);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
  }, [params.address, profile, isLoading, error]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading profile: {error.message}</p>
        </div>
      )}
      
      <ProfileView 
        profile={profile} 
        address={params.address}
        isLoading={isLoading} 
        isOwner={false}
        isVerified={profile?.exists}
        isVerifying={isVerifying}
        onVerify={handleVerify}
      />
    </div>
  );
} 