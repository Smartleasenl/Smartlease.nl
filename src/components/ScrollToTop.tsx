// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'

  useEffect(() => {
    // POP = terug/vooruit knop → scroll positie bewaren
    // PUSH = nieuwe pagina → altijd naar boven
    // REPLACE = redirect → altijd naar boven
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, navigationType]);

  return null;
}