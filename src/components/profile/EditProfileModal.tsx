import { FC, useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { AddProfileFieldModal } from './AddProfileFieldModal';
import { ProfileField, profileFields } from '@/config/profileFields';
import { ProfileData } from '@/types/profile';
import { useDidContract } from '@/hooks/useDidContract';
import { icons } from '../common/Icon';
import { useDropzone } from 'react-dropzone';
import { IpfsImage } from '@/components/common/IpfsImage';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  profile?: ProfileData;
}

interface ProfileValue {
  fieldId: string;
  value: string;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose, address, profile }) => {
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const { 
    initProfile, 
    batchUpdateProfile,
  } = useDidContract();
  const [profileValues, setProfileValues] = useState<ProfileValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar?.value || '');
  const [isSaving, setIsSaving] = useState(false);
  // 使用传入的 profile 数据初始化
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    try {
      if (profile) {
        setProfileValues([
          { fieldId: 'nickname', value: profile.nickname },
          { fieldId: 'bio', value: profile.bio },
          { fieldId: 'ethereum', value: address },
          ...profile.socials.map(social => ({
            fieldId: social.platform,
            value: social.handle
          })),
          ...profile.addresses
            .filter(addr => addr.chain !== 'ethereum')
            .map(addr => ({
              fieldId: addr.chain,
              value: addr.addr
            }))
        ]);
        // 设置头像
        if (profile.avatar?.value) {
          setAvatarUrl(profile.avatar.value);
        }
      } else {
        setProfileValues([
          { fieldId: 'ethereum', value: address }
        ]);
      }
    } catch (error) {
      console.error('Error initializing profile:', error);
    } finally {
      setLoading(false);
    }
  }, [isOpen, profile, address]);

  const handleClose = () => {
    onClose();
    if (profile?.exists) {
      setProfileValues([
        { fieldId: 'nickname', value: profile.nickname },
        { fieldId: 'bio', value: profile.bio },
        { fieldId: 'ethereum', value: address },
        ...profile.socials.map(social => ({
          fieldId: social.platform,
          value: social.handle
        })),
        ...profile.addresses
          .filter(addr => addr.chain !== 'ethereum')
          .map(addr => ({
            fieldId: addr.chain,
            value: addr.addr
          }))
      ]);
    } else {
      setProfileValues([
        { fieldId: 'ethereum', value: address }
      ]);
    }
  };

  const handleAddField = (fields: ProfileField[]) => {
    setProfileValues(prev => [
      ...prev,
      ...fields.map(field => ({ fieldId: field.id, value: '' }))
    ]);
  };

  const handleRemoveField = (fieldId: string) => {
    if (fieldId === 'ethereum') return;
    setProfileValues(prev => prev.filter(v => v.fieldId !== fieldId));
  };

  const handleValueChange = (fieldId: string, value: string) => {
    setProfileValues(prev => 
      prev.map(v => v.fieldId === fieldId ? { ...v, value } : v)
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const newNickname = profileValues.find(v => v.fieldId === 'nickname')?.value || '';
      const newBio = profileValues.find(v => v.fieldId === 'bio')?.value || '';
      const location = profileValues.find(v => v.fieldId === 'location')?.value || '';
      const website = profileValues.find(v => v.fieldId === 'website')?.value || '';

      // 打印所有的profileValues用于调试
      console.log('All profile values before save:', profileValues);

      if (!profile?.exists) {
        await initProfile(newNickname, newBio);
      } else {
        // 定义社交媒体平台列表
        const socialPlatforms = ['twitter', 'discord', 'telegram', 'github', 'medium'];
        
        // 找出所有加密货币地址
        const cryptoAddresses = profileValues
          .filter(v => {
            // 检查是否为加密地址类型并且有值
            const isAddressType = ['ethereum', 'bitcoin', 'solana'].includes(v.fieldId);
            const hasValue = !!v.value;
            // 跳过以太坊地址（已经在DID合约中）
            const isNotEthereum = v.fieldId !== 'ethereum';
            
            console.log(`Field ${v.fieldId}:`, { 
              isAddressType, 
              hasValue, 
              isNotEthereum, 
              willInclude: isAddressType && hasValue && isNotEthereum 
            });
            
            return isAddressType && hasValue && isNotEthereum;
          })
          .map(v => ({
            chain: v.fieldId,
            addr: v.value
          }));
        
        console.log('Crypto addresses to update:', cryptoAddresses);
        
        const updateData = {
          nickname: newNickname,
          bio: newBio,
          avatarUrl,
          socialAccounts: profileValues
            .filter(v => socialPlatforms.includes(v.fieldId) && v.value)
            .map(v => ({
              platform: v.fieldId,
              handle: v.value
            })),
          cryptoAddresses
        };

        // 如果有location或website字段，将它们添加到社交账户中
        if (location) {
          updateData.socialAccounts.push({
            platform: 'location',
            handle: location
          });
        }
        
        if (website) {
          updateData.socialAccounts.push({
            platform: 'website',
            handle: website
          });
        }

        console.log('Final update data:', updateData);
        await batchUpdateProfile(updateData);
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getIconName = (fieldId: string) => {
    const socialIcons = {
      twitter: 'twitter',
      discord: 'discord',
      telegram: 'telegram',
      github: 'github',
      medium: 'medium',
      ethereum: 'ethereum',
      solana: 'solana',
      bitcoin: 'bitcoin',
      location: 'location',
      website: 'globe'
    } as const;
    
    return (socialIcons[fieldId as keyof typeof socialIcons] || 'user') as keyof typeof icons;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('address', address);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setAvatarUrl(data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [address]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Edit your profile">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
              <span className="mt-4 text-base-content/70 text-sm">Loading your profile...</span>
            </div>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
            <div className="absolute inset-0 bg-hexagon-pattern opacity-5 -z-10"></div>
            
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all hover:scale-105 cursor-pointer">
                  {avatarUrl ? (
                    avatarUrl.startsWith('ipfs://') ? (
                      <IpfsImage
                        ipfsUrl={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
                      <Icon name="user" className="w-10 h-10 text-white/70" />
                    </div>
                  )}
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 hover:opacity-30 transition-opacity"></div>
                </div>
                <button 
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 text-white rounded-full p-2 shadow-lg border-2 border-white/30 backdrop-blur-sm transform transition-transform hover:scale-110"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon name="camera" className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="space-y-4">
              {profileValues.map(({ fieldId, value }) => {
                const field = profileFields.flatMap(c => c.fields).find(f => f.id === fieldId);
                if (!field) return null;

                const isEthereum = fieldId === 'ethereum';
                return (
                  <div key={fieldId} className="space-y-2">
                    <label className="text-base-content/70 text-sm font-medium">{field.name}</label>
                    <div className={`flex items-center space-x-2 bg-base-200/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 transition-all ${isEthereum ? '' : 'hover:border-primary/20'}`}>
                      <div className="p-1.5 rounded-full bg-base-300/50 flex-shrink-0">
                        <Icon name={getIconName(field.id)} className="w-5 h-5 text-primary/80" />
                      </div>
                      <input
                        type={field.type}
                        value={value}
                        onChange={(e) => handleValueChange(fieldId, e.target.value)}
                        className="flex-1 bg-transparent focus:outline-none placeholder:text-base-content/30 text-base-content/90"
                        placeholder={field.placeholder}
                        disabled={isEthereum}
                      />
                      {!isEthereum && (
                        <button 
                          onClick={() => handleRemoveField(fieldId)}
                          className="text-base-content/40 hover:text-base-content/70 transition-colors p-1.5 rounded-full hover:bg-base-300/30"
                        >
                          <Icon name="x" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add More Button */}
            <button
              onClick={() => setIsAddFieldModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-base-content/10 hover:border-primary/40 text-base-content/60 hover:text-primary/80 flex items-center justify-center space-x-2 transition-all bg-base-200/20 hover:bg-base-200/40 backdrop-blur-sm"
            >
              <Icon name="plus" className="w-5 h-5" />
              <span>Add more to profile</span>
            </button>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl bg-base-200/60 hover:bg-base-200/80 text-base-content/70 hover:text-base-content/90 transition-all shadow-sm border border-white/5"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white relative shadow-md shadow-primary/20 transition-all"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="opacity-0">Save</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  </>
                ) : 'Save'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <AddProfileFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onSelect={handleAddField}
        existingFields={profileValues.map(v => v.fieldId)}
      />
    </>
  );
}; 