import { icons } from '@/components/common/Icon';

export interface ProfileField {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  icon: keyof typeof icons;
}

export interface ProfileFieldCategory {
  id: string;
  name: string;
  fields: ProfileField[];
}

export const profileFields: ProfileFieldCategory[] = [
  {
    id: 'general',
    name: 'General',
    fields: [
      {
        id: 'nickname',
        name: 'Nickname',
        type: 'text',
        placeholder: 'Enter your nickname',
        icon: 'user'
      },
      {
        id: 'bio',
        name: 'Bio',
        type: 'text',
        placeholder: 'Tell us about yourself',
        icon: 'user'
      },
      {
        id: 'location',
        name: 'Location',
        type: 'text',
        placeholder: 'Where are you based?',
        icon: 'location'
      },
      {
        id: 'website',
        name: 'Website',
        type: 'url',
        placeholder: 'https://',
        icon: 'globe'
      }
    ]
  },
  {
    id: 'social',
    name: 'Social Media',
    fields: [
      {
        id: 'twitter',
        name: 'Twitter',
        type: 'text',
        placeholder: '@username',
        icon: 'twitter'
      },
      {
        id: 'discord',
        name: 'Discord',
        type: 'text',
        placeholder: 'username#0000',
        icon: 'discord'
      },
      {
        id: 'telegram',
        name: 'Telegram',
        type: 'text',
        placeholder: '@username',
        icon: 'telegram'
      },
      {
        id: 'github',
        name: 'GitHub',
        type: 'text',
        placeholder: '@username',
        icon: 'github'
      },
      {
        id: 'medium',
        name: 'Medium',
        type: 'text',
        placeholder: '@username',
        icon: 'medium'
      }
    ]
  },
  {
    id: 'address',
    name: 'Crypto Address',
    fields: [
      {
        id: 'ethereum',
        name: 'Ethereum',
        type: 'text',
        placeholder: '0x...',
        icon: 'ethereum'
      },
      {
        id: 'solana',
        name: 'Solana',
        type: 'text',
        placeholder: 'Solana address',
        icon: 'solana'
      },
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        type: 'text',
        placeholder: 'Bitcoin address',
        icon: 'bitcoin'
      }
    ]
  }
]; 