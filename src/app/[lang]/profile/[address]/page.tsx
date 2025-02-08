'use client';

import { useParams } from 'next/navigation';
import { useAccount } from '@particle-network/connectkit';
import { useState, useEffect } from 'react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ProfileData } from '@/types/profile';
import { useDidContract } from '@/hooks/useDidContract';
import ProfileView from '@/components/profile/ProfileView';

export default function ProfilePage() {
  const params = useParams();
  const { address } = useAccount();
  const profileAddress = params.address as string;
  const isOwner = address === profileAddress;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>();
  const { getProfile } = useDidContract();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileAddress) return;
      const data = await getProfile(profileAddress);
      console.log('Profile data:', data);
      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [profileAddress, getProfile]);

  return (
    <>
      <ProfileView 
        address={profileAddress} 
        isOwner={isOwner} 
        profile={profile} 
      />

      {/* Action Buttons */}
      {isOwner && (
        <div className="fixed bottom-6 right-6 flex gap-4">
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit profile
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        address={profileAddress}
        profile={profile}
      />
    </>
  );
} 