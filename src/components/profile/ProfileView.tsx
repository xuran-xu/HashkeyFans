import { FC } from 'react';
import { Icon } from '../common/Icon';
import { ProfileData } from '@/types/profile';
import { IpfsImage } from '@/components/common/IpfsImage';

interface ProfileViewProps {
  address: string;
  isOwner: boolean;
  profile?: ProfileData;
  isLoading?: boolean;
}

const icons = {
  // Add any necessary icon imports here
};

const ipfsToHttp = (ipfsUrl: string) => {
  if (!ipfsUrl) return '';
  // 移除 ipfs:// 前缀，获取 CID
  const cid = ipfsUrl.replace('ipfs://', '');
  // 可以使用多个网关，这里列出常用的
  return [
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://4everland.io/ipfs/${cid}`,
  ][0]; // 使用第一个网关
};

const ProfileView: FC<ProfileViewProps> = ({ address, isOwner, profile, isLoading }) => {
  console.log('Profile data:', profile);
  console.log('Avatar URL:', profile?.avatar?.value);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner & Profile Section */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 relative">
        <div className="h-32 md:h-48 relative">
          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {isOwner && (
              <button 
                className="btn btn-sm text-white bg-white/20 hover:bg-white/30 border-white/30"
                onClick={() => {
                  console.log('Edit button clicked');
                  window.dispatchEvent(new CustomEvent('edit-profile'));
                }}
              >
                <Icon name="plus" className="w-4 h-4 mr-2" />
                Edit profile
              </button>
            )}
            <button 
              className="btn btn-sm text-white bg-white/20 hover:bg-white/30 border-white/30"
              onClick={() => window.dispatchEvent(new CustomEvent('open-collection'))}
            >
              <Icon name="grid" className="w-4 h-4 mr-2" />
              My Collection
            </button>
          </div>
        </div>
        <div className="bg-base-100 p-6 relative">
          {/* Profile Image */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden">
                {profile?.avatar?.value ? (
                  <IpfsImage
                    ipfsUrl={profile.avatar.value}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="user" className="w-16 h-16 text-base-content/20" />
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16">
            <h1 className="text-3xl font-bold mb-2">
              {profile?.nickname || address.slice(0, 6) + '...' + address.slice(-4)}
            </h1>
            {profile?.bio && (
              <p className="text-base-content/60 mb-2">{profile.bio}</p>
            )}
            {isOwner && (
              <div className="inline-flex items-center px-3 py-1 bg-success/20 text-success rounded-full text-sm">
                <Icon name="check" className="w-4 h-4 mr-1" />
                Your primary name
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-base-100 rounded-3xl p-6 space-y-6">
        {/* Social Accounts */}
        {(profile?.socials ?? []).length > 0 && (
          <div>
            <h2 className="text-xl text-base-content/60 mb-4">Accounts</h2>
            <div className="flex flex-wrap gap-2">
              {profile?.socials?.map((social, index) => (
                <div key={index} className="inline-flex items-center space-x-2 bg-base-200 px-4 py-2 rounded-full">
                  <Icon name={social.platform.toLowerCase() as keyof typeof icons} className="w-6 h-6 text-primary" />
                  <span>{social.handle}</span>
                  <Icon name="chevronRight" className="w-4 h-4 text-base-content/40" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crypto Addresses */}
        {(profile?.addresses ?? []).length > 0 && (
          <div>
            <h2 className="text-xl text-base-content/60 mb-4">Addresses</h2>
            <div className="flex flex-wrap gap-2">
              {profile?.addresses?.map((addr, index) => (
                <div key={index} className="inline-flex items-center space-x-2 bg-base-200 px-4 py-2 rounded-full">
                  <Icon name={addr.chain.toLowerCase() as keyof typeof icons} className="w-6 h-6 text-base-content/60" />
                  <span>{addr.addr.slice(0, 6) + '...' + addr.addr.slice(-4)}</span>
                  <Icon name="copy" className="w-4 h-4 text-base-content/40" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 