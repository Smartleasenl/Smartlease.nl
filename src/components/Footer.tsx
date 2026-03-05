// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { useSubPages } from '../hooks/usePage';
import { useFooterSettings } from '../hooks/useFooterSettings';
import { Phone, MessageCircle, Mail, Clock, ChevronRight, Star, Shield, Award, Users } from 'lucide-react';

const AANBOD_LINKS = [
  { label: 'Volledig leaseaanbod',  to: '/aanbod' },
  { label: 'Nieuwe auto leasen',    to: '/aanbod?type=nieuw' },
  { label: 'Occasion leasen',       to: '/aanbod?type=occasion' },
  { label: 'Elektrisch leasen',     to: '/financial-lease/elektrisch-leasen' },
  { label: 'Bestelauto leasen',     to: '/financial-lease/equipment-lease' },
  { label: 'Motor leasen',          to: '/financial-lease/motor-leasen' },
  { label: 'Lease calculator',      to: '/calculator' },
  { label: 'AI Keuzehulp',          to: '/keuzehulp' },
];

const USP_ITEMS = [
  { icon: Shield,  text: 'Volledig verzekerd advies' },
  { icon: Clock,   text: 'Binnen 24 uur reactie' },
  { icon: Award,   text: '4,9 sterren beoordeeld' },
  { icon: Users,   text: 'Duizenden tevreden klanten' },
];

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm py-1 transition-colors group"
    >
      <ChevronRight className="h-3 w-3 text-smartlease-teal opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      {label}
    </Link>
  );
}

export function Footer() {
  const { settings, loading: settingsLoading } = useFooterSettings();
  const { pages: flPages } = useSubPages('financial-lease');
  const { pages: miPages } = useSubPages('meer-informatie');
  const year = new Date().getFullYear();

  const show = (key: string) => settings[key] !== 'false';

  // Determine how many link columns we're showing
  const activeCols = [
    show('footer_show_aanbod'),
    show('footer_show_financial_lease'),
    show('footer_show_meer_informatie'),
  ].filter(Boolean).length;

  return (
    <footer>
      {/* ── USP balk ── */}
      {show('footer_show_usp_balk') && (
        <div className="bg-smartlease-teal">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {USP_ITEMS.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2.5 py-4 px-3 sm:px-5 text-white text-xs sm:text-sm font-semibold">
                  <Icon className="h-4 w-4 flex-shrink-0 opacity-90" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Hoofd footer ── */}
      <div className="bg-smartlease-blue">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

          {/* Grid: op mobile 1 kolom, tablet 2, desktop 4 */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-10 ${
            activeCols === 3 ? 'lg:grid-cols-4' :
            activeCols === 2 ? 'lg:grid-cols-3' :
            activeCols === 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-2'
          }`}>

            {/* ── Kolom 1: Merk & Contact (altijd zichtbaar) ── */}
            <div className="sm:col-span-2 lg:col-span-1">
              {/* Logo */}
              <Link to="/" className="inline-block mb-5">
                <img
                  src="/smart-lease-logo.gif"
                  alt="Smartlease.nl"
                  className="h-10 brightness-0 invert"
                />
              </Link>

              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                {settings['footer_tagline'] || 'Slimmer leasen begint hier. Jouw partner voor betrouwbare financial lease oplossingen in heel Nederland.'}
              </p>

              {/* Reviews badge */}
              {show('footer_show_reviews_badge') && (
                <div className="inline-flex items-center gap-2.5 bg-white/8 rounded-xl px-4 py-3 mb-6 border border-white/10">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">4,9</span>
                  <span className="text-white/50 text-xs">uit 5 sterren</span>
                </div>
              )}

              {/* Contact items */}
              <div className="flex flex-col gap-3">
                <a href="tel:0858008600" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-smartlease-teal/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-smartlease-teal" />
                  </div>
                  <div>
                    <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors">085 - 80 08 600</div>
                    <div className="text-white/40 text-xs">{settings['footer_openingstijden'] || 'Ma-Vr 9:00 – 18:00'}</div>
                  </div>
                </a>

                {show('footer_show_whatsapp') && (
                  <a href="https://wa.me/31613669328" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors">WhatsApp</div>
                      <div className="text-white/40 text-xs">Direct antwoord</div>
                    </div>
                  </a>
                )}

                {show('footer_show_email') && (
                  <a href="mailto:info@smartlease.nl" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-smartlease-teal/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-smartlease-teal" />
                    </div>
                    <div>
                      <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors">info@smartlease.nl</div>
                      <div className="text-white/40 text-xs">Wij reageren snel</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* ── Kolom 2: Ons aanbod ── */}
            {show('footer_show_aanbod') && (
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Ons aanbod</h4>
                <nav className="flex flex-col">
                  {AANBOD_LINKS.map(link => (
                    <FooterLink key={link.to} to={link.to} label={link.label} />
                  ))}
                </nav>
              </div>
            )}

            {/* ── Kolom 3: Financial Lease (dynamisch) ── */}
            {show('footer_show_financial_lease') && (
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Financial Lease</h4>
                <nav className="flex flex-col">
                  {flPages.map(p => (
                    <FooterLink key={p.slug} to={`/${p.slug}`} label={p.menu_label} />
                  ))}
                </nav>
              </div>
            )}

            {/* ── Kolom 4: Meer informatie (dynamisch) ── */}
            {show('footer_show_meer_informatie') && (
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Meer informatie</h4>
                <nav className="flex flex-col">
                  {miPages.map(p => (
                    <FooterLink key={p.slug} to={`/${p.slug}`} label={p.menu_label} />
                  ))}
                </nav>

                {/* CTA mini blok */}
                {show('footer_show_cta_blok') && (
                  <div className="mt-6 bg-smartlease-teal/15 rounded-xl p-4 border border-smartlease-teal/25">
                    <p className="text-white text-sm font-bold mb-1">Gratis offerte?</p>
                    <p className="text-white/55 text-xs leading-relaxed mb-3">Binnen 24 uur een persoonlijk voorstel.</p>
                    <Link
                      to="/offerte"
                      className="block text-center bg-smartlease-teal text-white text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-smartlease-teal/90 transition-colors"
                    >
                      Aanvragen →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Divider + bottom bar ── */}
          <div className="border-t border-white/8 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/35 text-xs order-2 sm:order-1">
              © {year} Smartlease.nl — Alle rechten voorbehouden
            </p>
            <div className="flex items-center gap-5 order-1 sm:order-2">
              {[
                { label: 'Privacy', to: '/meer-informatie/veelgestelde-vragen' },
                { label: 'Contact', to: '/contact' },
                { label: 'Offerte', to: '/offerte' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/35 hover:text-white/70 text-xs transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}