'use client';

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import useSWR from 'swr';

const fetcher = (url: string) => apiRequest(url);

export default function LeaderboardPage() {
  const { data, error, isLoading } = useSWR('/users/leaderboard', fetcher);
  const users = data?.users || [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-5xl font-black tracking-tight">Top Hunters</h1>
           <p className="text-xl text-zinc-500">The most accurate rug detectives in the ecosystem.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black dark:border-white border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-zinc-400">Rank</th>
                  <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-zinc-400">Hunter</th>
                  <th className="px-8 py-6 text-xs uppercase font-black tracking-widest text-zinc-400 text-right">Reputation</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any, index: number) => (
                  <tr key={user.id} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        index === 1 ? 'bg-zinc-300 text-zinc-700' : 
                        index === 2 ? 'bg-orange-400 text-orange-900' : 
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-lg">
                          🕵️
                        </div>
                        <div>
                          <p className="font-bold group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {user.username || `Hunter ${user.wallet_address.substring(0, 4)}`}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400">{user.wallet_address.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xl font-black tabular-nums">{user.reputation_points.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <p className="text-zinc-500 font-medium">The hunt has just begun. Be the first to the top!</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="py-12 text-center text-zinc-500">
        © 2026 TokenHunt. All rights reserved.
      </footer>
    </div>
  );
}
