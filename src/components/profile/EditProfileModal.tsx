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
      const newNickname = profileValues.find(v => v.fieldId === 'nickname')?.value || '';
      const newBio = profileValues.find(v => v.fieldId === 'bio')?.value || '';

      if (!profile?.exists) {
        await initProfile(newNickname, newBio);
      } else {
        const updateData = {
          nickname: newNickname,
          bio: newBio,
          avatarUrl,
          socialAccounts: profileValues
            .filter(v => {
              const field = profileFields
                .find(c => c.id === 'social')
                ?.fields.find(f => f.id === v.fieldId);
              return field?.type === 'social' && v.value;
            })
            .map(v => ({
              platform: v.fieldId,
              handle: v.value
            })),
          cryptoAddresses: profileValues
            .filter(v => {
              const field = profileFields
                .find(c => c.id === 'address')
                ?.fields.find(f => f.id === v.fieldId);
              return field?.type === 'address' && v.value && v.fieldId !== 'ethereum';
            })
            .map(v => ({
              chain: v.fieldId,
              addr: v.value
            }))
        };

        await batchUpdateProfile(updateData);
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving profile:', error);
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
      bitcoin: 'bitcoin'
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                    <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500" />
                  )}
                </div>
                <button 
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
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
            {profileValues.map(({ fieldId, value }) => {
              const field = profileFields.flatMap(c => c.fields).find(f => f.id === fieldId);
              if (!field) return null;

              const isEthereum = fieldId === 'ethereum';
              return (
                <div key={fieldId} className="space-y-2">
                  <label className="text-gray-500">{field.name}</label>
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl">
                    <Icon name={getIconName(field.id)} className="w-6 h-6" />
                    <input
                      type={field.type}
                      value={value}
                      onChange={(e) => handleValueChange(fieldId, e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none"
                      placeholder={field.placeholder}
                      disabled={isEthereum}
                    />
                    {!isEthereum && (
                      <button 
                        onClick={() => handleRemoveField(fieldId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Icon name="x" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add More Button */}
            <button
              onClick={() => setIsAddFieldModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 flex items-center justify-center space-x-2"
            >
              <Icon name="plus" className="w-5 h-5" />
              <span>Add more to profile</span>
            </button>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
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