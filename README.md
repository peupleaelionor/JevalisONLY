# Jevalis — Simulation Fiscale Immobilière Européenne

> Simulez l'impact financier de votre achat ou vente immobilière en France, Suisse, Belgique, Luxembourg, Pays-Bas et Allemagne. Rapport PDF professionnel.

[![CI](https://github.com/peupleaelionor/JevalisONLY/actions/workflows/ci.yml/badge.svg)](https://github.com/peupleaelionor/JevalisONLY/actions/workflows/ci.yml)

## 🏗️ Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, Vite, TailwindCSS v4, tRPC client |
| Backend | Express.js, tRPC server, Drizzle ORM |
| Base de données | Supabase (MySQL) via `mysql2` |
| Paiements | Stripe Checkout + Webhooks |
| Emails | Resend |
| Stockage PDF | Supabase Storage |
| Déploiement | **Vercel** (région `cdg1` Paris) |

## 🚀 Déploiement Vercel (auto)

Le projet est configuré pour **déployer automatiquement** sur Vercel à chaque push sur `main`.

### Première fois

1. Sur [vercel.com](https://vercel.com) → **Import Git Repository**
2. Framework : **Vite** (auto-détecté)
3. Aller dans **Settings > Environment Variables** et ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL Transaction Pooler Supabase (port 6543) |
| `JWT_SECRET` | Chaîne aléatoire 64 chars (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `rapports@jevalis.com` |
| `RESEND_FROM_NAME` | `Jevalis` |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `SUPABASE_BUCKET` | `jevalis-reports` |
| `ADMIN_EMAIL` | `admin@jevalis.com` |
| `ADMIN_PASSWORD` | Mot de passe sécurisé |
| `APP_URL` | `https://votre-domaine.vercel.app` |

4. Cliquer **Deploy**

### Architecture Vercel

```
Vercel CDN          →  dist/public/      (frontend Vite)
Vercel Function     →  api/index.ts      (Express + tRPC + Stripe)
  /api/trpc/*       →  tRPC router
  /api/stripe/webhook → Stripe webhook
```

### Webhook Stripe (production)

Après déploiement, configurer sur [dashboard.stripe.com](https://dashboard.stripe.com) :
- **URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
- **Événements** : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copier le **Signing Secret** (`whsec_...`) dans Vercel > Settings > Env Vars > `STRIPE_WEBHOOK_SECRET`

## 💻 Développement local

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# → Remplir les valeurs dans .env

# 3. Pousser le schéma sur Supabase
pnpm run db:push

# 4. Démarrer le serveur de développement
pnpm run dev
# → http://localhost:3000
```

## 🛠️ Scripts disponibles

| Script | Description |
|---|---|
| `pnpm run dev` | Serveur de développement (port 3000, Vite HMR) |
| `pnpm run build` | Build frontend + backend (local production) |
| `pnpm run build:client` | Build frontend uniquement (utilisé par Vercel) |
| `pnpm run start` | Démarrer en mode production local |
| `pnpm run check` | Vérification TypeScript |
| `pnpm run test` | Lancer les tests (Vitest) |
| `pnpm run db:push` | Générer et appliquer les migrations Drizzle |
| `pnpm run format` | Formater le code (Prettier) |

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Landing page + simulation |
| `/blog` | Blog & FAQ SEO |
| `/apercu-ebook` | Aperçu du guide fiscal PDF |
| `/login` | Connexion / inscription clients |
| `/forgot-password` | Mot de passe oublié |
| `/reset-password` | Réinitialisation du mot de passe |
| `/account` | Espace personnel (simulations + rapports) |
| `/success` | Confirmation paiement |
| `/cgv` | Conditions générales de vente |
| `/mentions-legales` | Mentions légales |
| `/confidentialite` | Politique de confidentialité |
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard admin |

## 🗄️ Base de données

3 tables Supabase (MySQL) :
- `client_users` — Comptes clients
- `simulations` — Données et résultats de simulation
- `payments` — Transactions Stripe

```bash
pnpm run db:push   # Créer / migrer les tables
```

## ⚖️ Légal

Jevalis fournit des simulations **indicatives**. Les résultats ne constituent pas un conseil fiscal ou juridique.

© 2026 Jevalis. Tous droits réservés.
