'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';

interface TokenDetailModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  token: {
    address: string;
    symbol: string;
    name: string;
    contract_score?: number;
    liquidity_score?: number;
    distribution_score?: number;
    votes?: Array<{
      vote_type: string;
      comment: string;
      user?: {
        username?: string;
        wallet_address?: string;
      };
    }>;
  };
  userVote?: 'safe' | 'rug' | null;
  onVote?: (type: 'safe' | 'rug', confidence: number, comment?: string) => void;
}

export default function TokenDetailModal({ isOpen, onRequestClose, token, userVote, onVote }: TokenDetailModalProps) {
  const [voteType, setVoteType] = useState<'safe' | 'rug' | null>(null);
  const [confidence, setConfidence] = useState(5);
  const [comment, setComment] = useState('');
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!token) return null;

  const handleVoteClick = (type: 'safe' | 'rug') => {
    if (userVote) return; // Already voted
    setVoteType(type);
    setShowVoteForm(true);
  };

  const handleConfirmVote = () => {
    if (voteType && onVote) {
      onVote(voteType, confidence, comment);
      setShowVoteForm(false);
      setVoteType(null);
      setConfidence(5);
      setComment('');
      onRequestClose();
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scores = [
    { label: 'Contract Safety', score: token.contract_score || 0, desc: 'Mint & Freeze authority check' },
    { label: 'Liquidity Safety', score: token.liquidity_score || 0, desc: 'Pool size and lock status' },
    { label: 'Distribution', score: token.distribution_score || 0, desc: 'Top holder concentration' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] shadow-2xl p-4 sm:p-6 md:p-8 outline-none border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      ariaHideApp={false}
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black">{token.symbol}</h2>
            <p className="text-sm sm:text-base text-zinc-500 mb-2 truncate">{token.name}</p>
            <button
              onClick={handleCopyAddress}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 group w-full sm:w-auto"
              title="Click to copy address"
            >
              <span className="truncate">{token.address}</span>
              {copied ? (
                <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <button onClick={onRequestClose} className="p-1.5 sm:p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* AI Breakdown */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400">AI Safety Breakdown</h3>
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {scores.map((s, i) => (
              <div key={i} className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span>{s.label}</span>
                  <span>{s.score}/100</span>
                </div>
                <div className="h-1.5 sm:h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreColor(s.score)} transition-all duration-1000`}
                    style={{ width: `${s.score}%` }}
                  ></div>
                </div>
                <p className="text-[9px] sm:text-[10px] text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Section */}
        {!userVote && !showVoteForm && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400">Cast Your Vote</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => handleVoteClick('safe')}
                className="py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:text-green-500 hover:bg-green-500/10 border border-zinc-100 dark:border-zinc-800 hover:border-green-500/20"
              >
                👍 Vote SAFE
              </button>
              <button
                onClick={() => handleVoteClick('rug')}
                className="py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 border border-zinc-100 dark:border-zinc-800 hover:border-red-500/20"
              >
                👎 Vote RUG
              </button>
            </div>
          </div>
        )}

        {showVoteForm && (
          <div className="space-y-3 sm:space-y-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400">
              Confirm {voteType?.toUpperCase()} Vote
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-widest">Confidence Level</span>
              <div className="flex gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => setConfidence(i)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      confidence >= i
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-white dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Share your hunter insights... (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 outline-none text-xs sm:text-sm font-medium resize-none h-16 sm:h-20 text-black dark:text-white placeholder:text-zinc-400"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowVoteForm(false);
                  setVoteType(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVote}
                className={`flex-1 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm text-white shadow-xl transition-all ${
                  voteType === 'safe' ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'
                }`}
              >
                Confirm {voteType?.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        {userVote && (
          <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xs sm:text-sm font-bold text-zinc-500">
              You voted this token as{' '}
              <span className={userVote === 'safe' ? 'text-green-500' : 'text-red-500'}>
                {userVote.toUpperCase()}
              </span>
            </p>
          </div>
        )}

        {/* User Community Insights */}
        {token.votes && token.votes.filter((v: { comment: string }) => v.comment).length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hunter Insights</h3>
            <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 sm:space-y-3 pr-1 sm:pr-2 custom-scrollbar">
              {token.votes
                .filter((v: { comment: string }) => v.comment)
                .map((vote: { vote_type: string; comment: string; user?: { username?: string; wallet_address?: string } }, idx: number) => (
                  <div key={idx} className="p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg sm:rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 ${vote.vote_type === 'safe' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${vote.vote_type === 'safe' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-wider truncate">
                          {vote.user?.username || (vote.user?.wallet_address ? `${vote.user.wallet_address.slice(0, 4)}...${vote.user.wallet_address.slice(-4)}` : 'Anonymous Hunter')}
                        </span>
                      </div>
                      <span className={`text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ${
                        vote.vote_type === 'safe'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {vote.vote_type}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                      &quot;{vote.comment}&quot;
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <a
            href={`https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=${token.address}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity"
          >
            <span className="hidden sm:inline">Trade on Jupiter</span>
            <span className="sm:hidden">Jupiter</span>
          </a>
          <a
            href={`https://solscan.io/token/${token.address}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 border border-zinc-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="hidden sm:inline">View on Solscan</span>
            <span className="sm:hidden">Solscan</span>
          </a>
        </div>
      </div>
    </Modal>
  );
}
