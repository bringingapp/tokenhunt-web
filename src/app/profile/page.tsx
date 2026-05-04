'use client';

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from 'swr';
import Link from "next/link";

const fetcher = (url: string) => apiRequest(url);

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const { data: user, error, isLoading } = useSWR(connected ? '/users/me' : null, fetcher);

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-black mb-4">Profile Locked</h1>
          <p className="text-zinc-500 max-w-xs mb-8">Connect your wallet to view your reputation, badges, and hunt history.</p>
          <Link href="/" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold transition-opacity hover:opacity-90">
             Back Home
          </Link>
        </main>
      </div>
    );
  }

  if (isLoading) {
     return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-black dark:border-white border-t-transparent"></div>
            </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-xl border border-zinc-200 dark:border-zinc-800 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-32 h-32 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white dark:border-zinc-800">
               🕵️
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight">{user?.username || 'Token Hunter'}</h1>
                <p className="text-zinc-500 font-mono text-sm mt-1">{publicKey?.toBase58()}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                 <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                   Rank #{user?.rank || '---'}
                 </div>
                 <div className="px-4 py-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-500/20">
                   🔥 {user?.streak_days || 0} Day Streak
                 </div>
              </div>
            </div>
            <div className="bg-black dark:bg-white text-white dark:text-black p-8 rounded-3xl text-center shadow-2xl">
              <span className="block text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-2">Total Reputation</span>
              <span className="text-5xl font-black leading-none">{user?.reputation_points || 0}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Badges Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
             <h3 className="text-xl font-black mb-6 flex items-center gap-2">
               <span>🏆</span> Badges
             </h3>
             {user?.badges && user.badges.length > 0 ? (
               <div className="grid grid-cols-4 gap-4">
                 {user.badges.map((ub: any) => (
                   <div key={ub.id} title={ub.badge.description} className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl grayscale-0 hover:grayscale-0 transition-all border border-zinc-100 dark:border-zinc-700">
                      {ub.badge.icon_url || '💎'}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="py-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
                 <p className="text-zinc-500 text-sm font-medium">No badges earned yet.</p>
                 <Link href="/feed" className="text-xs font-bold text-black dark:text-white underline mt-2 block">Start swiping to earn!</Link>
               </div>
             )}
          </div>

          {/* Activity Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
             <h3 className="text-xl font-black mb-6 flex items-center gap-2">
               <span>📈</span> Stats
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                   <span className="text-zinc-500 font-bold text-sm">Accuracy Rate</span>
                   <span className="font-black text-green-500 text-lg">---%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                   <span className="text-zinc-500 font-bold text-sm">Total Votes</span>
                   <span className="font-black text-lg">0</span>
                </div>
             </div>
          </div>
        </div>
      </main>
      
      <footer className="py-12 text-center text-zinc-500">
        © 2026 TokenHunt. All rights reserved.
      </footer>
    </div>
  );
}
