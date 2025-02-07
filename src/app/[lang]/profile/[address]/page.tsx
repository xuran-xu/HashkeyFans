'use client';

import { useParams } from 'next/navigation';
import { useAccount } from '@particle-network/connectkit';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';
import { formatAddress } from '@/utils/format';
import { useState } from 'react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const params = useParams();
  const { address } = useAccount();
  const profileAddress = params.address as string;
  const isOwner = address?.toLowerCase() === profileAddress?.toLowerCase();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner & Profile Section */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
        <div className="h-32 md:h-48"></div>
        <div className="bg-white dark:bg-gray-900 p-6 relative">
          {/* Profile Image */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16">
            <h1 className="text-3xl font-bold mb-2">{formatAddress(profileAddress)}</h1>
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <Icon name="check-circle" className="w-4 h-4 mr-1" />
              Your primary name
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 space-y-6">
        <div>
          <h2 className="text-xl text-gray-500 mb-4">Accounts</h2>
          <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <Icon name="telegram" className="w-6 h-6 text-blue-600" />
            <span>bitfrancis</span>
            <Icon name="external-link" className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <h2 className="text-xl text-gray-500 mb-4">Addresses</h2>
          <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <Icon name="ethereum" className="w-6 h-6 text-gray-600" />
            <span>{profileAddress.slice(0, 6)}...{profileAddress.slice(-4)}</span>
            <button className="hover:text-gray-600">
              <Icon name="copy" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl text-gray-500 mb-4">Ownership</h2>
          <Link href="#" className="text-blue-600 hover:text-blue-700">
            View
            <Icon name="arrow-right" className="w-4 h-4 inline ml-1" />
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button className="btn btn-outline">
          Verifications
        </button>
        {isOwner && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit profile
          </button>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        address={profileAddress}
      />
    </div>
  );
} 