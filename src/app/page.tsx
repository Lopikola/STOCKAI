'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { NewsItem } from '@lib/types';

export default function Home() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleMagicLinkAndFetch = async () => {
      const supabase = createPagesBrowserClient();

      // Check and restore session from magic link
      await supabase.auth.getSession();

      // Optional: redirect authenticated users to /admin
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // router.replace('/admin'); // <- enable this if you want auto-redirect
      }

      // Fetch news data
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch news items:', error);
      } else {
        setNewsItems((data || []) as NewsItem[]);
      }

      setLoading(false);
    };

    handleMagicLinkAndFetch();
  }, [router]);

  if (loading) {
    return <main className="p-8 text-white bg-black min-h-screen">Loading...</main>;
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-4xl font-bold">🚀 Stock News AI</h1>
      <p className="mt-4 text-lg">
        Live stock market headlines, AI-powered analysis, and trading signals.
      </p>

      {/* Hero Section */}
      <section className="mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-2">Stay Ahead of the Market</h2>
        <p className="mb-4 text-zinc-100">
          Create an account to receive real-time AI trading signals.
        </p>
        <div className="flex space-x-4">
          <a
            href="/signup"
            className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-zinc-200"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="border border-white text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-black"
          >
            Log In
          </a>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
         <div key={item.id} className="p-4 border border-zinc-700 rounded-lg bg-zinc-900">
            <div className="text-sm text-zinc-400">
              {new Date(item.published_at).toLocaleString()}
            </div>
            <div className="text-lg font-semibold">{item.headline}</div>
            <div className="text-sm">Ticker: {item.ticker}</div>
            <div className="text-sm">Sentiment: {item.sentiment}</div>
            <div className="text-sm">Signal: {item.signal}</div>
          </div>
        ))}
      </div>
    </main>
  );
}





 
 
 
 
 
 
 



