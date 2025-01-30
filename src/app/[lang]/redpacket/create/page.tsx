'use client'

import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Log } from 'viem';
import { CreateRedPacket } from '@/components/redpacket/CreateRedPacket';
import { RedPacket } from '@/components/redpacket/RedPacket';
import { useCreateRedPacket } from '@/hooks/useRedPacket';
import { SuccessModal } from '@/components/redpacket/SuccessModal';
import { useTranslation } from "react-i18next";
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 直接使用实际的事件 topic
const PACKET_CREATED_TOPIC = '0x4337e485ef64fde4e43126cb01f1eb59ac3e745b7659977dbbec7e00d3e4dcd2';

export default function CreateRedPacketPage() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { createRedPacket, isLoading, error, hash } = useCreateRedPacket();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: hash === '0x0' ? undefined : hash
  });
  
  const [preview, setPreview] = useState({
    message: 'HashKey Chain',
    amount: 0,
    count: 0
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [packetId, setPacketId] = useState<string>();

  useEffect(() => {
    if (receipt?.logs) {
      const event = receipt.logs.find(
        (log: Log) => log.topics[0] === PACKET_CREATED_TOPIC
      );
      if (event?.topics[1]) {
        const id = BigInt(event.topics[1]).toString();
        setPacketId(id);
        setShowSuccessModal(true);
      } else {
        console.log('No matching event found');
      }
    }
  }, [receipt]);

  const handleSubmit = async (data: {
    amount: number;
    count: number;
    message: string;
  }) => {
    try {
      // 验证红包个数必须是正整数
      if (!Number.isInteger(data.count) || data.count <= 0) {
        alert(t('redpacket.create.validation.countInteger'));
        return;
      }

      if (data.amount <= 0) {
        alert(t('redpacket.create.validation.amountMin'));
        return;
      }

      if (data.amount < 0.01) {
        alert(t('redpacket.create.validation.amountMin'));
        return;
      }

      setShowSuccessModal(false); // 重置状态
      setPacketId(undefined);
      await createRedPacket(data.message, data.amount, data.count);
    } catch (err) {
      console.error('Failed to create red packet:', err);
    }
  };

  // 如果用户未连接钱包，显示连接提示
  if (!address) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(100vh-180px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-xl">
              <p className="text-white/80 mb-6">{t('redpacket.create.connect')}</p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col min-h-[calc(100vh-180px)]">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto h-full">
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <CreateRedPacket 
                onSubmit={handleSubmit}
                preview={preview}
                setPreview={setPreview}
                isLoading={isLoading || isConfirming}
                error={error}
              />
            </div>
            
            <div className="w-full">
              <h2 className="text-xl font-bold mb-8 text-center text-[#FFD700]">
                {t('redpacket.create.preview')}
              </h2>
              <div className="max-w-3xl mx-auto p-1 rounded-xl">
                <RedPacket
                  message={preview.message || t('redpacket.create.form.messagePlaceholder')}
                  onOpen={() => {}}
                  isOpened={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showSuccessModal && packetId && (
        <SuccessModal
          amount={preview.amount.toString()}
          count={preview.count}
          message={preview.message}
          id={packetId}
        />
      )}
    </>
  );
} 