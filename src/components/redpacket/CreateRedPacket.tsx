'use client'

import { useState } from 'react';
import { Button } from '../common/Button';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

interface CreateRedPacketProps {
  onSubmit: (data: {
    amount: number;
    count: number;
    message: string;
  }) => void;
  preview: {
    message: string;
    amount: number;
    count: number;
  };
  setPreview: (data: {
    message: string;
    amount: number;
    count: number;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function CreateRedPacket({ 
  onSubmit, 
  preview, 
  setPreview,
  isLoading,
  error 
}: CreateRedPacketProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('');
  const [message, setMessage] = useState('HashKey Chain');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const countNum = parseInt(count);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error(t('redpacket.create.form.invalidAmount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (amountNum < 0.01) {
      toast.error(t('redpacket.create.form.minAmount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (isNaN(countNum) || !Number.isInteger(countNum) || countNum <= 0) {
      toast.error(t('redpacket.create.form.invalidCount'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    onSubmit({
      amount: amountNum,
      count: countNum,
      message,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-[#FFD700] to-[#FF5B5C] rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-sm">
        {t('redpacket.create.title')}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.message')}
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setPreview({ ...preview, message: e.target.value });
            }}
            className="w-full px-4 py-3 bg-white rounded-lg text-gray-700 font-medium placeholder-gray-400 border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all"
            placeholder={t('redpacket.create.form.messagePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.amount')}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setPreview({ ...preview, amount: parseFloat(e.target.value) || 0 });
            }}
            className="w-full px-4 py-3 bg-white rounded-lg text-gray-700 font-medium placeholder-gray-400 border-2 border-white/30 focus:border-white/50 focus:outline-none transition-all"
            placeholder={t('redpacket.create.form.amountPlaceholder')}
            min="0.01"
            step="0.0001"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
            {t('redpacket.create.form.count')}
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={count}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setCount(value);
                setPreview({
                  ...preview,
                  count: parseInt(value) || 0
                });
              }
            }}
            className="w-full px-4 py-2 bg-[#2a2a2a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3B3B]"
            placeholder={t('redpacket.create.form.countPlaceholder')}
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFC000] hover:from-[#FFE55C] hover:to-[#FFD700] text-[#FF3B3B] text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-[#FFE55C]/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('redpacket.create.form.processing') : t('redpacket.create.form.submit')}
        </Button>
      </div>
    </div>
  );
} 