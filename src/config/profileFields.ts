export interface ProfileField {
  id: string;
  name: string;
  icon: string;
  type: 'text' | 'url' | 'address';
  placeholder?: string;
  validation?: RegExp;
  prefix?: string;
}

export interface ProfileCategory {
  id: string;
  name: string;
  fields: ProfileField[];
}

export const profileFields: ProfileCategory[] = [
  {
    id: 'general',
    name: 'General',
    fields: [
      {
        id: 'nickname',
        name: 'Nickname',
        icon: 'user',
        type: 'text',
        placeholder: 'Enter your nickname'
      },
      {
        id: 'bio',
        name: 'Short Bio',
        icon: 'document-text',
        type: 'text',
        placeholder: 'Tell us about yourself'
      },
      {
        id: 'location',
        name: 'Location',
        icon: 'location',
        type: 'text',
        placeholder: 'Where are you based?'
      },
      {
        id: 'website',
        name: 'Website',
        icon: 'globe',
        type: 'url',
        placeholder: 'https://'
      }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    fields: [
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'twitter',
        type: 'text',
        prefix: '@'
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: 'github',
        type: 'text'
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: 'discord',
        type: 'text'
      },
      {
        id: 'telegram',
        name: 'Telegram',
        icon: 'telegram',
        type: 'text',
        prefix: '@'
      }
    ]
  },
  {
    id: 'address',
    name: 'Address',
    fields: [
      {
        id: 'eth',
        name: 'ETH',
        icon: 'ethereum',
        type: 'address'
      },
      {
        id: 'btc',
        name: 'BTC',
        icon: 'bitcoin',
        type: 'address'
      },
      {
        id: 'sol',
        name: 'SOL',
        icon: 'solana',
        type: 'address'
      }
    ]
  }
]; 