/**
 * Stripe Products Configuration
 * Centralized product and price definitions for Jevalis
 */

export const STRIPE_PRODUCTS = {
  /**
   * Pack Complet : Ebook + Résultats PDF basique
   * Prix: 9,99 €
   */
  PACK_COMPLET: {
    name: "Pack Complet : Ebook + Vos Résultats PDF",
    description: "Guide fiscal 20 pages (6 pays) + Vos résultats de simulation en PDF téléchargeable avec calculs détaillés personnalisés",
    price: 999, // En centimes (9,99 €)
    currency: "eur",
    metadata: {
      product_type: "pack_complet",
      includes: "ebook,pdf_basic",
      pages: "20",
      countries: "FR,CH,BE,LU,NL,DE",
    },
  },

  /**
   * Rapport Premium : Analyse complète avec graphiques
   * Prix: 39,99 €
   */
  PREMIUM: {
    name: "Rapport Premium : Analyse Complète Professionnelle",
    description: "Rapport PDF premium avec graphiques interactifs, comparaison 3 scénarios fiscaux, recommandations d'optimisation et simulation de stratégies d'économie",
    price: 3999, // En centimes (39,99 €)
    currency: "eur",
    metadata: {
      product_type: "premium",
      includes: "analysis,charts,scenarios,recommendations,strategies",
    },
  },
} as const;

export type ProductType = keyof typeof STRIPE_PRODUCTS;
