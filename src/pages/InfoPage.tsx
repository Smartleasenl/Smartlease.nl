// src/pages/InfoPage.tsx
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePage, useSubPages } from '../hooks/usePage';
import { Phone, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PRIMARY = '#00B8A9';
const DARK = '#0F2B46';
const PRIMARY_LIGHT = '#e6f9f8';
const PRIMARY_MID = '#00a396';

export default function InfoPage() {
  const { '*': wildcard } = useParams();
  const navigate = useNavigate();

  // slug = bijv. "financial-lease/zzp-lease"
  const slug = wildcard || '';
  const parentSlug = slug.split('/')[0] || 'financial-lease';

  const { page, loading, error } = usePage(slug);
  const { pages: subPages } = useSubPages(parentSlug);

  // SEO: update document title + meta description
  useEffect(() => {
    if (page) {
      document.title = page.meta_title || page.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', page.meta_description || '');
    }
  }, [page]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{
            width: 40, height: 40, border: `3px solid ${PRIMARY_LIGHT}`,
            borderTop: `3px solid ${PRIMARY}`, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 15 }}>Pagina laden…</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: DARK }}>Pagina niet gevonden</h2>
        <button onClick={() => navigate(-1)} style={{ background: PRIMARY, color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>
          Terug
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f8f8', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: 'clamp(300px, 45vw, 480px)', overflow: 'hidden' }}>
        <img
          src={page.hero_image_url}
          alt={page.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(120deg, ${DARK}ee 0%, ${DARK}99 40%, transparent 100%)`
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/financial-lease" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Financial lease</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>{page.menu_label}</span>
          </div>
        </div>

        {/* Hero content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          maxWidth: 1200, margin: '0 auto', padding: '0 32px 48px'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: PRIMARY, color: 'white',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 4, marginBottom: 14
          }}>
            Financial Lease
          </div>
          <h1 style={{
            margin: '0 0 10px', color: 'white',
            fontSize: 'clamp(26px, 4vw, 52px)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.5px',
            maxWidth: 700
          }}>
            {page.title}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(15px, 2vw, 19px)', maxWidth: 560 }}>
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

          {/* ── LEFT: content ── */}
          <div>
            {/* Intro card */}
            <div style={{
              background: 'white', borderRadius: 16, padding: '32px 36px',
              marginBottom: 32, borderLeft: `5px solid ${PRIMARY}`,
              boxShadow: '0 2px 20px rgba(0,184,169,0.08)'
            }}>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.8, color: '#222', fontWeight: 400 }}>
                {page.intro}
              </p>
            </div>

            {/* Content sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {page.content?.map((section, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 14, padding: '30px 34px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  borderTop: `3px solid ${i % 2 === 0 ? PRIMARY : DARK}`,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,184,169,0.13)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                    <CheckCircle2 size={22} color={i % 2 === 0 ? PRIMARY : DARK} style={{ flexShrink: 0, marginTop: 2 }} />
                    <h2 style={{
                      margin: 0, fontSize: 20, fontWeight: 700,
                      color: DARK, lineHeight: 1.3
                    }}>
                      {section.heading}
                    </h2>
                  </div>
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.8, color: '#4a5568', paddingLeft: 36 }}>
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Back link */}
            <div style={{ marginTop: 36 }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: `2px solid ${PRIMARY}`,
                  color: PRIMARY, padding: '10px 20px', borderRadius: 8,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = PRIMARY;
                  (e.currentTarget as HTMLElement).style.color = 'white';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = PRIMARY;
                }}
              >
                <ArrowLeft size={16} /> Terug
              </button>
            </div>
          </div>

          {/* ── RIGHT: sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* CTA card */}
            <div style={{
              background: `linear-gradient(145deg, ${DARK} 0%, #1a3d5c 100%)`,
              borderRadius: 16, padding: '32px 28px',
              boxShadow: '0 8px 32px rgba(15,43,70,0.25)'
            }}>
              <h3 style={{ margin: '0 0 10px', color: 'white', fontSize: 20, fontWeight: 700 }}>
                Offerte aanvragen
              </h3>
              <p style={{ margin: '0 0 22px', color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>
                Binnen 24 uur een persoonlijk voorstel op maat. Gratis en vrijblijvend.
              </p>
              <Link
                to="/offerte"
                style={{
                  display: 'block', textAlign: 'center',
                  background: PRIMARY, color: 'white',
                  textDecoration: 'none', padding: '14px 20px',
                  borderRadius: 10, fontWeight: 700, fontSize: 15,
                  boxShadow: `0 4px 16px ${PRIMARY}55`,
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = PRIMARY_MID}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = PRIMARY}
              >
                Gratis offerte aanvragen →
              </Link>
              <a
                href="tel:0858008600"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 12, color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none', fontSize: 14, fontWeight: 500
                }}
              >
                <Phone size={15} /> 085 - 80 08 600
              </a>
            </div>

            {/* Submenu: andere pagina's */}
            {subPages.length > 1 && (
              <div style={{
                background: 'white', borderRadius: 16, padding: '24px 24px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
              }}>
                <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Financial lease
                </h4>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {subPages.map(p => {
                    const isActive = p.slug === slug;
                    return (
                      <Link
                        key={p.slug}
                        to={`/${p.slug}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                          fontSize: 14, fontWeight: isActive ? 700 : 500,
                          color: isActive ? PRIMARY : '#333',
                          background: isActive ? PRIMARY_LIGHT : 'transparent',
                          transition: 'all 0.12s'
                        }}
                        onMouseEnter={e => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f5f5f5';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        {p.menu_label}
                        {isActive && <ChevronRight size={14} color={PRIMARY} />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* USP's */}
            <div style={{
              background: PRIMARY_LIGHT, borderRadius: 14, padding: '22px 24px',
              border: `1px solid ${PRIMARY}33`
            }}>
              {[
                '✓  Binnen 24 uur reactie',
                '✓  Geen kilometerrestrictie',
                '✓  Fiscaal voordelig',
                '✓  Persoonlijk advies',
              ].map((usp, i) => (
                <div key={i} style={{
                  fontSize: 14, color: DARK, fontWeight: 600,
                  padding: '6px 0',
                  borderBottom: i < 3 ? `1px solid ${PRIMARY}22` : 'none'
                }}>
                  {usp}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA BOTTOM BANNER ── */}
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DARK} 100%)`,
        padding: '56px 32px'
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 12px', color: 'white', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}>
            Klaar om te starten met financial lease?
          </h2>
          <p style={{ margin: '0 0 28px', color: 'rgba(255,255,255,0.82)', fontSize: 16 }}>
            Vraag vandaag nog een vrijblijvende offerte aan. Onze adviseurs helpen je binnen 24 uur.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/offerte"
              style={{
                background: 'white', color: PRIMARY, textDecoration: 'none',
                padding: '15px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'transform 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
            >
              Gratis offerte aanvragen
            </Link>
            <a
              href="tel:0858008600"
              style={{
                background: 'transparent', color: 'white', textDecoration: 'none',
                padding: '15px 32px', borderRadius: 10, fontWeight: 600, fontSize: 16,
                border: '2px solid rgba(255,255,255,0.5)', transition: 'border-color 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'white'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'}
            >
              📞 085 - 80 08 600
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}