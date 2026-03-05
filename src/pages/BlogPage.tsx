// src/pages/BlogPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  read_time: number;
  published_at: string;
}

const GRADIENT_MAP: Record<string, string> = {
  'Advies':    'from-teal-500 to-cyan-500',
  'Fiscaal':   'from-blue-500 to-indigo-500',
  'Top 10':    'from-violet-500 to-purple-500',
  'Elektrisch':'from-emerald-500 to-green-500',
  'Nieuws':    'from-amber-500 to-orange-500',
  'Algemeen':  'from-gray-500 to-gray-600',
};

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<string>('Alle');

  useEffect(() => {
    supabase.from('blog_posts').select('id,slug,title,excerpt,image_url,category,read_time,published_at')
      .eq('is_published', true)
      .order('sort_order').order('published_at', { ascending: false })
      .then(({ data }) => { setPosts((data as BlogPost[]) || []); setLoading(false); });
  }, []);

  const cats = ['Alle', ...Array.from(new Set(posts.map(p => p.category)))];
  const filtered = filter === 'Alle' ? posts : posts.filter(p => p.category === filter);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-smartlease-blue via-[#1a3d5c] to-smartlease-blue py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-smartlease-teal/20 text-smartlease-teal text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Financial lease blog
          </div>
          <h1 className="text-white font-extrabold mb-4" style={{ fontSize: 'clamp(24px, 4vw, 46px)' }}>
            Tips, trends & inzichten
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto">
            Alles wat je wilt weten over financial lease, fiscale voordelen en slim ondernemen.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === cat ? 'bg-smartlease-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-smartlease-teal rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Geen artikelen gevonden.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => (
              <article key={post.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg text-white bg-gradient-to-r ${GRADIENT_MAP[post.category] || 'from-gray-500 to-gray-600'} uppercase tracking-wide`}>
                    {post.category}
                  </span>
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    <Clock className="h-3 w-3" /> {post.read_time} min
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{formatDate(post.published_at)}</p>
                  <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-smartlease-teal transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-smartlease-teal">
                    Lees verder <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}