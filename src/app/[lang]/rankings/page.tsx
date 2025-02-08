'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Ranking {
  user_id: number;
  display_address: string;
  connect_count: number;
  rank: number;
}

interface RankingsResponse {
  rankings: Ranking[];
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }
      const data: RankingsResponse = await response.json();
      setRankings(data.rankings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return rank <= 3 ? medals[rank - 1] : `#${rank}`;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('rankings.title', 'Connection Rankings')}</h1>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-24">{t('rankings.rank', 'Rank')}</th>
              <th>{t('rankings.user', 'User')}</th>
              <th className="text-right">{t('rankings.connections', 'Connections')}</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking) => (
              <tr key={ranking.user_id} className={`hover ${ranking.rank <= 3 ? 'bg-base-200' : ''}`}>
                <td className="text-2xl font-bold">
                  {getRankDisplay(ranking.rank)}
                </td>
                <td className="font-medium">{ranking.display_address}</td>
                <td className="text-right">
                  <div className="badge badge-primary badge-lg">
                    {ranking.connect_count}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 