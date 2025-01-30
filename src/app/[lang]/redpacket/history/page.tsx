'use client'

import { useState } from 'react';
import { useUserRedPackets, useRedPacketInfo } from '@/hooks/useRedPacket';
import { formatAddress } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const RedPacketCard = ({ id }: { id: bigint }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { info, isLoading } = useRedPacketInfo(id.toString());

  if (isLoading || !info) {
    return (
      <div className="animate-pulse bg-[#1a1a1a] p-6 rounded-xl space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    );
  }

  const formattedId = id.toString().length > 10 
    ? `#${id.toString().slice(0, 4)}...${id.toString().slice(-6)}`
    : `#${id.toString()}`;

  const handleClick = () => {
    router.push(`/redpacket/${id.toString()}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="p-6 rounded-xl bg-[#1a1a1a]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white/80">{t('redpacket.history.title')} {formattedId}</span>
          <span className="text-sm text-gray-400">{formatAddress(info.creator)}</span>
        </div>
        <p className="text-white mb-4">{info.message}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">
            {info.isRefunded ? (
              <span className="text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full">
                {t('redpacket.status.refunded')}
              </span>
            ) : (
              `${info.claimed} / ${info.totalCount} ${t('redpacket.history.count')}`
            )}
          </span>
          <span className="text-[#FFD700]">{info.totalAmount} {t('redpacket.unit')}</span>
        </div>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { created, claimed, isLoading } = useUserRedPackets();
  const [activeTab, setActiveTab] = useState<'created' | 'claimed'>('created');

  if (!address) {
    return (
      <div className="flex-1 flex items-center justify-center  min-h-[calc(100vh-180px)]">
        <div className="bg-[#1a1a1a] p-6 rounded-xl">
          <p className="text-white/80 mb-6">{t('redpacket.history.connect')}</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white/80">{t('redpacket.history.loading')}</div>
      </div>
    );
  }

  const packets = activeTab === 'created' ? created : claimed;

  return (
    <div className="flex-1 min-h-[calc(100vh-180px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'created'
                  ? 'bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white'
                  : 'text-white/60'
              }`}
            >
              {t('redpacket.history.created')}
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'claimed'
                  ? 'bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white'
                  : 'text-white/60'
              }`}
            >
              {t('redpacket.history.received')}
            </button>
          </div>

          <div className="space-y-4">
            {packets.length > 0 ? (
              packets.map((id) => (
                <RedPacketCard key={id.toString()} id={id} />
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                {t('redpacket.history.empty')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 