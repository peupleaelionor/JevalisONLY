# Jevalis — Simulation Fiscale Immobilière Européenne

Application web full-stack pour la simulation fiscale immobilière et la gestion de ventes d'ebooks.

## Stack technique

- **Frontend** : React 19 + Vite + TailwindCSS v4 + shadcn/ui
- **Routing** : wouter
- **API** : tRPC v11 + Express (serverless Vercel via `api/index.ts`)
- **Base de données** : Drizzle ORM + MySQL (Supabase compatible)
- **Auth** : JWT (bcryptjs)
- **Paiement** : Stripe
- **Emails** : Resend
- **Stockage** : Supabase Storage (S3-compatible)

## Commandes

```bash
# Installation des dépendances
pnpm install

# Développement local
pnpm dev

# Build de production (frontend uniquement — Vercel gère l'API en serverless)
pnpm build

# Build du serveur Express pour usage local
pnpm build:server

# Push du schéma Drizzle vers la base de données
pnpm db:push

# Vérification TypeScript
pnpm check

# Tests
pnpm test
```

## Structure du projet

```
/
├── api/              # Entrée serverless Vercel (api/index.ts)
├── client/
│   └── src/
│       ├── components/   # Composants UI (shadcn/ui + custom)
│       ├── pages/        # Pages React (wouter)
│       ├── hooks/        # Hooks React custom
│       ├── contexts/     # Contextes React
│       ├── lib/          # Utilitaires
│       └── dashboard/    # Réservé pour l'intégration future du dashboard
├── server/           # Logique serveur Express + tRPC routers
├── shared/           # Types et schémas partagés (Zod + tRPC)
├── drizzle/          # Migrations Drizzle
├── assets/           # Assets statiques
├── package.json
├── vercel.json
├── vite.config.ts
└── drizzle.config.ts
```

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

```
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_PUBLISHABLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
APP_URL=
EBOOK_PDF_URL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=
```

Voir `.env.example` pour la liste complète avec descriptions.

## Déploiement Vercel

1. Connecter le repository GitHub à Vercel
2. Vercel détecte automatiquement la configuration via `vercel.json`
3. Configurer les variables d'environnement dans le dashboard Vercel (utiliser les noms `@variable_name` référencés dans `vercel.json`)
4. Déployer — le build Vite génère `dist/public/`, l'API serverless est servie via `api/index.ts`

> **Note** : `installCommand` utilise `--no-frozen-lockfile` pour éviter les conflits de lockfile lors des mises à jour de dépendances.

## Dashboard (intégration future)

Le dossier `client/src/dashboard/` est **réservé** pour l'intégration future d'un template de dashboard.
Ne pas modifier ce dossier sans coordination préalable.

## Licence

Tous droits réservés © Jevalis
