'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import ConnectButton from '@/components/common/ConnectButton';
import { formatAddress } from '@/utils/format';

interface Token {
  id: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

const tokens: Token[] = [
  {
    "id": 2,
    "symbol": "WHSK",
    "name": "Wrapped HSK",
    "address": "0xB210D2120d57b758EE163cFfb43e73728c471Cf1",
    "decimals": 18
  },
  {
    "id": 43,
    "symbol": "WHSK",
    "name": "WHSK (Base)",
    "address": "0x54b92ae9c9b8ce75fa958191649bc20b7e6c54c7",
    "decimals": 18
  },
  {
    "id": 44,
    "symbol": "WHSK",
    "name": "WHSK (Arbitrum)",
    "address": "0xc080b24a11fdaaf01548e384757b4c905993af1a",
    "decimals": 18
  },
  {
    "id": 5,
    "symbol": "WETH",
    "name": "Wrapped Ether",
    "address": "0xefd4bC9afD210517803f293ABABd701CaeeCdfd0",
    "decimals": 18
  },
  {
    "id": 6,
    "symbol": "USDT",
    "name": "Tether USD",
    "address": "0xF1B50eD67A9e2CC94Ad3c477779E2d4cBfFf9029",
    "decimals": 18
  },
  {
    "id": 42,
    "symbol": "PONK",
    "name": "Ponk",
    "address": "0x419a0097BDf141A52e9D7d2577C6d95F37dEDfD2",
    "decimals": 18
  },
  {
    "id": 4,
    "symbol": "Megrez",
    "name": "Megrez",
    "address": "0xB82744E309db4d24a2615CC799ED7C20E11327aB",
    "decimals": 18
  },
  {
    "id": 7,
    "symbol": "CELA",
    "name": "Cellula Token",
    "address": "0xC7DcECe84EC314F08014dA2036632afb7fb1e05C",
    "decimals": 18
  },
  {
    "id": 9,
    "symbol": "USDHK",
    "name": "USDT HK",
    "address": "0x849b160A10421070d45Fa49042c2cF07dfcF19E9",
    "decimals": 18
  },
  {
    "id": 10,
    "symbol": "HAPE",
    "name": "Hashkey Pepe",
    "address": "0xD54c2f476da8960Fe25Eac65df596b76007131AB",
    "decimals": 18
  },
  {
    "id": 11,
    "symbol": "DOGS",
    "name": "Dogs Coin",
    "address": "0xF9fB2302DA48d5715b10921CEC3b82c99ACb39AC",
    "decimals": 18
  },
  {
    "id": 12,
    "symbol": "HSKMoon",
    "name": "HSKMoon",
    "address": "0x47F9a7AAC2d08f4Fb69915532402081e5CC6F166",
    "decimals": 18
  },
  {
    "id": 13,
    "symbol": "PEPE",
    "name": "PEPE Coin",
    "address": "0xB988Ed3DE9254273d1F3Ccc5604F82C5FFE4D234",
    "decimals": 18
  },
  {
    "id": 15,
    "symbol": "stHSK",
    "name": "Staked HashKeyChain",
    "address": "0x2Ea2F4cbD74840f4ac6C65887ca2986c715d7193",
    "decimals": 18
  },
  {
    "id": 8,
    "symbol": "USDC.e",
    "name": "Bridged USDC",
    "address": "0x054ed45810DbBAb8B27668922D110669c9D88D0a",
    "decimals": 6
  },
  {
    "id": 1,
    "symbol": "Caishen",
    "name": "Caishen",
    "address": "0x8565bad988f4129A29Dc41Ec03FE2C6f538b949f",
    "decimals": 18
  },
  {
    "id": 3,
    "symbol": "RWAC",
    "name": "RealWorldAssetCoin",
    "address": "0x6c5D2f3054b121a97366a7Eb9388d6888995C333",
    "decimals": 18
  }
];

export default function TokensPage() {
  const { isConnected } = useAccount();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const formatTokenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const addTokenToWallet = async (token: Token) => {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet to add tokens');
      return;
    }

    try {
      const result = await (window.ethereum as any).request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: '', // 可以留空或添加token图标URL
          },
        },
      });
      
      if (result) {
        console.log('Token added successfully');
      }
    } catch (error) {
      console.error('Failed to add token to wallet:', error);
    }
  };

  const generateTokenLogo = (symbol: string, address: string) => {
    // Get specific logo for known tokens
    const getTokenLogo = (symbol: string) => {
      switch (symbol.toUpperCase()) {
        case 'WETH':
        case 'ETH':
          return '/img/eth.png';
        case 'USDT':
          return '/img/usdt.png';
        case 'USDC.E':
        case 'USDC':
          return '/img/usdc.png';
        case 'HSK':
        case 'WHSK':
        case 'STHSK':
          return '/img/logo.png';
        default:
          return null; // 使用字母显示
      }
    };

    // Get chain badge based on contract address
    const getChainBadge = (address: string) => {
      if (address === '0x54b92ae9c9b8ce75fa958191649bc20b7e6c54c7') {
        return '/img/base.svg';
      }
      if (address === '0xc080b24a11fdaaf01548e384757b4c905993af1a') {
        return '/img/arb.svg';
      }
      return '/img/hsklogo.png'; // 默认HSK链标识
    };

    const logoSrc = getTokenLogo(symbol);
    const chainBadge = getChainBadge(address);
    
    // Generate a colorful gradient based on the symbol for text logos
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-red-400 to-pink-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-green-500',
      'from-orange-400 to-red-500'
    ];
    
    const colorIndex = symbol.length % colors.length;
    
    return (
      <div className="relative w-10 h-10">
        {/* Main token logo */}
        <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={symbol}
              className="object-contain rounded-lg w-full h-full"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xs rounded-xl`}>
              {symbol.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Chain badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-black rounded-md border border-base-300/30 shadow-lg flex items-center justify-center overflow-hidden p-0.5">
          <img
            src={chainBadge}
            alt="Chain"
            className="object-contain rounded-sm"
          />
        </div>
      </div>
    );
  };

  const getBlockscoutUrl = (address: string) => {
    return `https://hashkey.blockscout.com/address/${address}`;
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg border border-base-300/30 mb-4">
            <Image
              src="/img/hsklogo.png"
              alt="HashKey Chain"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-base-content">
              HashKey Chain
            </h1>
          </div>
          <p className="text-sm text-base-content/60 max-w-xl mx-auto mt-4">
            Discover and manage your favorite tokens on the HashKey Chain ecosystem
          </p>
        </div>

        {/* Token List */}
        <div className="card bg-base-100/80 backdrop-blur-sm shadow-2xl border border-base-300/50">
          <div className="card-body p-0">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-base-300/50 bg-base-200/50">
              <div className="grid grid-cols-12 items-center gap-4 text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                <div className="col-span-7 md:col-span-5 lg:col-span-6">Token</div>
                <div className="col-span-4 lg:col-span-3 hidden md:block">Contract Address</div>
                <div className="col-span-5 md:col-span-3 lg:col-span-3 text-right">Actions</div>
              </div>
            </div>

            {/* Token Rows */}
            <div className="divide-y divide-base-300/30">
              {tokens.map((token, index) => (
                <div 
                  key={token.id} 
                  className="px-6 py-5 hover:bg-base-200/50 transition-all duration-200 group cursor-default"
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  <div className="grid grid-cols-12 items-center gap-4">
                    {/* Token Info */}
                    <div className="col-span-7 md:col-span-5 lg:col-span-6">
                      <div className="flex items-center gap-3">
                        {generateTokenLogo(token.symbol, token.address)}
                        <div className="min-w-0">
                          <div className="font-semibold text-base-content group-hover:text-primary transition-colors">
                            {token.symbol}
                          </div>
                          <div className="text-sm text-base-content/60 truncate">
                            {token.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contract Address - 隐藏在移动端 */}
                    <div className="col-span-4 lg:col-span-3 hidden md:block">
                      <div className="flex items-center gap-2">
                        <a
                          href={getBlockscoutUrl(token.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-base-200/70 px-3 py-1.5 rounded-lg font-mono text-base-content/80 border border-base-300/30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 cursor-pointer"
                          title="View on HashKey BlockScout"
                        >
                          {formatTokenAddress(token.address)}
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-5 md:col-span-3 lg:col-span-3 flex justify-end gap-2">
                      {/* Copy Button */}
                      <button
                        className={`btn btn-sm btn-circle ${
                          copiedAddress === token.address ? 'btn-success' : 'btn-ghost bg-base-200 hover:bg-primary/10'
                        }`}
                        onClick={() => copyToClipboard(token.address)}
                        title="Copy full address"
                      >
                        {copiedAddress === token.address ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>

                      {/* Add to Wallet Button - 隐藏在移动端 */}
                      <button
                        className="btn btn-primary btn-sm btn-circle shadow-lg hover:shadow-xl transition-all duration-200 hidden md:flex"
                        onClick={() => addTokenToWallet(token)}
                        title="Add to wallet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </button>

                      {/* DEX Trading Button - 隐藏在移动端 */}
                      <a
                        href="https://www.hyperindex.trade/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm hidden md:flex shadow-lg hover:shadow-xl transition-all duration-200"
                        title="Trade on DEX"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <span className="ml-1">Trade on DEX</span>
                      </a>

                      {/* BlockScout Link - 始终显示 */}
                      <a
                        href={getBlockscoutUrl(token.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm btn-circle bg-base-200 hover:bg-primary/10"
                        title="View on BlockScout"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {tokens.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-base-300 to-base-400 flex items-center justify-center">
              <svg className="w-10 h-10 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No tokens found</h3>
            <p className="text-base-content/70">No tokens are available at the moment.</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-base-200/50 rounded-full border border-base-300/30">
            <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
            </svg>
            <span className="text-sm text-base-content/70">
              {tokens.length} tokens available on HashKey Chain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 