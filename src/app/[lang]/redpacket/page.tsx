'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/common/Icon';
import { useTranslation } from 'react-i18next';
import { useAccount, ConnectButton, useWallets } from '@particle-network/connectkit';

const LOCAL_STORAGE_KEY = 'yuanbi-red-pocket';

interface GiftResponse {
  msg: string;
  sended: boolean;
  txHash: string;
}

export default function RedPacketPage() {
  // 将初始状态设为 null
  const [pageState, setPageState] = useState<{
    isOpened: boolean;
    isEmpty: boolean;
    isReady: boolean;
  } | null>(null);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  const [primaryWallet] = useWallets();

  // 检查是否已领取
  const checkIfClaimed = useCallback(() => {
    if (!primaryWallet?.accounts[0]) return false;
    
    const claimed = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!claimed) return false;
    
    const claimedAddresses = JSON.parse(claimed) as string[];
    return claimedAddresses.includes(primaryWallet.accounts[0].toLowerCase());
  }, [primaryWallet?.accounts]);

  // 记录领取记录
  const recordClaim = useCallback((address: string) => {
    const claimed = localStorage.getItem(LOCAL_STORAGE_KEY);
    const claimedAddresses = claimed ? JSON.parse(claimed) as string[] : [];
    
    if (!claimedAddresses.includes(address.toLowerCase())) {
      claimedAddresses.push(address.toLowerCase());
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(claimedAddresses));
    }
  }, []);

  // 初始化检查
  useEffect(() => {
    // 如果钱包连接状态还未就绪，直接返回
    if (isConnected === undefined) return;

    const initCheck = async () => {
      // 未连接钱包时显示红包封面
      if (!isConnected || !primaryWallet?.accounts[0]) {
        setPageState({
          isOpened: false,
          isEmpty: false,
          isReady: true
        });
        return;
      }

      if (checkIfClaimed()) {
        setPageState({
          isOpened: true,
          isEmpty: false,
          isReady: true
        });
        return;
      }

      try {
        const isTestnet = process.env.NODE_ENV === 'development';
        const baseUrl = isTestnet 
          ? 'https://api.hyperindex.trade/api/gift/testnet/yuanbi_gift'
          : 'https://api.hyperindex.trade/api/gift/yuanbi_gift';
        
        const response = await fetch(`${baseUrl}/${primaryWallet.accounts[0]}`);
        const data: GiftResponse = await response.json();
        
        setPageState({
          isOpened: false,
          isEmpty: !data.sended,
          isReady: true
        });
      } catch (error) {
        console.error('Check error:', error);
        setPageState({
          isOpened: false,
          isEmpty: true,
          isReady: true
        });
      }
    };

    initCheck();
  }, [isConnected, primaryWallet?.accounts, checkIfClaimed]);

  const claimRedPacket = useCallback(async () => {
    if (!primaryWallet?.accounts[0]) return;
    
    const isTestnet = process.env.NODE_ENV === 'development';
    const baseUrl = isTestnet 
      ? 'https://api.hyperindex.trade/api/gift/testnet/yuanbi_gift'
      : 'https://api.hyperindex.trade/api/gift/yuanbi_gift';
    
    try {
      const response = await fetch(`${baseUrl}/${primaryWallet.accounts[0]}`);
      const data: GiftResponse = await response.json();
      
      if (data.sended) {
        setPageState(prev => prev ? { ...prev, isEmpty: false } : null);
        recordClaim(primaryWallet.accounts[0]);
      } else {
        setPageState(prev => prev ? { ...prev, isEmpty: true } : null);
      }
    } catch (error) {
      console.error('Claim error:', error);
      setPageState(prev => prev ? { ...prev, isEmpty: true } : null);
    }
  }, [primaryWallet?.accounts, recordClaim]);

  const handleOpen = async () => {
    if (isAnimating || !isConnected || checkIfClaimed() || !pageState) return;
    setIsAnimating(true);
    setPageState(prev => prev ? { ...prev, isOpened: true } : null);
    await claimRedPacket();
  };

  // 在页面状态准备好之前显示加载动画
  if (!pageState?.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!pageState.isOpened ? (
          <motion.div
            className="relative w-80 h-96 bg-gradient-to-b from-red-500 to-red-600 rounded-3xl shadow-2xl cursor-pointer overflow-hidden"
            whileHover={isConnected ? { scale: 1.05 } : {}}
            whileTap={isConnected ? { scale: 0.95 } : {}}
            onClick={handleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {/* 未连接钱包遮罩 */}
            {!isConnected && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center z-10 p-8">
                <p className="text-white text-lg mb-4">连接钱包领取红包</p>
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
              <motion.div
                className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-lg"
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Icon name="gift" className="w-14 h-14 text-red-600" />
              </motion.div>
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
          </motion.div>
        ) : (
          <motion.div
            className="relative w-80"
            initial={{ height: 0 }}
            animate={{ height: 400 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-red-50 to-white rounded-3xl shadow-xl overflow-hidden"
              initial={{ y: -400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="p-8 text-center">
                {pageState.isEmpty ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.3 }}
                      className="mb-6 flex justify-center"
                    >
                      <Icon name="gift" className="w-16 h-16 text-red-500" />
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-2xl font-bold text-red-600 mb-6 font-serif"
                    >
                      圆币恭喜发财
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-xl text-gray-400 mb-8"
                    >
                      🧧 红包已经抢完
                      <div className="text-sm mt-2">下次要手快一点哦~</div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.3 }}
                      className="mb-6 flex justify-center"
                    >
                      <Icon name="gift" className="w-16 h-16 text-red-500" />
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-2xl font-bold text-red-600 mb-6 font-serif"
                    >
                      圆币恭喜发财
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-5xl font-bold text-red-600 mb-8 font-serif"
                    >
                      10
                      <span className="text-base ml-2 font-sans">HSK</span>
                    </motion.div>
                  </>
                )}
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2"
                >
                  <img 
                    src="/img/logo.png" 
                    alt="HashKey Chain"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-gray-500">HashKey Chain</span>
                </motion.div>

                {/* 装饰元素 */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-300 via-red-500 to-red-300" />
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-red-100 to-transparent opacity-50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 