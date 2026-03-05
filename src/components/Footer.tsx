// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { useSubPages } from '../hooks/usePage';
import {
  Phone, MessageCircle, Mail, Clock,
  ChevronRight, Star, Shield, Award, Users
} from 'lucide-react';

const PRIMARY = '#00B8A9';
const DARK    = '#0F2B46';

// Statische aanbod links
const AANBOD_LINKS = [
  { label: 'Volledig leaseaanbod',     to: '/aanbod' },
  { label: 'Nieuwe auto leasen',       to: '/aanbod?type=nieuw' },
  { label: 'Occasion leasen',          to: '/aanbod?type=occasion' },
  { label: 'Elektrisch leasen',        to: '/financial-lease/elektrisch-leasen' },
  { label: 'Bestelauto leasen',        to: '/financial-lease/equipment-lease' },
  { label: 'Motor leasen',             to: '/financial-lease/motor-leasen' },
  { label: 'Lease calculator',         to: '/calculator' },
  { label: 'AI Keuzehulp',             to: '/keuzehulp' },
];

export function Footer() {
  const { pages: flPages } = useSubPages('financial-lease');
  const { pages: miPages } = useSubPages('meer-informatie');
  const year = new Date().getFullYear();

  return (
    <footer>
      {/* ── USP balk ── */}
      <div style={{ background: PRIMARY }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
          }}>
            {[
              { icon: <Shield size={18} />, text: 'Volledig verzekerd advies' },
              { icon: <Clock size={18} />,  text: 'Binnen 24 uur reactie' },
              { icon: <Award size={18} />,  text: '4,9 sterren beoordeeld' },
              { icon: <Users size={18} />,  text: 'Duizenden tevreden klanten' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '16px 20px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                color: 'white', fontSize: 13.5, fontWeight: 600
              }}>
                <span style={{ opacity: 0.9 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hoofd footer ── */}
      <div style={{ background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: 48,
          }}>

            {/* Kolom 1: Merk + contact */}
            <div>
              <Link to="/">
                <img src="/smart-lease-logo.gif" alt="Smartlease.nl" style={{ height: 44, marginBottom: 20, filter: 'brightness(0) invert(1)' }} />
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.75, marginBottom: 24, maxWidth: 260 }}>
                Slimmer leasen begint hier. Jouw partner voor betrouwbare financial lease oplossingen in heel Nederland.
              </p>

              {/* Reviews */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.07)', borderRadius: 10,
                padding: '10px 14px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                  ))}
                </div>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>4,9</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>uit 5 sterren</span>
              </div>

              {/* Contact items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="tel:0858008600" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14,
                  transition: 'color 0.15s'
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${PRIMARY}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={14} color={PRIMARY} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>085 - 80 08 600</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Ma-Vr 9:00 – 18:00</div>
                  </div>
                </a>

                <a href="https://wa.me/31613669328" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14,
                  transition: 'color 0.15s'
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={14} color="#22c55e" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>WhatsApp</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Direct antwoord</div>
                  </div>
                </a>

                <a href="mailto:info@smartlease.nl" style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14,
                  transition: 'color 0.15s'
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${PRIMARY}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={14} color={PRIMARY} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>info@smartlease.nl</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Wij reageren snel</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Kolom 2: Ons aanbod */}
            <div>
              <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20, margin: '0 0 20px' }}>
                Ons aanbod
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {AANBOD_LINKS.map(link => (
                  <Link key={link.to} to={link.to} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: 13.5, padding: '5px 0', transition: 'color 0.12s'
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'white';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '0';
                    }}
                  >
                    <ChevronRight size={12} color={PRIMARY} style={{ opacity: 0, transition: 'opacity 0.12s', flexShrink: 0 }} />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Kolom 3: Financial Lease — dynamisch uit Supabase */}
            <div>
              <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 20px' }}>
                Financial Lease
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {flPages.map(p => (
                  <Link key={p.slug} to={`/${p.slug}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: 13.5, padding: '5px 0', transition: 'color 0.12s'
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'white';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '0';
                    }}
                  >
                    <ChevronRight size={12} color={PRIMARY} style={{ opacity: 0, transition: 'opacity 0.12s', flexShrink: 0 }} />
                    {p.menu_label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Kolom 4: Meer informatie — dynamisch uit Supabase */}
            <div>
              <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 20px' }}>
                Meer informatie
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {miPages.map(p => (
                  <Link key={p.slug} to={`/${p.slug}`} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    fontSize: 13.5, padding: '5px 0', transition: 'color 0.12s'
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = 'white';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                      (e.currentTarget.querySelector('svg') as HTMLElement).style.opacity = '0';
                    }}
                  >
                    <ChevronRight size={12} color={PRIMARY} style={{ opacity: 0, transition: 'opacity 0.12s', flexShrink: 0 }} />
                    {p.menu_label}
                  </Link>
                ))}
              </nav>

              {/* CTA blokje */}
              <div style={{
                marginTop: 28, background: `${PRIMARY}18`, borderRadius: 12,
                padding: '16px 18px', border: `1px solid ${PRIMARY}33`
              }}>
                <p style={{ margin: '0 0 10px', color: 'white', fontSize: 13, fontWeight: 700 }}>
                  Gratis offerte?
                </p>
                <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.5 }}>
                  Binnen 24 uur een persoonlijk voorstel.
                </p>
                <Link to="/offerte" style={{
                  display: 'block', textAlign: 'center', background: PRIMARY,
                  color: 'white', textDecoration: 'none', padding: '9px 14px',
                  borderRadius: 8, fontSize: 12.5, fontWeight: 700
                }}>
                  Aanvragen →
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                © {year} Smartlease.nl — Alle rechten voorbehouden
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { label: 'Privacybeleid', to: '/meer-informatie/veelgestelde-vragen' },
                  { label: 'Contact',       to: '/contact' },
                  { label: 'Offerte',       to: '/offerte' },
                ].map(link => (
                  <Link key={link.to} to={link.to} style={{
                    color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13,
                    transition: 'color 0.12s'
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}