# Jevalis — Simulation Fiscale Immobilière Européenne

Jevalis est un simulateur fiscal immobilier en ligne permettant d'évaluer l'impact financier d'une opération immobilière en Europe (France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne).

## Fonctionnalités

- Simulation des frais de notaire, impôts sur la plus-value et mensualités de prêt
- Prise en charge de 6 pays européens avec leurs spécificités fiscales
- Interface moderne et responsive (mode sombre)
- Génération de rapport PDF professionnel

## Structure du projet

```
/
├── client/             # Frontend React (Vite)
├── server/             # Backend Express + tRPC
├── shared/             # Types et constantes partagés
├── drizzle/            # Schéma BDD et migrations (MySQL)
├── netlify/functions/  # Netlify Function (point d'entrée API)
├── netlify.toml        # Configuration Netlify
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Lancer le projet

### En local

```bash
pnpm install
pnpm run dev
```

Puis accédez à [http://localhost:3000](http://localhost:3000).

### Déploiement sur Netlify

Le projet est configuré pour un déploiement automatique sur [Netlify](https://netlify.com) :

1. Connectez votre repository GitHub à Netlify
2. La configuration `netlify.toml` gère tout automatiquement :
   - Build : `pnpm run build`
   - Publish : `dist/public`
   - API : Netlify Functions (`/api/*` → `/.netlify/functions/api`)
   - SPA : Redirections client-side
3. Ajoutez vos variables d'environnement dans **Netlify → Site settings → Environment variables**

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les principales :

- `DATABASE_URL` — Connexion MySQL (Supabase)
- `JWT_SECRET` — Secret pour les sessions
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe
- `VITE_STRIPE_PUBLISHABLE_KEY` — Clé Stripe côté client
- `RESEND_API_KEY` — Service d'envoi d'emails
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Stockage PDF

## Licence

Tous droits réservés © Jevalis
