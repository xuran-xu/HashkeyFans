import React, { useState, useEffect } from 'react';
import { Icon, IconName } from '../common/Icon';
import { ProfileData } from '@/types/profile';
import { IpfsImage } from '@/components/common/IpfsImage';

export interface ProfileViewProps {
  profile?: ProfileData;
  address?: string;
  isLoading?: boolean;
  isOwner?: boolean;
  isVerified?: boolean;
  isVerifying?: boolean;
  onVerify?: () => void;
  disableNavigation?: boolean;
  onEdit?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  address,
  isLoading = false,
  isOwner = false,
  isVerified = false,
  isVerifying = false,
  onVerify,
  disableNavigation = false,
  onEdit,
}) => {
  const socialMapping: Record<string, string> = {
    twitter: 'https://twitter.com/',
    github: 'https://github.com/',
    telegram: 'https://t.me/',
    discord: 'https://discord.com/users/',
    medium: 'https://medium.com/@',
  };

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  // 组件挂载时添加动画效果
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 处理复制地址功能
  const handleCopyAddress = (addr: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(addr);
      setCopiedAddress(addr);
      setTimeout(() => setCopiedAddress(null), 2000); // 2秒后隐藏提示
    }
  };

  // 截断地址显示
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // 骨架屏组件
  const SkeletonView = () => (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-base-300/50"></div>
        
        <div className="relative px-6 py-8 sm:px-10 border-b border-base-200">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* 头像占位 */}
            <div className="relative flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/10 shadow-xl w-32 h-32 bg-base-300/50 animate-pulse"></div>
            
            {/* 个人信息占位 */}
            <div className="flex-grow flex flex-col items-center sm:items-start">
              <div className="w-48 h-8 bg-base-300/70 rounded-lg animate-pulse mb-4"></div>
              <div className="w-32 h-6 bg-base-300/60 rounded animate-pulse mb-4"></div>
              <div className="w-full max-w-2xl h-16 bg-base-300/50 rounded-lg animate-pulse mb-6"></div>
              
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-24 bg-base-300/40 rounded-full animate-pulse"></div>
                <div className="h-8 w-32 bg-base-300/40 rounded-full animate-pulse"></div>
                <div className="h-8 w-28 bg-base-300/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6 sm:px-10">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-base-300/70 animate-pulse mr-3"></div>
              <div className="h-6 w-40 bg-base-300/70 rounded animate-pulse"></div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-base-300/40 rounded-lg animate-pulse w-full h-14"></div>
              <div className="bg-base-300/40 rounded-lg animate-pulse w-full h-14"></div>
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <div className="loading loading-spinner loading-lg text-primary/50"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // 加载中状态显示
  if (isLoading) {
    return <SkeletonView />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative bg-base-100 rounded-box shadow-xl overflow-hidden">
        {/* 背景网格和渐变效果 - 增强Web3感 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-base-300/30 to-base-300/50 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-hexagon-pattern opacity-10"></div>

        {/* Banner 和 Profile 头像区域 */}
        <div className="relative px-6 py-8 sm:px-10 border-b border-base-200/50 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* 头像 - 增加发光效果 */}
            <div
              className={`relative flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 ${
                animate ? 'animate-border-pulse' : ''
              }`}
            >
              <div className="w-32 h-32">
                {profile?.avatar?.value ? (
                  profile.avatar.value.startsWith('ipfs://') ? (
                    <IpfsImage
                      ipfsUrl={profile.avatar.value}
                      alt={profile?.nickname || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={profile.avatar.value}
                      alt={profile?.nickname || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-base-300 flex items-center justify-center">
                    <Icon name="user" className="w-12 h-12 text-base-content/30" />
                  </div>
                )}
              </div>
              {/* 发光特效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 hover:opacity-30 transition-opacity"></div>
            </div>

            {/* 个人信息 */}
            <div className="flex-grow flex flex-col items-center sm:items-start">
              {/* 名称和编辑按钮 */}
              <div className="flex flex-col sm:flex-row w-full justify-between items-center mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  {profile?.nickname || `Anon ${address ? truncateAddress(address) : ''}`}
                </h1>
                
                {isOwner && onEdit && (
                  <button 
                    onClick={onEdit}
                    className="btn btn-sm btn-ghost bg-base-200/50 backdrop-blur-sm mt-2 sm:mt-0 hover:bg-base-200 border border-base-300/30 group transition-all"
                  >
                    <Icon name="camera" className="w-4 h-4 mr-1.5 group-hover:text-primary" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* 验证徽章和按钮 */}
              <div className="flex items-center gap-3 mb-3">
                {/* 验证状态 */}
                {isVerified && (
                  <div className="flex items-center py-1 px-3 rounded-full bg-green-100/20 border border-green-300/30 backdrop-blur-md text-green-400 text-sm shadow-sm">
                    <Icon name="check" className="w-4 h-4 mr-1" />
                    <span>Verified on Chain</span>
                  </div>
                )}
                
                {/* 验证按钮 */}
                {!isOwner && onVerify && (
                  <button
                    onClick={onVerify}
                    disabled={isVerifying || isVerified}
                    className={`btn btn-sm ${
                      isVerified
                        ? 'btn-success text-white'
                        : 'btn-ghost bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/10'
                    } rounded-full transition-all shadow-md`}
                  >
                    {isVerifying ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        <span>Verifying...</span>
                      </>
                    ) : isVerified ? (
                      <>
                        <Icon name="check" className="w-4 h-4" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Icon name="user" className="w-4 h-4" />
                        <span>Verify Profile</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 简介 */}
              <p className="text-base-content/70 text-center sm:text-left mb-4 max-w-2xl">
                {profile?.bio || 'No bio yet'}
              </p>

              {/* 社交媒体链接 */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {profile?.socials?.map(
                  (social) => {
                    const platform = social.platform;
                    const handle = social.handle;
                    const socialUrl = socialMapping[platform]
                      ? `${socialMapping[platform]}${handle}`
                      : null;

                    if (!handle) return null;

                    return (
                      <div
                        key={platform}
                        className="flex items-center text-sm text-base-content/70 hover:text-primary transition-all transform hover:scale-105"
                      >
                        <div className="p-1.5 rounded-full bg-base-200/50 backdrop-blur-sm mr-2">
                          <Icon name={platform as any} className="w-4 h-4" />
                        </div>
                        {socialUrl ? (
                          <a
                            href={socialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {handle}
                          </a>
                        ) : (
                          <span>{handle}</span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 地址区域 */}
        <div className="px-6 py-6 sm:px-10">
          {/* 钱包地址 */}
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 text-base-content/80 flex items-center">
              <Icon name="wallet" className="w-5 h-5 mr-2 text-primary/80" />
              <span>Wallet Addresses</span>
            </h2>
            <div className="space-y-3">
              {profile?.addresses?.map((addrInfo) => {
                // 记录每个地址的信息用于调试
                console.log(`Rendering address for chain: ${addrInfo.chain}`, addrInfo);
                
                // 根据链类型确定图标
                let iconName: IconName = 'globe';
                if (addrInfo.chain.toLowerCase() === 'ethereum') {
                  iconName = 'ethereum';
                } else if (addrInfo.chain.toLowerCase() === 'bitcoin') {
                  iconName = 'bitcoin';
                } else if (addrInfo.chain.toLowerCase() === 'solana') {
                  iconName = 'solana';
                }
                
                return (
                  <div 
                    key={addrInfo.chain} 
                    className="flex items-center justify-between bg-base-200/40 backdrop-blur-sm rounded-lg p-3 group hover:bg-base-200/60 transition-all border border-white/5 hover:border-primary/20"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-base-300/50 mr-3">
                        <Icon name={iconName} className="w-5 h-5 text-primary/80" />
                      </div>
                      <div>
                        <div className="text-xs text-base-content/50 mb-0.5 font-medium">{addrInfo.chain}</div>
                        <div className="text-sm font-mono text-base-content/90 flex items-center">
                          {truncateAddress(addrInfo.addr)}
                          <span className="text-xs ml-1 text-primary/50 hidden sm:inline">{addrInfo.addr}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://hashkey.blockscout.com/address/${addrInfo.addr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-ghost btn-xs opacity-50 group-hover:opacity-100 transition-opacity"
                        title="View on explorer"
                      >
                        <Icon name="externalLink" className="w-4 h-4" />
                      </a>
                      <button 
                        className="btn btn-circle btn-ghost btn-xs opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCopyAddress(addrInfo.addr)}
                        title="Copy address"
                      >
                        <Icon name={copiedAddress === addrInfo.addr ? "check" : "copy"} className="w-4 h-4" />
                        {copiedAddress === addrInfo.addr && (
                          <span className="absolute -top-8 right-0 text-xs bg-primary/90 text-white px-2 py-1 rounded">Copied!</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 