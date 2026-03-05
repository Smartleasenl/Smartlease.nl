// src/pages/InfoPage.tsx
import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { usePage, useSubPages } from '../hooks/usePage';
import { Phone, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PRIMARY       = '#00B8A9';
const DARK          = '#0F2B46';
const PRIMARY_LIGHT = '#e6f9f8';

export default function InfoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // "/financial-lease/zzp-lease" → "financial-lease/zzp-lease"
  const slug       = location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const parentSlug = slug.split('/')[0];

  const { page, loading, error } = usePage(slug);
  const { pages: subPages }      = useSubPages(parentSlug);

  // SEO
  useEffect(() => {
    if (page) {
      document.title = page.meta_title || page.title;
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', page.meta_description || '');
    }
  }, [page]);

  // Als alleen parent-slug bezocht wordt (/financial-lease zonder subpagina)
  // redirect naar eerste subpagina
  useEffect(() => {
    if (!loading && !page && subPages.length > 0) {
      navigate(`/${subPages[0].slug}`, { replace: true });
    }
  }, [loading, page, subPages, navigate]);

  const parentLabel = parentSlug === 'financial-lease' ? 'Financial Lease' : 'Meer informatie';

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: `3px solid #e6f9f8`,
            borderTop: `3px solid ${PRIMARY}`, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: '#888', fontSize: 15 }}>Laden…</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: DARK, margin: 0 }}>Pagina niet gevonden</h2>
        <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
          Gezochte slug: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>{slug}</code>
        </p>
        <button onClick={() => navigate(-1)} style={{
          background: PRIMARY, color: 'white', border: 'none',
          padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600
        }}>
          ← Terug
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f8f8', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: 'clamp(280px, 40vw, 460px)', overflow: 'hidden' }}>
        {page.hero_image_url
          ? <img src={page.hero_image_url} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />
          : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${DARK} 0%, #1a4a6e 100%)` }} />
        }
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(120deg, ${DARK}ee 0%, ${DARK}88 40%, transparent 100%)`
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to={`/${parentSlug}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{parentLabel}</Link>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>{page.menu_label}</span>
          </div>
        </div>

        {/* Hero inhoud */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 1200, margin: '0 auto', padding: '0 32px 44px' }}>
          <div style={{
            display: 'inline-flex', background: PRIMARY, color: 'white',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4, marginBottom: 12
          }}>
            {parentLabel}
          </div>
          <h1 style={{ margin: '0 0 8px', color: 'white', fontSize: 'clamp(22px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, maxWidth: 700 }}>
            {page.title}
          </h1>
          {page.subtitle && (
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(14px, 2vw, 18px)', maxWidth: 560 }}>
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 296px', gap: 36, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Intro */}
            {page.intro && (
              <div style={{
                background: 'white', borderRadius: 14, padding: '26px 30px', marginBottom: 24,
                borderLeft: `5px solid ${PRIMARY}`, boxShadow: '0 2px 20px rgba(0,184,169,0.07)'
              }}>
                <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85, color: '#222' }}>{page.intro}</p>
              </div>
            )}

            {/* Secties */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {page.content?.map((section, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 13, padding: '24px 28px',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
                  borderTop: `3px solid ${i % 2 === 0 ? PRIMARY : DARK}`,
                  transition: 'transform 0.18s, box-shadow 0.18s'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 26px rgba(0,184,169,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10 }}>
                    <CheckCircle2 size={19} color={i % 2 === 0 ? PRIMARY : DARK} style={{ flexShrink: 0, marginTop: 3 }} />
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>
                      {section.heading}
                    </h2>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.85, color: '#4a5568', paddingLeft: 30 }}>
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            <button onClick={() => navigate(-1)} style={{
              marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'transparent', border: `2px solid ${PRIMARY}`, color: PRIMARY,
              padding: '9px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer'
            }}>
              <ArrowLeft size={14} /> Terug
            </button>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* CTA kaart */}
            <div style={{ background: `linear-gradient(145deg, ${DARK}, #1a3d5c)`, borderRadius: 16, padding: '26px 22px', boxShadow: '0 8px 30px rgba(15,43,70,0.22)' }}>
              <h3 style={{ margin: '0 0 8px', color: 'white', fontSize: 18, fontWeight: 700 }}>Offerte aanvragen</h3>
              <p style={{ margin: '0 0 18px', color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.6 }}>
                Binnen 24 uur een persoonlijk voorstel. Gratis en vrijblijvend.
              </p>
              <Link to="/offerte" style={{
                display: 'block', textAlign: 'center', background: PRIMARY, color: 'white',
                textDecoration: 'none', padding: '12px 16px', borderRadius: 10, fontWeight: 700, fontSize: 14
              }}>
                Gratis offerte aanvragen →
              </Link>
              <a href="tel:0858008600" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginTop: 10, color: 'rgba(255,255,255,0.72)', textDecoration: 'none', fontSize: 13
              }}>
                <Phone size={13} /> 085 - 80 08 600
              </a>
            </div>

            {/* Submenu */}
            {subPages.length > 0 && (
              <div style={{ background: 'white', borderRadius: 14, padding: '18px 18px', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {parentLabel}
                </p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {subPages.map(p => {
                    const active = `/${p.slug}` === location.pathname;
                    return (
                      <Link key={p.slug} to={`/${p.slug}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 9px', borderRadius: 7, textDecoration: 'none',
                        fontSize: 13, fontWeight: active ? 700 : 500,
                        color: active ? PRIMARY : '#333',
                        background: active ? PRIMARY_LIGHT : 'transparent',
                        transition: 'background 0.1s'
                      }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f5f5f5'; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        {p.menu_label}
                        {active && <ChevronRight size={12} color={PRIMARY} />}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* USP's */}
            <div style={{ background: PRIMARY_LIGHT, borderRadius: 13, padding: '16px 18px', border: `1px solid ${PRIMARY}33` }}>
              {['✓  Binnen 24 uur reactie', '✓  Geen kilometerrestrictie', '✓  Fiscaal voordelig', '✓  Persoonlijk advies'].map((u, i, a) => (
                <div key={i} style={{
                  fontSize: 13, color: DARK, fontWeight: 600, padding: '5px 0',
                  borderBottom: i < a.length - 1 ? `1px solid ${PRIMARY}22` : 'none'
                }}>{u}</div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM BANNER ── */}
      <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${DARK})`, padding: '48px 32px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px', color: 'white', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800 }}>
            Klaar om te starten?
          </h2>
          <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.82)', fontSize: 15 }}>
            Onze adviseurs helpen je binnen 24 uur — gratis en vrijblijvend.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/offerte" style={{
              background: 'white', color: PRIMARY, textDecoration: 'none',
              padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15
            }}>
              Gratis offerte aanvragen
            </Link>
            <a href="tel:0858008600" style={{
              background: 'transparent', color: 'white', textDecoration: 'none',
              padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15,
              border: '2px solid rgba(255,255,255,0.5)'
            }}>
              📞 085 - 80 08 600
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}