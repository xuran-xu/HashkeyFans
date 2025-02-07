import { FC } from 'react';
import { shortenAddress } from '@/utils/address';
import Image from 'next/image';

interface ProfileViewProps {
  address: string;
  isOwner: boolean;
}

const ProfileView: FC<ProfileViewProps> = ({ address, isOwner }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {/* 这里可以放置用户头像，暂时用简单的圆形占位 */}
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{shortenAddress(address)}</h1>
            {isOwner && (
              <span className="text-sm text-gray-500">
                This is your profile
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Attractions Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Collected Attractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 这里将来会展示收集的景点 */}
          <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
            No attractions yet
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView; 