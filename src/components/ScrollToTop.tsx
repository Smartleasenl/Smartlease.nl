// src/components/ScrollToTop.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Bewaar scroll posities per pad+search (buiten component zodat ze niet resetten bij re-render)
const scrollPositions = new Map<string, number>();

/**
 * Exporteer deze helper zodat Header de echte scrollY kan opslaan
 * VÓÓR de body-lock (position:fixed) window.scrollY naar 0 reset.
 */
export function saveScrollPosition(key: string, y: number) {
  scrollPositions.set(key, y);
}

export function ScrollToTop() {
  const { pathname, search, key } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const prevKey = useRef<string>('');

  useEffect(() => {
    if (navigationType === 'POP') {
      // Teruggaan: herstel opgeslagen scroll positie
      const saved = scrollPositions.get(pathname + search);
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved ?? 0, behavior: 'instant' });
      });
    } else {
      // Nieuwe pagina (PUSH) of redirect (REPLACE): altijd naar boven
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    prevKey.current = key;
  }, [pathname, search, key, navigationType]);

  // Sla scroll positie continu op terwijl de gebruiker scrollt
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(pathname + search, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, search]);

  return null;
}