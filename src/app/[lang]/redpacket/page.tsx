'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@/components/common/Icon';
import { useAccount, ConnectButton, useWallets } from '@particle-network/connectkit';

const LOCAL_STORAGE_KEY =  process.env.NODE_ENV === 'development' ? 'yuanbi-red-pocket' : 'yuanbi-red-pocket-mainnet';

interface GiftResponse {
  msg: string;
  sended: boolean;
  txHash: string;
}

export default function RedPacketPage() {
  const [state, setState] = useState<{
    isReady: boolean;
    isOpened: boolean;
    isEmpty: boolean;
    isProcessing: boolean;
  } | null>(null); // 初始状态设为 null，表示还未检查
  
  // 使用ref来控制交互状态
  const canInteract = useRef(false);
  const requestLock = useRef(false);
  
  const { isConnected } = useAccount();
  const [primaryWallet] = useWallets();

  const recordClaim = useCallback((address: string) => {
    try {
      const claimed = localStorage.getItem(LOCAL_STORAGE_KEY);
      const claimedAddresses = claimed ? JSON.parse(claimed) as string[] : [];
      if (!claimedAddresses.includes(address.toLowerCase())) {
        claimedAddresses.push(address.toLowerCase());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(claimedAddresses));
      }
    } catch (error) {
      console.error('Error recording claim:', error);
    }
  }, []);

  // 初始化检查
  useEffect(() => {
    if (!primaryWallet?.accounts[0]) return;
    
    try {
      const claimed = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (claimed) {
        const claimedAddresses = JSON.parse(claimed) as string[];
        if (claimedAddresses.includes(primaryWallet.accounts[0].toLowerCase())) {
          // 如果已领取，直接显示领取成功状态
          setState({
            isReady: true,
            isOpened: true,
            isEmpty: false,
            isProcessing: false
          });
          canInteract.current = false;  // 已领取不能交互
          return;
        }
      }
      
      // 未领取状态
      setState({
        isReady: true,
        isOpened: false,
        isEmpty: false,
        isProcessing: false
      });
      canInteract.current = true;  // 未领取可以交互
    } catch (error) {
      console.error('Error checking initial state:', error);
    }
  }, [primaryWallet?.accounts]);

  // 如果状态还未初始化，显示加载状态
  if (state === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-red-500"></div>
      </div>
    );
  }

  // 发送请求的函数
  const sendGiftRequest = async (address: string): Promise<GiftResponse> => {
    const isTestnet = process.env.NODE_ENV === 'development';
    const baseUrl = isTestnet 
      ? 'https://api.hyperindex.trade/api/gift/testnet/yuanbi_gift'
      : 'https://api.hyperindex.trade/api/gift/yuanbi_gift';
    
    const response = await fetch(`${baseUrl}/${address}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const handleOpen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 状态检查
    if (!isConnected || 
        !state.isReady || 
        !canInteract.current ||
        state.isProcessing || 
        state.isOpened || 
        requestLock.current ||
        !primaryWallet?.accounts[0]) {
      return;
    }
    
    // 设置锁定状态
    requestLock.current = true;
    canInteract.current = false;
    
    try {
      // 首先设置处理中状态
      setState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isProcessing: true
        };
      });
      
      // 发送请求并等待响应
      const data = await sendGiftRequest(primaryWallet.accounts[0]);
      
      // 只有在成功收到响应后才更新状态
      if (data.sended) {
        recordClaim(primaryWallet.accounts[0]);
        setState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            isProcessing: false,
            isOpened: true,
            isEmpty: false,
          };
        });
      } else {
        setState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            isProcessing: false,
            isOpened: true,
            isEmpty: true,
          };
        });
      }
    } catch (error) {
      console.error('Open error:', error);
      // 错误时也更新状态
      setState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isProcessing: false,
          isOpened: true,
          isEmpty: true,
        };
      });
    } finally {
      // 清理状态
      setTimeout(() => {
        requestLock.current = false;
      }, 500);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="relative">
        {/* 红包封面 */}
        {!state.isOpened && (
          <div 
            className={`relative w-80 h-96 bg-gradient-to-b from-red-500 to-red-600 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500`}
            onClick={handleOpen}
          >
            {/* 未连接钱包遮罩 */}
            {!isConnected && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center z-10 p-8">
                <div className="animate-bounce text-4xl">🧧</div>
                <ConnectButton />
              </div>
            )}

            {/* 顶部文字 */}
            <div className="absolute top-8 left-0 right-0 text-center">
              <h2 className="text-2xl font-bold text-yellow-300 font-serif mb-2">
                圆币开业庆典
              </h2>
              <p className="text-yellow-200 opacity-80">
                恭喜发财，大吉大利
              </p>
            </div>

            {/* 金币装饰 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-lg">
                <Icon name="gift" className="w-14 h-14 text-red-600" />
              </div>
            </div>
            
            {/* 底部装饰 */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-yellow-200 text-sm">点击开启好运</p>
            </div>
            
            {/* 装饰图案 */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-red-400 rounded-2xl" />
            <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-red-400 rounded-xl opacity-50" />
            
            {/* 角落装饰 */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-300 rounded-tl-xl" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-300 rounded-tr-xl" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-yellow-300 rounded-bl-xl" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-300 rounded-br-xl" />
          </div>
        )}

        {/* 打开后的内容 */}
        {state.isOpened && (
          <div className="w-80 h-[400px]">
            {/* 底部红包背景 */}
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-b from-red-500 to-red-600 rounded-3xl opacity-50" />
            
            {/* 信封内容 */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-red-50 to-white rounded-3xl shadow-xl overflow-hidden animate-slide-up"
            >
              <div className="p-8 text-center">
                {state.isEmpty ? (
                  <>
                    <div className="mb-6 flex justify-center">
                      <Icon name="gift" className="w-16 h-16 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-red-600 mb-6 font-serif">
                      圆币恭喜发财
                    </h2>
                    
                    <div className="text-xl text-gray-400 mb-8">
                      🧧 红包已经抢完
                      <div className="text-sm mt-2">下次要手快一点哦~</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex justify-center">
                      <Icon name="gift" className="w-16 h-16 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-red-600 mb-6 font-serif">
                      圆币恭喜发财
                    </h2>
                    
                    <div className="text-5xl font-bold text-red-600 mb-8 font-serif">
                      10
                      <span className="text-base ml-2 font-sans">HSK</span>
                    </div>
                  </>
                )}
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                  <img 
                    src="/img/logo.png" 
                    alt="HashKey Chain"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-gray-500">HashKey Chain</span>
                </div>

                {/* 装饰元素 */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-300 via-red-500 to-red-300" />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-red-100 to-transparent opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Loading状态 */}
        {state.isProcessing && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 rounded-3xl">
            <div className="loading loading-spinner loading-lg text-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}