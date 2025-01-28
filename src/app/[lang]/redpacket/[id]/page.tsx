'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { RedPacket } from '@/components/redpacket/RedPacket';
import { useRedPacketInfo, useRedPacketClaimed, useClaimRedPacket, useRedPacketClaims } from '@/hooks/useRedPacket';
import { useWaitForTransactionReceipt } from 'wagmi';
import { formatAddress } from '@/utils/format';

// 骨架屏组件
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-40 bg-gray-700 rounded-xl"></div>
    <div className="h-10 w-32 mx-auto bg-gray-700 rounded-full"></div>
  </div>
);

export default function RedPacketDetailPage() {
  const { id } = useParams();
  const { info, isLoading: loadingInfo, refetch: refetchInfo } = useRedPacketInfo(id as string);
  const { hasClaimed, claimedAmount, isLoading: loadingClaim, refetch: refetchClaim } = useRedPacketClaimed(id as string);
  const { claims, isLoading: loadingClaims, refetch: refetchClaims } = useRedPacketClaims(id as string);
  const { claimRedPacket, isLoading: isClaimLoading, hash } = useClaimRedPacket();
  const [showDetails, setShowDetails] = useState(false);

  // 监听交易状态
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash === '0x0' ? undefined : hash,
  });

  // 交易成功后刷新所有数据
  useEffect(() => {
    if (isSuccess) {
      Promise.all([
        refetchInfo?.(),
        refetchClaim?.(),
        refetchClaims?.()
      ]);
      setShowDetails(true);
    }
  }, [isSuccess, refetchInfo, refetchClaim, refetchClaims]);

  // 加载状态显示骨架屏
  if (loadingInfo || loadingClaim || loadingClaims || isConfirming || !info) {
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

  console.log('Page claim status:', {
    hasClaimed,
    claimedAmount,
    hasRemaining: info.remainingCount > 0
  });

  const hasRemaining = info.remainingCount > 0;
  const canClaim = !hasClaimed && hasRemaining;

  console.log('Claim decision:', {
    canClaim,
    hasClaimed,
    hasRemaining
  });

  const shouldShowDetails = !canClaim || showDetails;

  const handleAction = async () => {
    if (canClaim) {
      try {
        await claimRedPacket(id as string);
      } catch (err) {
        console.error('Failed to claim:', err);
      }
    } else {
      setShowDetails(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-180px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 红包预览 */}
          <RedPacket
            message={info.message}
            onOpen={handleAction}
            isOpened={hasClaimed || !hasRemaining}
          />

          {/* 操作按钮 */}
          <div className="text-center">
            <button
              onClick={handleAction}
              disabled={isClaimLoading || isConfirming}
              className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
            >
              {isClaimLoading || isConfirming ? '处理中...' : 
               canClaim ? '领取红包' : '查看红包详情'}
            </button>
          </div>

          {/* 详情部分 */}
          {shouldShowDetails && (
            <>
              {/* 领取进度 */}
              <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                <div className="p-6 rounded-xl bg-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80">总金额</span>
                    <span className="text-xl font-bold text-[#FFD700]">{info.totalAmount} HKC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">领取进度</span>
                    <span className="text-xl font-bold text-[#FFD700]">
                      {info.claimed} / {info.totalCount}
                    </span>
                  </div>
                  {hasClaimed && (
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-white/80">我的领取</span>
                      <span className="text-xl font-bold text-[#FFD700]">
                        {claimedAmount} HKC
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 领取记录 */}
              <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                <div className="p-6 rounded-xl bg-[#1a1a1a]">
                  <h2 className="text-lg font-bold mb-4 text-white">领取记录</h2>
                  <div className="space-y-4">
                    {claims.map((claim, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-[#FF3B3B]/10 to-[#FF5B5C]/10 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-white mb-1">{claim.address}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(claim.timestamp * 1000).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#FFD700]">{Number(claim.amount).toFixed(4)} HKC</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {claims.length === 0 && (
                      <div className="text-center py-4 text-gray-400">
                        暂无领取记录
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 创建信息 */}
              <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-xl">
                <div className="p-6 rounded-xl bg-[#1a1a1a]">
                  <h2 className="text-lg font-bold mb-4 text-white">创建信息</h2>
                  <div className="space-y-2 text-white/80">
                    <p>创建者: {formatAddress(info.creator)}</p>
                    <p>剩余金额: {info.remainingAmount} HKC</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 