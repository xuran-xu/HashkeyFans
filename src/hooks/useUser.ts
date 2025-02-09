import { useState, useEffect } from 'react';

interface UserData {
  id: number;
  wallet_address: string;
  display_address: string;
  share_link: string;
}

interface InitialCard {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
}

export function useUser(walletAddress: string | null) {
  const [user, setUser] = useState<UserData | null>(null);
  const [initialCard, setInitialCard] = useState<InitialCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': walletAddress
        },
        body: JSON.stringify({ wallet_address: walletAddress })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to login');
      }

      setUser(data.user);
      setInitialCard(data.initial_card);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      login();
    }
  }, [walletAddress]);

  return {
    user,
    initialCard,
    loading,
    error,
    login
  };
} 