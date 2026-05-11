'use client';

import React, { useState } from 'react';

interface TokenCardProps {
  token: {
    id: string;
    address: string;
    name: string;
    symbol: string;
    icon_url?: string;
    overall_ai_score: number;
    contract_score?: number;
    liquidity_score?: number;
    distribution_score?: number;
    upvotes: number;
    downvotes: number;
    dex_source: string;
    discovered_at: string;
    liquidity_usd?: number;
  };
  userVote?: 'safe' | 'rug' | null;
  onVote?: (type: 'safe' | 'rug', confidence: number, comment?: string) => void;
  onExpand?: () => void;
}

export default function TokenCard({ token, userVote, onExpand }: TokenCardProps) {
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  const handleVoteClick = () => {
    if (userVote) return; // Already voted
    if (onExpand) onExpand();
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md flex flex-col p-5">
      {/* Token Icon - Centered at top */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl text-zinc-400 mb-2 overflow-hidden">
          {token.icon_url ? (
            <img
              src={token.icon_url}
              alt={token.symbol}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to 2-letter placeholder on image load error
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  target.parentElement.textContent = token.symbol.substring(0, 2).toUpperCase();
                }
              }}
            />
          ) : (
            token.symbol.substring(0, 2).toUpperCase()
          )}
        </div>
        <h3 className="text-lg font-black text-black dark:text-white text-center uppercase truncate max-w-full px-2">
          {token.symbol}
        </h3>
        <p className="text-[10px] text-zinc-500 text-center truncate max-w-full px-2">{token.name}</p>
        <button
          onClick={handleCopyAddress}
          className="mt-1 px-2 py-0.5 text-[8px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-md transition-colors flex items-center gap-1 mx-auto"
          title="Click to copy address"
        >
          {truncateAddress(token.address)}
          {copied ? (
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Safety Score - Hero metric */}
      <div className="flex flex-col items-center mb-3">
        <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider mb-1.5">AI Safety Score</span>
        <span className={`inline-block px-3 py-1.5 rounded-xl text-2xl font-black border-2 ${getScoreColor(token.overall_ai_score)}`}>
          {token.overall_ai_score}
        </span>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
          <span className="block text-[8px] uppercase font-black text-zinc-400 tracking-wider mb-0.5">Liquidity</span>
          <span className="text-xs font-bold text-black dark:text-white">${Math.round(Number(token.liquidity_usd || 0) / 1000)}k</span>
        </div>
        <div className="text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
          <span className="block text-[8px] uppercase font-black text-zinc-400 tracking-wider mb-0.5">DEX</span>
          <span className="text-xs font-bold text-zinc-500 uppercase">{token.dex_source}</span>
        </div>
      </div>

      {/* Vote Counts */}
      <div className="flex items-center justify-center gap-4 mb-3 text-[10px] font-bold text-zinc-400">
        <div className="flex items-center gap-1">
          <span>👍</span>
          <span>{token.upvotes}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>👎</span>
          <span>{token.downvotes}</span>
        </div>
      </div>

      {/* Action Buttons - Spacer pushes to bottom */}
      <div className="mt-auto space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleVoteClick}
            disabled={!!userVote}
            className={`py-2.5 rounded-xl text-[10px] font-black transition-all ${
              userVote === 'safe'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:text-green-500 hover:bg-green-500/10 border border-zinc-100 dark:border-zinc-800'
            } ${userVote && userVote !== 'safe' ? 'opacity-50' : ''}`}
          >
            👍 SAFE
          </button>
          <button
            onClick={handleVoteClick}
            disabled={!!userVote}
            className={`py-2.5 rounded-xl text-[10px] font-black transition-all ${
              userVote === 'rug'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 border border-zinc-100 dark:border-zinc-800'
            } ${userVote && userVote !== 'rug' ? 'opacity-50' : ''}`}
          >
            👎 RUG
          </button>
        </div>

        <button
          onClick={onExpand}
          className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
