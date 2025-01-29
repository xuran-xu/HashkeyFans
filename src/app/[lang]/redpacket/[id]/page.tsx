'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { RedPacket } from '@/components/redpacket/RedPacket';
import { useRedPacketInfo, useRedPacketClaimed, useClaimRedPacket, useRedPacketClaims } from '@/hooks/useRedPacket';
import { useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatAddress } from '@/utils/format';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toPng } from 'html-to-image';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { FaTrophy } from 'react-icons/fa';

// 骨架屏组件
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-40 bg-gray-700 rounded-xl"></div>
    <div className="h-10 w-32 mx-auto bg-gray-700 rounded-full"></div>
  </div>
);

// 分享结果组件
const ShareModal = ({ 
  onClose, 
  totalCount,
  remainingCount,
  creator,
  id,
  isCreator,
  totalAmount
}: { 
  onClose: () => void;
  totalCount: number;
  remainingCount: number;
  creator: string;
  id: string;
  isCreator: boolean;
  totalAmount: string;
}) => {
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

  const getContent = () => {
    if (isCreator) {
      return {
        title: t('redpacket.share.title'),
        subtitle: t('redpacket.share.remaining', {
          value: totalAmount,
          unit: t('redpacket.unit'),
          count: remainingCount
        }),
        showAmount: false
      };
    }
    return {
      title: t('redpacket.share.claimed'),
      subtitle: remainingCount > 0 
        ? t('redpacket.share.remainingCount', {
            remaining: remainingCount,
            total: totalCount
          })
        : t('redpacket.share.from', {
            address: formatAddress(creator)
          }),
      showAmount: true
    };
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        {/* 分享卡片 */}
        <div ref={cardRef} className="bg-gradient-to-b from-[#1a1a1a] to-[#FF3B3B] rounded-2xl overflow-hidden">
          {/* 顶部图片区域 */}
          <div className="">
            <img 
              src="/img/cover.png" 
              alt="HSK Cover"
              className="w-full"
            />
          </div>

          {/* 内容区域 - 红色背景 */}
          <div className="bg-[#FF3B3B] p-8 space-y-8">
            {/* 金额信息 */}
            <div className="text-center">
              {/* 上面一行 - 小号细体 */}
              <h3 className="text-lg font-normal text-white/80 mb-3">
                {content.title}
              </h3>
              
              {/* 中间一行 - 大号粗体 */}
              <div className="text-2xl font-bold text-white mb-3">
                HashKey Chain 
              </div>
              
              {/* 金额显示 */}
              <div className="text-[#FFD700] text-5xl font-bold mb-3">
                {totalAmount}
                <span className="text-2xl ml-2">{t('redpacket.unit')}</span>
              </div>
              
              {/* 剩余状态显示 */}
              <div className="text-sm font-normal text-white/80">
                {remainingCount > 0 
                  ? t('redpacket.share.remainingStatus', {
                      count: remainingCount,
                      total: totalCount
                    })
                  : t('redpacket.share.noRemaining')
                }
              </div>
            </div>

            {/* 二维码 */}
            <div className="flex flex-col items-center space-y-3">
              <QRCode 
                value={`${window.location.origin}/redpacket/${id}`}
                size={100}
                className="bg-white p-1 rounded-xl"
              />
              <p className="text-white/80 text-sm">{t('redpacket.share.scanQR')}</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-[#FF3B3B] py-3 rounded-full font-bold"
          >
            {t('redpacket.share.saveImage')}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white/10 text-white py-3 rounded-full font-bold"
          >
            {t('redpacket.share.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareModalWrapperProps {
  info: {
    totalCount: number;
    remainingCount: number;
    creator: string;
    totalAmount: string;
  };
  onClose: () => void;
  claimedAmount: string;
  id: string;
  address: string;
}

const ShareModalWrapper = ({ info, ...props }: ShareModalWrapperProps) => {
  console.log('ShareModal Wrapper Props:', { info, ...props });
  
  if (!info) return null;
  
  return (
    <ShareModal
      onClose={props.onClose}
      totalCount={info.totalCount}
      remainingCount={info.remainingCount}
      creator={info.creator}
      id={props.id}
      isCreator={info.creator === props.address}
      totalAmount={info.totalAmount}
    />
  );
};

export default function RedPacketDetailPage() {
  const { id } = useParams();
  const { info, isLoading: loadingInfo, refetch: refetchInfo } = useRedPacketInfo(id as string);
  const { hasClaimed, claimedAmount, isLoading: loadingClaim, refetch: refetchClaim } = useRedPacketClaimed(id as string);
  const { claims, isLoading: loadingClaims, refetch: refetchClaims } = useRedPacketClaims(id as string);
  const { claimRedPacket, isLoading: isClaimLoading, hash } = useClaimRedPacket();
  const [showDetails, setShowDetails] = useState(false);
  const { address } = useAccount();
  const [showShareModal, setShowShareModal] = useState(false);
  const { t } = useTranslation();

  // 监听交易状态
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash === '0x0' ? undefined : hash,
  });

  // 添加一个新的状态来控制领取过程
  const [isClaiming, setIsClaiming] = useState(false);

  // 修改加载状态判断
  const isLoading = loadingInfo || loadingClaim || loadingClaims || isClaimLoading || isConfirming || !info || isClaiming;

  // 修改 handleAction 函数
  const handleAction = async () => {
    if (canClaim) {
      try {
        setIsClaiming(true);
        setShowDetails(false);
        await claimRedPacket(id as string);
      } catch (err) {
        console.error('Failed to claim:', err);
        toast.error(err instanceof Error ? err.message : 'Failed to claim red packet', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsClaiming(false);
        setShowDetails(true);
      }
    } else {
      setShowDetails(true);
    }
  };

  // 修改 useEffect，在交易成功后重置状态
  useEffect(() => {
    if (isSuccess && hash !== '0x0') {
      const timer = setTimeout(async () => {
        try {
          await Promise.all([
            refetchInfo?.(),
            refetchClaim?.(),
            refetchClaims?.()
          ]);
          setShowDetails(true);
          setShowShareModal(true);
          setIsClaiming(false);
          toast.success(t('redpacket.claim.success'), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } catch (err) {
          console.error('Failed to refresh data:', err);
          setIsClaiming(false);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, refetchInfo, refetchClaim, refetchClaims, t]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(100vh-180px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }

  const isCreator = info.creator === address;
  const hasRemaining = info.remainingCount > 0;
  // 修改 canClaim 逻辑，允许创建者也可以领取
  const canClaim = !hasClaimed && hasRemaining;

  // 修改显示详情的条件
  const shouldShowDetails = !canClaim || showDetails || (isCreator && !hasRemaining);

  // 如果用户未连接钱包，显示连接提示
  if (!address) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(100vh-180px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <RedPacket
              message={info?.message || 'HashKey Chain'}
              onOpen={() => {}}
              isOpened={true}
            />
            <div className="bg-[#1a1a1a] p-6 rounded-xl max-w-sm mx-auto">
              <p className="text-white/80 mb-6">{t('redpacket.claim.connect')}</p>
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
        <div className="container mx-auto px-2 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 红包预览 */}
            <RedPacket
              message={info.message}
              onOpen={handleAction}
              isOpened={hasClaimed || !hasRemaining || isCreator} // 创建者总是看到打开状态
            />

            {/* 操作按钮区域 */}
            <div className="text-center flex gap-4 justify-center">
              {/* 创建者且未领取时显示两个按钮 */}
              {isCreator && !hasClaimed && hasRemaining ? (
                <>
                  <button
                    onClick={handleAction}
                    disabled={isClaimLoading || isConfirming}
                    className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
                  >
                    {isClaimLoading || isConfirming ? t('redpacket.claim.processing') : t('redpacket.claim.button')}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-[#FF3B3B] px-8 py-3 rounded-full font-bold"
                  >
                    {t('redpacket.share.button')}
                  </button>
                </>
              ) : canClaim ? (
                // 非创建者且可领取时只显示领取按钮
                <button
                  onClick={handleAction}
                  disabled={isClaimLoading || isConfirming}
                  className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
                >
                  {isClaimLoading || isConfirming ? t('redpacket.claim.processing') : t('redpacket.claim.button')}
                </button>
              ) : (hasClaimed || isCreator) && (
                // 已领取或是创建者时显示分享按钮
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-[#FF3B3B] px-8 py-3 rounded-full font-bold"
                >
                  {t('redpacket.share.button')}
                </button>
              )}
            </div>

            {/* 详情部分 */}
            {shouldShowDetails && (
              <>
                {/* 领取进度卡片 */}
                <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                  <div className="p-6 rounded-xl bg-[#1a1a1a] relative overflow-hidden">
                    {/* 装饰性背景 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FF3B3B]/10 to-transparent rounded-full blur-2xl" />
                    
                    {/* 内容区域 */}
                    <div className="relative">
                      {/* 总金额和领取进度 */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-white/60 text-sm mb-2">{t('redpacket.details.totalAmount')}</p>
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-[#FFD700]">{info.totalAmount}</span>
                            <span className="text-lg text-[#FFD700] ml-2">{t('redpacket.unit')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-sm mb-2">{t('redpacket.details.progress')}</p>
                          <div className="flex items-baseline justify-end">
                            <span className="text-4xl font-bold text-[#FFD700]">{info.claimed}/{info.totalCount}</span>
                            <span className="text-lg text-[#FFD700] ml-2">{t('redpacket.count')}</span>
                          </div>
                        </div>
                      </div>

                      {/* 我的领取 */}
                      {hasClaimed && (
                        <>
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
                          <div className="text-center">
                            <p className="text-white/60 text-sm mb-2">{t('redpacket.details.myClaim')}</p>
                            <div className="flex items-baseline justify-center">
                              <span className="text-4xl font-bold text-[#FFD700]">{parseFloat(claimedAmount).toFixed(4)}</span>
                              <span className="text-lg text-[#FFD700] ml-2">{t('redpacket.unit')}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 领取记录 */}
                <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                  <div className="p-6 rounded-xl bg-[#1a1a1a]">
                    <h2 className="text-lg font-bold mb-4 text-white">{t('redpacket.details.claimRecords')}</h2>
                    <div className="space-y-4">
                      {loadingClaims ? (
                        <div className="text-center py-4 text-gray-400">
                          {t('redpacket.details.loading')}
                        </div>
                      ) : claims && claims.length > 0 ? (
                        claims.map((claim, index) => {
                          // 找出金额最大的那个领取记录
                          const isLuckiest = claim.amount === Math.max(...claims.map(c => Number(c.amount))).toString();
                          
                          return (
                            <div 
                              key={index}
                              className="bg-gradient-to-r from-[#FF3B3B]/10 to-[#FF5B5C]/10 p-4 rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-white mb-1">
                                    {formatAddress(claim.address)}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {new Date(claim.timestamp * 1000).toLocaleString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-[#FFD700] mb-1">
                                    {Number(claim.amount).toFixed(4)} {t('redpacket.unit')}
                                  </p>
                                  {isLuckiest && (
                                    <div className="flex items-center gap-1 text-[#FFD700] justify-end">
                                      <FaTrophy className="text-sm" />
                                      <span className="text-xs">
                                        {t('redpacket.details.luckiest')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          {t('redpacket.details.noRecords')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 创建信息 */}
                <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                  <div className="p-6 rounded-xl bg-[#1a1a1a]">
                    <h2 className="text-lg font-bold mb-4 text-white">{t('redpacket.details.creatorInfo')}</h2>
                    <div className="space-y-2 text-white/80">
                      <p>{t('redpacket.details.creator')}: {formatAddress(info.creator)}</p>
                      <p>{t('redpacket.details.remainingAmount')}: {info.remainingAmount} {t('redpacket.unit')}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 分享弹窗 */}
      {showShareModal && info && (
        <ShareModalWrapper
          info={info}
          onClose={() => setShowShareModal(false)}
          claimedAmount={claimedAmount}
          id={id as string}
          address={address}
        />
      )}
    </>
  );
} 