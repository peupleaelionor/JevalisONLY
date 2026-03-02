/**
 * Hook pour tracker les événements Google Analytics 4
 * Usage: const { trackEvent } = useAnalytics();
 *        trackEvent('simulation_started', { country: 'france' });
 */

export function useAnalytics() {
  const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventData || {});
    }
  };

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        'page_path': pagePath,
        'page_title': pageTitle,
      });
    }
  };

  const trackConversion = (value: number, currency: string = 'EUR') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        'value': value,
        'currency': currency,
        'transaction_id': `jevalis_${Date.now()}`,
      });
    }
  };

  return { trackEvent, trackPageView, trackConversion };
}

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
