// src/components/ScrollToTop.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Bewaar scroll posities per pad (buiten component zodat ze niet resetten bij re-render)
const scrollPositions = new Map<string, number>();

// Exporteer helper zodat Header de echte scrollY kan doorgeven vóór body-lock
export function saveScrollPosition(pathname: string, y: number) {
  scrollPositions.set(pathname, y);
}

export function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const prevKey = useRef<string>('');

  useEffect(() => {
    if (navigationType === 'POP') {
      const saved = scrollPositions.get(pathname);
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved ?? 0, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    prevKey.current = key;
  }, [pathname, key, navigationType]);

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(pathname, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}