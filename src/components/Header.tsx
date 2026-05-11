'use client';

import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import bs58 from 'bs58';
import Link from 'next/link';
import Image from 'next/image';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Header() {
    const { publicKey, signMessage, connected, disconnect } = useWallet();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = useCallback(async () => {
        if (!publicKey || !signMessage) return;

        try {
            setLoading(true);
            const message = `Login to TokenHunt: ${new Date().toISOString().split('T')[0]}`;
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signature);

            const { accessToken, user } = await authApi.login(
                publicKey.toBase58(),
                signatureBase58,
                message
            );

            localStorage.setItem('token', accessToken);
            setUser(user);
            console.log('Logged in as:', user.walletAddress);
        } catch (error) {
            console.error('Login failed:', error);
            // If login fails, maybe disconnect wallet to allow retry
            disconnect();
        } finally {
            setLoading(false);
        }
    }, [publicKey, signMessage, disconnect]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (connected && publicKey && !user && !loading && !token) {
            handleLogin();
        } else if (connected && token && !user && !loading) {
            // Try to fetch user profile if token exists
            authApi.getMe()
                .then(u => setUser(u))
                .catch(() => {
                    localStorage.removeItem('token');
                    handleLogin();
                });
        }
    }, [connected, publicKey, user, loading, handleLogin]);

    return (
        <header className="flex items-center justify-between py-4 px-8 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-10">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/brand/tokenhunt-icon.svg"
                        alt=""
                        width={32}
                        height={32}
                        aria-hidden="true"
                    />
                    <span className="text-2xl font-bold text-black dark:text-white">TokenHunt</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/feed" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Feed</Link>
                    <Link href="/leaderboard" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Leaderboard</Link>
                    {user && <Link href="/profile" className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Profile</Link>}
                </nav>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Reputation</span>
                        <span className="text-sm font-bold text-black dark:text-white">{user.reputation_points || 0}</span>
                    </div>
                )}
                <WalletMultiButtonDynamic />
            </div>
        </header>
    );
}
