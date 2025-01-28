'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface SuccessModalProps {
  amount: string;
  count: number;
  message: string;
  id: string;
}

export function SuccessModal({ amount, count, message, id }: SuccessModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  // 格式化链接，只显示前面一部分
  const shareUrl = `${window.location.origin}/redpacket/${id}`;
  const displayUrl = shareUrl.length > 30 
    ? `${shareUrl.slice(0, 30)}...` 
    : shareUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后重置状态
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleView = () => {
    router.push(`/redpacket/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#FFD700] mb-8">创建成功！</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-white/80">红包金额</span>
            <span className="text-[#FFD700]">{amount} HSK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">红包个数</span>
            <span className="text-[#FFD700]">{count} 个</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/80">祝福语</span>
            <span className="text-[#FFD700]">{message}</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-white/80 mb-2">分享链接：</p>
          <div className="bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between">
            <span className="text-white/60 truncate mr-2">{displayUrl}</span>
            <button 
              onClick={handleCopy}
              className="text-white/80 hover:text-white p-1 rounded transition-colors relative"
            >
              {copied ? (
                <FiCheck className="w-5 h-5 text-green-500" />
              ) : (
                <FiCopy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleView}
          className="w-full bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] text-white py-3 rounded-full font-bold"
        >
          查看红包
        </button>
      </div>
    </div>
  );
} 