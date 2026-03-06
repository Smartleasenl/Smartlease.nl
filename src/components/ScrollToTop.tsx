// src/components/ScrollToTop.tsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { saveScrollPosition, getScrollPosition } from '../utils/scrollStore';

export function ScrollToTop() {
  const { pathname, search, key } = useLocation();
  const navigationType = useNavigationType();
  const prevKey = useRef<string>('');

  useEffect(() => {
    if (navigationType === 'POP') {
      const saved = getScrollPosition(pathname + search);
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved, behavior: 'instant' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    prevKey.current = key;
  }, [pathname, search, key, navigationType]);

  useEffect(() => {
    const handleScroll = () => {
      saveScrollPosition(pathname + search, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, search]);

  return null;
}