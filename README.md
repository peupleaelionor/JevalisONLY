# Jevalis — Simulation Fiscale Immobilière Européenne

<div align="center">

**Simulez l'impact financier de votre achat ou vente immobilière en Europe.**  
Rapports PDF professionnels couvrant la France, la Suisse, la Belgique, le Luxembourg, les Pays-Bas et l'Allemagne.

[![CI](https://github.com/peupleaelionor/JevalisONLY/actions/workflows/ci.yml/badge.svg)](https://github.com/peupleaelionor/JevalisONLY/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## ✨ Présentation

**Jevalis** est une plateforme SaaS de simulation fiscale et financière pour l'immobilier européen. En quelques clics, obtenez une estimation précise des coûts, impôts et rentabilité liés à un achat ou une vente immobilière dans **6 pays européens**.

### Fonctionnalités clés

- 🏘️ **Simulation multi-pays** — France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne
- 📊 **Rapport PDF professionnel** — généré à la demande et téléchargeable immédiatement
- 💳 **Paiement sécurisé** — intégration Stripe Checkout avec webhooks
- 📧 **Livraison par email** — rapport envoyé automatiquement via Resend
- 👤 **Espace client** — historique des simulations et accès aux rapports passés
- 🛡️ **Back-office admin** — tableau de bord pour gérer les utilisateurs et les paiements
- 📖 **Guide fiscal PDF** — aperçu d'un e-book complet sur la fiscalité immobilière européenne

---

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
| Tests | Vitest |

---

## 📁 Structure du projet

```
.
├── client/                  # Application React (frontend)
│   ├── public/images/       # Assets statiques
│   └── src/
│       ├── pages/           # Pages de l'application
│       ├── components/      # Composants réutilisables
│       ├── hooks/           # Hooks React personnalisés
│       └── lib/             # Utilitaires et configuration tRPC
├── server/                  # Serveur Express (backend)
│   ├── _core/               # Bootstrap Express + tRPC
│   ├── authRouter.ts        # Authentification JWT
│   ├── routers.ts           # Routes tRPC
│   ├── financialEngine.ts   # Moteur de calcul fiscal
│   ├── pdfGenerator.ts      # Génération de rapports PDF
│   ├── emailService.ts      # Envoi d'emails (Resend)
│   ├── stripeRouter.ts      # Paiements Stripe
│   └── storage.ts           # Stockage Supabase
├── shared/                  # Types et constantes partagés
├── drizzle/                 # Schéma et migrations base de données
├── api/                     # Point d'entrée Vercel Functions
└── vercel.json              # Configuration déploiement Vercel
```

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Landing page + formulaire de simulation |
| `/blog` | Blog & FAQ SEO |
| `/apercu-ebook` | Aperçu gratuit du guide fiscal PDF |
| `/login` | Connexion / inscription clients |
| `/forgot-password` | Mot de passe oublié |
| `/reset-password` | Réinitialisation du mot de passe |
| `/account` | Espace personnel (simulations + rapports) |
| `/success` | Confirmation de paiement |
| `/cgv` | Conditions générales de vente |
| `/mentions-legales` | Mentions légales |
| `/confidentialite` | Politique de confidentialité |
| `/admin/login` | Connexion back-office admin |
| `/admin` | Dashboard admin |

---

## 🗄️ Base de données

3 tables Supabase (MySQL) :

| Table | Description |
|---|---|
| `client_users` | Comptes clients (email, hash mot de passe, JWT) |
| `simulations` | Données et résultats de simulation par pays |
| `payments` | Transactions Stripe et statuts de paiement |

```bash
pnpm run db:push   # Générer et appliquer les migrations
```

---

## 🚀 Déploiement Vercel

Le projet est configuré pour **déployer automatiquement** sur Vercel à chaque push sur `main`.

### Architecture Vercel

```
Vercel CDN          →  dist/public/          (frontend Vite compilé)
Vercel Function     →  api/index.ts          (Express + tRPC + Stripe)
  /api/trpc/*       →  tRPC router
  /api/stripe/webhook → Stripe webhook handler
```

### Première mise en production

1. Sur [vercel.com](https://vercel.com) → **Import Git Repository**
2. Framework : **Vite** (auto-détecté)
3. Aller dans **Settings > Environment Variables** et ajouter toutes les variables (voir ci-dessous)
4. Cliquer **Deploy**

### Webhook Stripe (production)

Après le déploiement, configurer sur [dashboard.stripe.com](https://dashboard.stripe.com) :
- **URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
- **Événements** : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copier le **Signing Secret** (`whsec_...`) dans Vercel > Settings > Env Vars > `STRIPE_WEBHOOK_SECRET`

---

## 💻 Développement local

```bash
# 1. Cloner le dépôt
git clone https://github.com/peupleaelionor/JevalisONLY.git
cd JevalisONLY

# 2. Installer les dépendances
pnpm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# → Remplir les valeurs dans .env

# 4. Appliquer le schéma sur la base de données
pnpm run db:push

# 5. Démarrer le serveur de développement
pnpm run dev
# → http://localhost:3000
```

---

## 🛠️ Scripts disponibles

| Script | Description |
|---|---|
| `pnpm run dev` | Serveur de développement (port 3000, Vite HMR) |
| `pnpm run build` | Build frontend + backend (production locale) |
| `pnpm run build:client` | Build frontend uniquement (utilisé par Vercel) |
| `pnpm run start` | Démarrer en mode production locale |
| `pnpm run check` | Vérification TypeScript |
| `pnpm run test` | Lancer les tests (Vitest) |
| `pnpm run db:push` | Générer et appliquer les migrations Drizzle |
| `pnpm run format` | Formater le code avec Prettier |

---

## 🔑 Variables d'environnement

Copier `.env.example` en `.env` et remplir toutes les valeurs :

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL Transaction Pooler Supabase (port 6543) |
| `JWT_SECRET` | Chaîne aléatoire 64 chars (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe `whsec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe `pk_live_...` |
| `RESEND_API_KEY` | Clé API Resend `re_...` |
| `RESEND_FROM_EMAIL` | Email expéditeur vérifié (ex. `rapports@jevalis.com`) |
| `RESEND_FROM_NAME` | Nom expéditeur (ex. `Jevalis`) |
| `SUPABASE_URL` | URL du projet Supabase (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase (`eyJ...`) |
| `SUPABASE_BUCKET` | Nom du bucket de stockage (ex. `jevalis-reports`) |
| `ADMIN_EMAIL` | Email du compte administrateur |
| `ADMIN_PASSWORD` | Mot de passe sécurisé du compte administrateur |
| `APP_URL` | URL de l'application en production |

---

## ⚖️ Mentions légales

Jevalis fournit des simulations à titre **indicatif**. Les résultats ne constituent pas un conseil fiscal ou juridique. Pour toute décision d'investissement, consultez un professionnel qualifié.

---

<div align="center">

© 2026 **Jevalis**. Tous droits réservés.

</div>
