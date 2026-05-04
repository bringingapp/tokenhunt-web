'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className}`}></div>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="aspect-[3/4] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm animate-pulse flex flex-col p-5">
      {/* Token Icon */}
      <div className="flex flex-col items-center mb-3">
        <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-2"></div>
        <div className="h-5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-1.5"></div>
        <div className="h-2.5 w-28 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
      </div>

      {/* Safety Score */}
      <div className="flex flex-col items-center mb-3">
        <div className="h-2.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-1.5"></div>
        <div className="h-10 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2 space-y-1">
          <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto"></div>
          <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto"></div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2 space-y-1">
          <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto"></div>
          <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto"></div>
        </div>
      </div>

      {/* Vote Counts */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="h-2.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
        <div className="h-2.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl"></div>
      </div>
    </div>
  );
}
