// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { useSubPages } from '../hooks/usePage';
import { useFooterSettings } from '../hooks/useFooterSettings';
import { Phone, MessageCircle, Mail, ChevronRight, Star, Shield, Clock, Award, Users } from 'lucide-react';

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
  { icon: Shield, text: 'Volledig verzekerd advies' },
  { icon: Clock,  text: 'Binnen 24 uur reactie'    },
  { icon: Award,  text: '4,9 sterren beoordeeld'   },
  { icon: Users,  text: 'Duizenden tevreden klanten'},
];

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 text-[13.5px] text-white/50 hover:text-white py-[5px] transition-all duration-200"
    >
      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 flex-shrink-0">
        <ChevronRight className="h-3 w-3 text-smartlease-teal" />
      </span>
      {label}
    </Link>
  );
}

export function Footer() {
  const { settings } = useFooterSettings();
  const { pages: flPages } = useSubPages('financial-lease');
  const { pages: miPages } = useSubPages('meer-informatie');
  const year = new Date().getFullYear();
  const show = (key: string) => settings[key] !== 'false';

  return (
    <footer className="relative">

      {/* ── USP strip ── */}
      {show('footer_show_usp_balk') && (
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #009e91 0%, #00B8A9 50%, #00cfc0 100%)' }}
        >
          {/* Subtle diagonal pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {USP_ITEMS.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-4 px-4 sm:px-6 text-white text-xs sm:text-sm font-semibold
                    ${i < 3 ? 'border-r border-white/20' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main footer ── */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(160deg, #0d263d 0%, #0F2B46 40%, #0a2038 100%)' }}
      >
        {/* Top fade line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Subtle radial glow top-right */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00B8A9 0%, transparent 70%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 lg:gap-8">

            {/* Kolom 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block mb-6">
                <img
                  src="/smart-lease-logo.gif"
                  alt="Smartlease.nl"
                  className="h-9 brightness-0 invert opacity-90"
                />
              </Link>

              <p className="text-white/45 text-[13.5px] leading-[1.8] mb-7 max-w-[260px]">
                {settings['footer_tagline'] || 'Slimmer leasen begint hier. Jouw partner voor betrouwbare financial lease oplossingen in heel Nederland.'}
              </p>

              {/* Reviews badge */}
              {show('footer_show_reviews_badge') && (
                <div className="inline-flex items-center gap-3 mb-7 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.04]">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="h-4 w-px bg-white/15" />
                  <span className="text-white font-bold text-sm">4,9</span>
                  <span className="text-white/35 text-xs">uit 5 sterren</span>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <a
                  href="tel:0858008600"
                  className="group flex items-center gap-3 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-smartlease-teal/15 border border-smartlease-teal/20 flex items-center justify-center flex-shrink-0 group-hover:bg-smartlease-teal/25 transition-colors">
                    <Phone className="h-[15px] w-[15px] text-smartlease-teal" />
                  </div>
                  <div>
                    <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors leading-tight">085 - 80 08 600</div>
                    <div className="text-white/30 text-[11px] mt-0.5">{settings['footer_openingstijden'] || 'Ma-Vr 9:00 – 18:00'}</div>
                  </div>
                </a>

                {show('footer_show_whatsapp') && (
                  <a
                    href="https://wa.me/31613669328"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 hover:translate-x-0.5 transition-transform duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <MessageCircle className="h-[15px] w-[15px] text-green-400" />
                    </div>
                    <div>
                      <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors leading-tight">WhatsApp</div>
                      <div className="text-white/30 text-[11px] mt-0.5">Direct antwoord</div>
                    </div>
                  </a>
                )}

                {show('footer_show_email') && (
                  <a
                    href="mailto:info@smartlease.nl"
                    className="group flex items-center gap-3 hover:translate-x-0.5 transition-transform duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-smartlease-teal/15 border border-smartlease-teal/20 flex items-center justify-center flex-shrink-0 group-hover:bg-smartlease-teal/25 transition-colors">
                      <Mail className="h-[15px] w-[15px] text-smartlease-teal" />
                    </div>
                    <div>
                      <div className="text-white/80 group-hover:text-white text-sm font-semibold transition-colors leading-tight">info@smartlease.nl</div>
                      <div className="text-white/30 text-[11px] mt-0.5">Wij reageren snel</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Kolom 2: Aanbod */}
            {show('footer_show_aanbod') && (
              <div>
                <h4 className="text-[10.5px] font-bold text-white/30 uppercase tracking-[0.12em] mb-5">
                  Ons aanbod
                </h4>
                <nav className="flex flex-col">
                  {AANBOD_LINKS.map(link => (
                    <NavLink key={link.to} to={link.to} label={link.label} />
                  ))}
                </nav>
              </div>
            )}

            {/* Kolom 3: Financial Lease */}
            {show('footer_show_financial_lease') && (
              <div>
                <h4 className="text-[10.5px] font-bold text-white/30 uppercase tracking-[0.12em] mb-5">
                  Financial Lease
                </h4>
                <nav className="flex flex-col">
                  {flPages.map(p => (
                    <NavLink key={p.slug} to={`/${p.slug}`} label={p.menu_label} />
                  ))}
                </nav>
              </div>
            )}

            {/* Kolom 4: Meer informatie */}
            {show('footer_show_meer_informatie') && (
              <div>
                <h4 className="text-[10.5px] font-bold text-white/30 uppercase tracking-[0.12em] mb-5">
                  Meer informatie
                </h4>
                <nav className="flex flex-col">
                  {miPages.map(p => (
                    <NavLink key={p.slug} to={`/${p.slug}`} label={p.menu_label} />
                  ))}
                </nav>

                {/* CTA blokje */}
                {show('footer_show_cta_blok') && (
                  <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-smartlease-teal/40 to-smartlease-teal/10">
                    <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4">
                      <p className="text-white text-sm font-bold mb-1">Gratis offerte?</p>
                      <p className="text-white/40 text-xs leading-relaxed mb-3">
                        Binnen 24 uur een persoonlijk voorstel op maat.
                      </p>
                      <Link
                        to="/offerte"
                        className="block text-center text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200"
                        style={{ background: 'linear-gradient(90deg, #00B8A9, #00a396)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      >
                        Aanvragen →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs order-2 sm:order-1">
              © {year} Smartlease.nl — Alle rechten voorbehouden
            </p>
            <div className="flex items-center gap-6 order-1 sm:order-2">
              {[
                { label: 'Privacy',  to: '/meer-informatie/veelgestelde-vragen' },
                { label: 'Contact',  to: '/contact' },
                { label: 'Offerte',  to: '/offerte' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-white/25 hover:text-white/60 text-xs transition-colors duration-200"
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