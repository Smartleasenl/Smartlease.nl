// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { saveScrollPosition, getScrollPosition } from '../utils/scrollStore';

// Vertel de browser: doe NIETS met scroll herstel, wij doen het zelf
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

export function ScrollToTop() {
  const { pathname, search, key } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') {
      const target = getScrollPosition(pathname + search);

      if (target === 0) {
        // Geen opgeslagen positie → gewoon naar boven
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      // Probeer te scrollen zodra de pagina genoeg hoogte heeft
      // Retry tot max ~600ms zodat async-geladen content (bijv. voertuigen van Supabase)
      // tijd heeft om te renderen voordat we naar de juiste positie scrollen.
      let attempts = 0;
      const maxAttempts = 12; // 12 × 50ms = 600ms

      const tryScroll = () => {
        const pageHeight = document.documentElement.scrollHeight;
        if (pageHeight > target + window.innerHeight || attempts >= maxAttempts) {
          window.scrollTo({ top: target, behavior: 'instant' });
        } else {
          attempts++;
          setTimeout(tryScroll, 50);
        }
      };

      // Eerste poging na één frame zodat React de DOM heeft geupdate
      requestAnimationFrame(() => setTimeout(tryScroll, 0));

    } else {
      // PUSH of REPLACE: altijd naar boven
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [key]); // key verandert bij elke navigatie, ook bij zelfde pathname

  // Sla scroll positie continu op
  useEffect(() => {
    const handleScroll = () => {
      saveScrollPosition(pathname + search, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, search]);

  return null;
}