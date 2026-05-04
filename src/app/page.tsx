import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white mb-6">
          Hunt Safely. <br />
          <span className="text-zinc-500 dark:text-zinc-400">Vote Smart.</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10">
          Discover new Solana tokens with AI-powered safety scans and community-driven validation.
          Don't just hunt gems, hunt safe ones.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/feed" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
            Start Swiping
          </Link>
          <Link href="/about" className="px-8 py-4 bg-white dark:bg-zinc-900 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-full font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Learn More
          </Link>
        </div>
      </main>
      <footer className="py-8 px-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
        © 2026 TokenHunt. All rights reserved.
      </footer>
    </div>
  );
}
