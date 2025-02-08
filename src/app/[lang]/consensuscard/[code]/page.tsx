'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton, useAccount, useWallets } from '@particle-network/connectkit';
import { generateShareCode } from '@/lib/utils';

interface CardData {
  card: {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
  } | null;
  owner: {
    address: string;
    display_address: string;
    connect_count: number;
    id: number;
  };
  is_owner: boolean;
  has_card: boolean;
  can_claim: boolean;
  is_connected: boolean;
}

export default function SharePage() {
  const params = useParams();
  const { isConnected } = useAccount();
  const [primaryWallet] = useWallets();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!params.code || !primaryWallet?.accounts[0]) return;
    
    setLoading(true);
    const controller = new AbortController();

    fetchCardData(primaryWallet.accounts[0], controller.signal);

    return () => controller.abort();
  }, [params.code, primaryWallet?.accounts[0]]);

  const fetchCardData = async (walletAddress?: string, signal?: AbortSignal) => {
    try {
      console.log('Original wallet address:', primaryWallet?.accounts[0]);
      const response = await fetch(`/api/card/${params.code}`, {
        headers: walletAddress ? {
          'x-wallet-address': walletAddress,
        } : {},
        signal
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch card');
      }

      setCardData(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load card');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const response = await fetch('/api/card/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': primaryWallet?.accounts[0] || ''
        },
        body: JSON.stringify({
          target_user_id: cardData?.owner.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to connect');
      }

      // 刷新卡片数据
      if (primaryWallet?.accounts[0]) {
        fetchCardData(primaryWallet.accounts[0]);
      }
    } catch (err) {
      console.error('Failed to connect:', err);
      // 可以添加一个 toast 提示
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="card-title text-error">Oops!</h2>
                <p className="text-base-content/70">{error}</p>
                <button 
                  className="btn btn-error btn-outline"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="card-title text-warning">Connect Wallet</h2>
                <p className="text-base-content/70">Please connect your wallet to view this card</p>
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="card-title text-warning">Connect Wallet</h2>
                <p className="text-base-content/70">Please connect your wallet to view this card</p>
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl max-w-md mx-auto aspect-[9/16] overflow-hidden">
        <figure className="relative w-full h-full">
          {cardData.card?.image_url && (
            <Image
              src={cardData.card.image_url}
              alt={cardData.card.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-gradient-to-t from-gray-900/90 to-gray-900/40 p-6">
            <div className="space-y-4">
              <h2 className="card-title text-2xl text-white">
                {cardData.card?.title}
              </h2>
              <p className="text-gray-200/80">
                {cardData.card?.description}
              </p>
              
              <div className="flex items-center justify-between text-gray-300/80">
                <div className="flex items-center gap-2">
                  <span className="text-sm">By {cardData.owner.display_address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm">{cardData.owner.connect_count} Connections</span>
                </div>
              </div>

              {!cardData.is_owner && (
                <div className="card-actions justify-end mt-4">
                  {!isConnected ? (
                    <ConnectButton />
                  ) : cardData.is_connected ? (
                    <button 
                      className="btn btn-disabled btn-sm glass"
                      disabled
                    >
                      Already Connected
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm glass"
                      onClick={handleConnect}
                      disabled={connecting}
                    >
                      {connecting ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Connecting...
                        </>
                      ) : (
                        'Connect with Card'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
} 