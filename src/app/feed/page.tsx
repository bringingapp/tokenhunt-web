'use client';

import Header from "@/components/Header";
import TokenCard from "@/components/TokenCard";
import TokenDetailModal from "@/components/TokenDetailModal";
import { TokenCardSkeleton } from "@/components/Skeleton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useMemo } from "react";
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import InfiniteScroll from 'react-infinite-scroll-component';
import { apiRequest } from "@/lib/api";
import { toast } from "react-hot-toast";

const fetcher = (url: string) => apiRequest(url);

export default function FeedPage() {
  const { connected } = useWallet();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user profile to get their votes
  const { data: userData, mutate: mutateUser } = useSWR(connected ? '/users/me' : null, fetcher);

  const { data: feedData, error, size, setSize, mutate: mutateFeed } = useSWRInfinite(
    (index) => `/tokens/feed?limit=20&offset=${index * 20}`,
    fetcher
  );

  const tokens = feedData ? feedData.flatMap(page => page.tokens) : [];
  const isLoading = !feedData && !error;
  const hasMore = feedData ? (feedData[feedData.length - 1].hasMore || feedData[feedData.length - 1].tokens.length > 0) : true;

  // Create a map of token IDs the user has voted on for quick lookup
  const userVotesMap = useMemo(() => {
    if (!userData?.votes) return {};
    return userData.votes.reduce((acc: any, vote: any) => {
      acc[vote.token_id] = vote.vote_type;
      return acc;
    }, {});
  }, [userData]);

  const handleVote = async (tokenAddress: string, voteType: 'safe' | 'rug', confidence: number, comment?: string) => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const votePromise = apiRequest(`/tokens/${tokenAddress}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType, confidence, comment }),
    });

    toast.promise(votePromise, {
      loading: 'Submitting your vote...',
      success: 'Vote recorded! +5 Reputation',
      error: (err) => `Vote failed: ${err.message}`,
    });

    try {
      await votePromise;
      // Refresh both feed (to update global vote counts) and user (to update user's vote status)
      mutateFeed();
      mutateUser();
    } catch (err) {
      // Handled by toast.promise
    }
  };

  const currentToken = useMemo(() => {
    if (!selectedToken) return null;
    return tokens.find((t: any) => t.id === selectedToken.id) || selectedToken;
  }, [selectedToken, tokens]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-black dark:text-white uppercase">Live Hunt Feed</h1>
            <p className="text-zinc-500 font-medium">Real-time safety scans for new Solana tokens.</p>
          </div>
          <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <button className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest">Newest</button>
             <button className="px-6 py-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs font-black uppercase tracking-widest transition-colors">Trending</button>
          </div>
        </div>

        {!connected ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="text-6xl animate-bounce">🔒</div>
            <h2 className="text-3xl font-black">Connect Wallet to Hunt</h2>
            <p className="text-zinc-500 max-w-xs">You need to be signed in to see the latest token scans and cast your votes.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <TokenCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={tokens.length}
            next={() => setSize(size + 1)}
            hasMore={hasMore}
            loader={
              <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TokenCardSkeleton />
                <TokenCardSkeleton />
                <TokenCardSkeleton />
                <TokenCardSkeleton />
              </div>
            }
            endMessage={
              <div className="py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs col-span-full">
                You've caught all the tokens for now! 🎯
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  userVote={userVotesMap[token.id]}
                  onVote={(type, conf, comm) => handleVote(token.address, type, conf, comm)}
                  onExpand={() => {
                    setSelectedToken(token);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </main>

      <TokenDetailModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        token={currentToken}
        userVote={currentToken ? userVotesMap[currentToken.id] : null}
        onVote={(type, conf, comm) => currentToken && handleVote(currentToken.address, type, conf, comm)}
      />
    </div>
  );
}
