'use client'

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useTranslation } from "react-i18next";

interface ShareModalProps {
  onClose: () => void;
  remainingCount: number;
  id: string;
  isCreator: boolean;
  totalAmount: string;
}

export function ShareModal({ 
  onClose, 
  remainingCount,
  id,
  isCreator,
  totalAmount 
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3
      });
      const link = document.createElement('a');
      link.download = `redpacket-${id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        <div ref={cardRef} className="bg-gradient-to-b from-[#1a1a1a] to-[#FF3B3B] rounded-2xl overflow-hidden">
          <div>
            <img src="/img/cover.png" alt="HSK Cover" className="w-full" />
          </div>

          <div className="bg-[#FF3B3B] p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-normal text-white/80 mb-3">
                {isCreator ? t('redpacket.share.title') : t('redpacket.share.claimed')}
              </h3>
              
              <div className="text-2xl font-bold text-white mb-3">
                HashKey Chain 
              </div>
              
              <div className="text-[#FFD700] text-5xl font-bold mb-3">
                {totalAmount}
                <span className="text-2xl ml-2">{t('redpacket.unit')}</span>
              </div>
              
              <div className="text-white text-lg">
                {remainingCount > 0 
                  ? t('redpacket.share.remaining')
                  : t('redpacket.share.noRemaining')
                }
              </div>

              {isCreator && (
                <div className="text-white/80 text-sm mt-2">
                  总价值 {totalAmount} HSK
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-3">
              <QRCode 
                value={`${window.location.origin}/redpacket/${id}`}
                size={100}
                className="bg-white p-1 rounded-xl"
              />
              <p className="text-white/80 text-sm">Scan to Claim</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-[#FF3B3B] py-3 rounded-full font-bold"
          >
            Save Image
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/10 text-white py-3 rounded-full font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 