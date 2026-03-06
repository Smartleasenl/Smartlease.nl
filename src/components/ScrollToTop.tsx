// src/components/ScrollToTop.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Bewaar scroll posities per pad (buiten component zodat ze niet resetten bij re-render)
const scrollPositions = new Map<string, number>();

export function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const prevKey = useRef<string>('');

  useEffect(() => {
    if (navigationType === 'POP') {
      // Teruggaan: herstel opgeslagen scroll positie
      const saved = scrollPositions.get(pathname);
      if (saved !== undefined) {
        // requestAnimationFrame zodat de pagina eerst rendert voordat we scrollen
        requestAnimationFrame(() => {
          window.scrollTo({ top: saved, behavior: 'instant' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      // Nieuwe pagina (PUSH) of redirect (REPLACE): altijd naar boven
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    prevKey.current = key;
  }, [pathname, key, navigationType]);

  // Sla scroll positie continu op terwijl de gebruiker scrollt
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(pathname, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}