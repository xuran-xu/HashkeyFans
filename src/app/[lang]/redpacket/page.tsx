'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

export default function RedPacketPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-180px)]">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 text-[#FFD700]">HashKey Chain 新年红包</h1>
        
        <div className="grid gap-6">
          <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-2xl">
            <div className="p-8 bg-[#1a1a1a] rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">创建红包</h2>
              <p className="text-white/80 mb-6">
                创建一个新的红包，设置金额和数量，分享给好友
              </p>
              <Button
                onClick={() => router.push('/redpacket/create')}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC000] hover:from-[#FFE55C] hover:to-[#FFD700] text-[#FF3B3B] font-bold"
              >
                创建红包
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B5C] p-[1px] rounded-2xl">
            <div className="p-8 bg-[#1a1a1a] rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">我的红包</h2>
              <p className="text-white/80 mb-6">
                查看我创建和领取的红包记录
              </p>
              <Button
                variant="secondary"
                onClick={() => router.push('/redpacket/history')}
                className="w-full bg-[#1a1a1a] border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#FF3B3B] font-bold transition-colors"
              >
                查看记录
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 