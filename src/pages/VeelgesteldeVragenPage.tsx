// src/pages/VeelgesteldeVragenPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Phone, MessageCircle } from 'lucide-react';

interface Faq {
  id: string;
  vraag: string;
  antwoord: string;
  categorie: string;
  sort_order: number;
}

const CATEGORIEEN = ['Algemeen', 'Financieel', 'Contract', 'Aanbod', 'Proces'];

export default function VeelgesteldeVragenPage() {
  const [faqs, setFaqs]         = useState<Faq[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activecat, setActivecat] = useState<string>('Alle');

  useEffect(() => {
    supabase.from('faqs').select('*').eq('is_published', true)
      .order('sort_order').order('created_at')
      .then(({ data }) => { setFaqs((data as Faq[]) || []); setLoading(false); });
  }, []);

  const cats = ['Alle', ...CATEGORIEEN.filter(c => faqs.some(f => f.categorie === c))];
  const filtered = activecat === 'Alle' ? faqs : faqs.filter(f => f.categorie === activecat);

  // Groepeer alleen als "Alle" actief
  const grouped = activecat === 'Alle'
    ? CATEGORIEEN.reduce((acc, cat) => {
        const items = faqs.filter(f => f.categorie === cat);
        if (items.length) acc[cat] = items;
        return acc;
      }, {} as Record<string, Faq[]>)
    : { [activecat]: filtered };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-smartlease-blue via-[#1a3d5c] to-smartlease-blue py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex bg-smartlease-teal/20 text-smartlease-teal text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Veelgestelde vragen
          </div>
          <h1 className="text-white font-extrabold mb-4" style={{ fontSize: 'clamp(24px, 4vw, 46px)' }}>
            Alles wat je wilt weten over financial lease
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto leading-relaxed">
            Staat jouw vraag er niet bij? Neem dan direct contact met ons op — wij helpen je graag.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => setActivecat(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activecat === cat ? 'bg-smartlease-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-smartlease-teal rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                {activecat === 'Alle' && (
                  <h2 className="text-smartlease-blue font-bold text-lg mb-4">{cat}</h2>
                )}
                <div className="flex flex-col gap-2">
                  {items.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition"
                        onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                      >
                        <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                          {faq.vraag}
                        </span>
                        {expanded === faq.id
                          ? <ChevronUp className="h-5 w-5 text-smartlease-teal flex-shrink-0" />
                          : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        }
                      </button>
                      {expanded === faq.id && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-50">
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.antwoord}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact blok */}
        <div className="mt-12 bg-smartlease-blue rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-white font-bold text-xl mb-2">Staat je vraag er niet bij?</h3>
          <p className="text-white/65 text-sm mb-6">Onze adviseurs beantwoorden al je vragen snel en persoonlijk.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:0858008600"
              className="flex items-center justify-center gap-2 bg-smartlease-teal text-white font-bold py-3 px-6 rounded-xl text-sm hover:bg-smartlease-teal/90 transition">
              <Phone className="h-4 w-4" /> 085 - 80 08 600
            </a>
            <a href="https://wa.me/31613669328" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold py-3 px-6 rounded-xl text-sm hover:bg-white/10 transition">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link to="/offerte"
              className="flex items-center justify-center gap-2 bg-white text-smartlease-teal font-bold py-3 px-6 rounded-xl text-sm hover:bg-white/90 transition">
              Gratis offerte →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}