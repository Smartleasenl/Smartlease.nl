import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Blog data (hardcoded for now, later from Supabase) ──────────────────────

const BLOG_POSTS = [
  {
    id: 1,
    slug: 'financial-lease-vs-persoonlijke-lening',
    title: 'Financial lease of persoonlijke lening?',
    excerpt: 'Als ondernemer overweeg je verschillende manieren om een auto te financieren. Wij zetten de voor- en nadelen op een rij.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    date: '21 feb 2026',
    readTime: '5 min',
    category: 'Advies',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 2,
    slug: 'btw-terugvorderen-lease-auto',
    title: 'BTW terugvorderen op je lease auto: zo werkt het',
    excerpt: 'Wist je dat je de BTW op de aanschaf van je financial lease auto direct kunt terugvorderen? Wij leggen stap voor stap uit hoe.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop',
    date: '14 feb 2026',
    readTime: '4 min',
    category: 'Fiscaal',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    id: 3,
    slug: 'beste-lease-auto-2026',
    title: 'De 10 beste lease auto\'s van 2026',
    excerpt: 'Van zuinige hybrides tot luxe SUV\'s — onze experts hebben de beste lease deals van dit moment geselecteerd.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop',
    date: '7 feb 2026',
    readTime: '7 min',
    category: 'Top 10',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 4,
    slug: 'elektrisch-leasen-voordelen',
    title: 'Elektrisch leasen: dit zijn de voordelen',
    excerpt: 'Elektrisch rijden wordt steeds aantrekkelijker. Ontdek waarom financial lease van een EV fiscaal slim is.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=500&fit=crop',
    date: '1 feb 2026',
    readTime: '6 min',
    category: 'Elektrisch',
    gradient: 'from-emerald-500 to-green-500',
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export function BlogSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Update active dot
    const cardWidth = el.scrollWidth / BLOG_POSTS.length;
    const newIndex = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, BLOG_POSTS.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.blog-card')?.clientWidth || 380;
    el.scrollBy({ left: dir === 'right' ? cardWidth + 20 : -(cardWidth + 20), behavior: 'smooth' });
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelectorAll('.blog-card')[idx] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <section ref={sectionRef} className="relative pt-20 md:pt-28 pb-10 md:pb-14 overflow-hidden bg-[#f8f9fb]">
      {/* ── Background accents ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-teal-100/40 to-cyan-100/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/30 to-indigo-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-200/50 text-teal-600 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold text-sm">Updates & Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Het laatste{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                nieuws
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-lg max-w-lg">
              Tips, trends en inzichten over financial lease en slim ondernemen
            </p>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden md:flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:hover:shadow-none transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:hover:shadow-none transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Cards Carousel ── */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar"
        >
          {BLOG_POSTS.map((post, idx) => (
            <article
              key={post.id}
              className={`blog-card group relative flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[calc(33.333%-14px)] snap-start cursor-pointer transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: visible ? `${200 + idx * 120}ms` : '0ms' }}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                {/* Image container */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${post.gradient} text-white text-xs font-bold uppercase tracking-wider shadow-lg`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Read time */}
                  <div className="absolute bottom-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold shadow-sm">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 md:p-6">
                  <p className="text-xs text-gray-400 font-medium mb-2">{post.date}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="flex items-center gap-2 text-sm font-bold text-teal-500 group-hover:text-teal-600 transition-colors">
                    <span>Lees verder</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>

                {/* Bottom gradient line */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${post.gradient} transition-all duration-500 ease-out`} />
              </div>
            </article>
          ))}
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {BLOG_POSTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`transition-all duration-400 rounded-full ${
                activeIndex === idx
                  ? 'w-8 h-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30'
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className={`text-center mt-12 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '900ms' }}>
          <button
            onClick={() => navigate('/blog')}
            className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-xl font-semibold text-sm border border-gray-200 hover:border-teal-300 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-teal-500/10"
          >
            Bekijk alle artikelen
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}