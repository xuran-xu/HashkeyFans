'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWallets } from '@particle-network/connectkit';
import ProfileView from '@/components/profile/ProfileView';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { ProfileData } from '@/types/profile';
import { useDidContract } from '@/hooks/useDidContract';

// 完整的类型定义
interface Card {
  id: string;
  title: string;
  description: string;
  image_url: string;
  collected: boolean;
  quantity: number;
  owner_address: string;
}

interface CollectionStats {
  total_cards: number;
  collected_cards: number;
  total_points: number;
}

interface CollectionData {
  stats: CollectionStats;
  cards: Card[];
}

const defaultData: CollectionData = {
  stats: {
    total_cards: 0,
    collected_cards: 0,
    total_points: 0
  },
  cards: []
};

export default function ProfilePage() {
  const { isConnected } = useAccount();
  const [primaryWallet] = useWallets();
  const { getProfile } = useDidContract();
  
  const [profile, setProfile] = useState<ProfileData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [collectionData, setCollectionData] = useState<CollectionData>(defaultData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollectionLoading, setIsCollectionLoading] = useState(true);

  // 分离合约数据获取
  useEffect(() => {
    const fetchContractData = async () => {
      if (!primaryWallet?.accounts[0]) {
        setIsLoading(false);
        return;
      }

      try {
        const profileData = await getProfile(primaryWallet.accounts[0]);
        if (profileData) {
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Contract error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, [primaryWallet?.accounts[0], getProfile]);

  // 单独获取集合数据
  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!primaryWallet?.accounts[0]) {
        setIsCollectionLoading(false);
        return;
      }

      try {
        const collectionRes = await fetch('/api/user/collection-status', {
          headers: {
            'x-wallet-address': primaryWallet.accounts[0]
          }
        }).then(res => res.json());
        
        setCollectionData(collectionRes);
      } catch (err) {
        console.error('Collection error:', err);
      } finally {
        setIsCollectionLoading(false);
      }
    };

    fetchCollectionData();
  }, [primaryWallet?.accounts[0]]);

  useEffect(() => {
    const handleEditProfile = () => {
      console.log('Edit profile event received');
      setIsEditModalOpen(true);
    };
    const handleOpenCollection = () => setIsDrawerOpen(true);

    window.addEventListener('edit-profile', handleEditProfile);
    window.addEventListener('open-collection', handleOpenCollection);

    return () => {
      window.removeEventListener('edit-profile', handleEditProfile);
      window.removeEventListener('open-collection', handleOpenCollection);
    };
  }, []);

  if (!isConnected || !primaryWallet?.accounts?.[0]) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Banner Section Skeleton */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 relative">
          <div className="h-32 md:h-48 relative">
            {/* Action Buttons Skeleton */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <div className="w-32 h-8 rounded-full bg-white/20 animate-pulse"></div>
              <div className="w-32 h-8 rounded-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-base-100 p-6 relative">
            {/* Profile Image Skeleton */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
                <div className="w-full h-full rounded-full bg-base-100 animate-pulse"></div>
              </div>
            </div>

            {/* Profile Info Skeleton */}
            <div className="mt-16">
              <div className="h-8 w-48 bg-base-300 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-base-300 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-32 bg-base-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Details Section Skeleton */}
        <div className="bg-base-100 rounded-3xl p-6 space-y-6">
          {/* Social Accounts Skeleton */}
          <div>
            <div className="h-6 w-32 bg-base-300 rounded animate-pulse mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 w-48 bg-base-300 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Crypto Addresses Skeleton */}
          <div>
            <div className="h-6 w-32 bg-base-300 rounded animate-pulse mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 w-48 bg-base-300 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Modal open state:', isEditModalOpen);

  const walletAddress = primaryWallet.accounts[0];

  return (
    <>
      <ProfileView 
        address={walletAddress}
        isOwner={isConnected}
        profile={profile}
        isLoading={isLoading}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        address={walletAddress}
        profile={profile}
      />

      {/* Collection Drawer */}
      <div className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-base-100 transform transition-transform ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
        >
          {/* Drawer Header */}
          <div className="sticky top-0 z-10 bg-base-100 border-b border-base-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Collections</h2>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setIsDrawerOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Collection Categories */}
          <div className="p-4">
            {isCollectionLoading ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" defaultChecked /> 
                <div className="collapse-title text-lg font-medium">
                  Consensus 2024
                </div>
                <div className="collapse-content">
                  {/* Stats Mini Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="bg-base-100 p-3 rounded-lg">
                      <div className="text-sm opacity-70">Total</div>
                      <div className="text-xl font-bold">
                        {collectionData?.stats?.total_cards ?? defaultData.stats.total_cards}
                      </div>
                    </div>
                    <div className="bg-base-100 p-3 rounded-lg">
                      <div className="text-sm opacity-70">Collected</div>
                      <div className="text-xl font-bold">
                        {collectionData?.stats?.collected_cards ?? defaultData.stats.collected_cards}
                      </div>
                    </div>
                    <div className="bg-base-100 p-3 rounded-lg">
                      <div className="text-sm opacity-70">Points</div>
                      <div className="text-xl font-bold">
                        {collectionData?.stats?.total_points ?? defaultData.stats.total_points}
                      </div>
                    </div>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2">
                    {(collectionData?.cards ?? []).map(card => (
                      <div 
                        key={card.id} 
                        className={`bg-base-100 rounded-lg overflow-hidden ${!card.collected ? 'opacity-50' : ''}`}
                      >
                        <div className="flex h-24">
                          {/* Card Image */}
                          <div className="w-24 h-24 flex-shrink-0">
                            {card.image_url && (
                              <img
                                src={card.image_url}
                                alt={card.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          {/* Card Info */}
                          <div className="flex-1 p-3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{card.title}</h3>
                              {card.collected && (
                                <div className="badge badge-sm badge-primary">×{card.quantity}</div>
                              )}
                            </div>
                            <p className="text-sm opacity-70 line-clamp-2">{card.description}</p>
                            {card.collected && (
                              <div className="text-xs opacity-60 mt-1 truncate">
                                From: {card.owner_address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 为未来活动预留的分类 */}
            <div className="collapse collapse-arrow bg-base-200 mt-2">
              <input type="checkbox" /> 
              <div className="collapse-title text-lg font-medium">
                Coming Soon
              </div>
              <div className="collapse-content">
                <div className="text-center py-8 opacity-50">
                  Stay tuned for more collections!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 