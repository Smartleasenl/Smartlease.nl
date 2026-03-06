// src/components/Footer.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FooterLink {
  id: number;
  column_key: string;
  label: string;
  url: string;
  sort_order: number;
}

interface SiteSettings {
  [key: string]: string;
}

function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  useEffect(() => {
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (data) {
        const map: SiteSettings = {};
        data.forEach(({ key, value }) => { map[key] = value; });
        setSettings(map);
      }
    });
  }, []);
  return settings;
}

function useFooterLinks() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  useEffect(() => {
    supabase
      .from('footer_links')
      .select('id,column_key,label,url,sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setLinks((data as FooterLink[]) || []));
  }, []);
  return links;
}

export function Footer() {
  const s = useSiteSettings();
  const allLinks = useFooterLinks();

  const aanbodLinks   = allLinks.filter(l => l.column_key === 'aanbod');
  const flLinks       = allLinks.filter(l => l.column_key === 'financial_lease');
  const meerInfoLinks = allLinks.filter(l => l.column_key === 'meer_informatie');

  const phone       = s['contact_phone']        || '085 - 80 08 600';
  const phoneRaw    = s['contact_phone_raw']     || '0858008600';
  const whatsapp    = s['contact_whatsapp']      || '31613669328';
  const email       = s['contact_email']         || 'info@smartlease.nl';
  const hours       = s['footer_openingstijden'] || 'Ma-Vr 9:00 – 18:00 | Za 10:00 – 14:00';
  const tagline     = s['footer_tagline']        || '';
  const copyright   = s['footer_copyright']      || `© ${new Date().getFullYear()} Smartlease.nl`;
  const reviewScore = s['review_score']          || '4,9';

  const col1Title = s['footer_col1_title'] || 'Ons aanbod';
  const col2Title = s['footer_col2_title'] || 'Financial Lease';
  const col3Title = s['footer_col3_title'] || 'Meer informatie';

  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Kolom 1 – Bedrijfsinfo */}
          <div>
            <img
              src="/smart-lease-white-logo.png"
              alt="Smartlease.nl"
              className="h-12 w-auto mb-5"
            />

            {tagline && (
              <p className="text-sm text-white/50 leading-relaxed mb-6">{tagline}</p>
            )}

            {/* Reviews badge */}
            {s['footer_show_reviews_badge'] !== 'false' && (
              <div className="flex items-center gap-2 mb-6 bg-white/5 rounded-xl px-4 py-3 w-fit">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-bold text-sm">{reviewScore}</span>
                <span className="text-white/40 text-xs">uit 5 sterren</span>
              </div>
            )}

            {/* Contactgegevens */}
            <div className="space-y-3">
              
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-3 text-sm text-white/60 hover:text-smartlease-teal transition"
              >
                <div className="w-8 h-8 rounded-lg bg-smartlease-teal/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-smartlease-teal" />
                </div>
                <div>
                  <p className="font-semibold text-white">{phone}</p>
                  <p className="text-xs text-white/40">{hours}</p>
                </div>
              </a>

              {s['footer_show_whatsapp'] !== 'false' && (
                
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-green-400 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="font-semibold text-white">WhatsApp</span>
                </a>
              )}

              {s['footer_show_email'] !== 'false' && email && (
                
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-smartlease-teal transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-smartlease-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-smartlease-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{email}</p>
                    <p className="text-xs text-white/40">Wij reageren snel</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Kolom 2 – Ons aanbod */}
          {s['footer_show_aanbod'] !== 'false' && aanbodLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">{col1Title}</h4>
              <ul className="space-y-2.5">
                {aanbodLinks.map(link => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-white/55 hover:text-smartlease-teal transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kolom 3 – Financial Lease */}
          {s['footer_show_financial_lease'] !== 'false' && flLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">{col2Title}</h4>
              <ul className="space-y-2.5">
                {flLinks.map(link => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-white/55 hover:text-smartlease-teal transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kolom 4 – Meer informatie */}
          {s['footer_show_meer_informatie'] !== 'false' && meerInfoLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">{col3Title}</h4>
              <ul className="space-y-2.5">
                {meerInfoLinks.map(link => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-white/55 hover:text-smartlease-teal transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA blok */}
        {s['footer_show_cta_blok'] !== 'false' && (
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-smartlease-teal/10 to-blue-500/10 border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-lg">Gratis offerte?</p>
              <p className="text-sm text-white/50">Binnen 24 uur een persoonlijk voorstel op maat.</p>
            </div>
            <Link
              to="/offerte"
              className="flex-shrink-0 bg-smartlease-teal hover:bg-teal-400 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              Aanvragen →
            </Link>
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>{copyright}</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <Link to="/offerte" className="hover:text-white transition">Offerte</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 