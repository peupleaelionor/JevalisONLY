# Jevalis — Simulation Fiscale Immobilière Européenne

> Outil de simulation d'impact financier immobilier pour 6 pays européens : France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne.

## 🏗️ Stack technique

- **Frontend** : React 19, Vite, TailwindCSS v4, tRPC client
- **Backend** : Express.js, tRPC server, Drizzle ORM
- **Base de données** : Supabase (MySQL compatible via mysql2)
- **Paiements** : Stripe Checkout + Webhooks
- **Emails** : Resend
- **Stockage PDF** : Supabase Storage
- **Déploiement recommandé** : **Vercel** (région `cdg1` Paris)

## 🔑 Variables d'environnement

Copier `.env.example` en `.env` et remplir :

```bash
cp .env.example .env
```

Variables requises :
| Variable | Description |
|---|---|
| `DATABASE_URL` | URL Supabase (Transaction pooler) |
| `JWT_SECRET` | Secret aléatoire 64 chars |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe `whsec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe `pk_live_...` |
| `RESEND_API_KEY` | Clé API Resend `re_...` |
| `RESEND_FROM_EMAIL` | Email expéditeur vérifié |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `SUPABASE_BUCKET` | Nom du bucket de stockage |
| `ADMIN_EMAIL` | Email admin backoffice |
| `ADMIN_PASSWORD` | Mot de passe admin |

## 🚀 Déploiement sur Vercel (recommandé)

1. **Push sur GitHub** (voir section Git ci-dessous)
2. Sur [vercel.com](https://vercel.com) : **Import Git Repository**
3. Framework : **Vite** (auto-détecté)
4. Build command : `pnpm run build`
5. Output directory : `dist/public`
6. **Environnement** : Ajouter toutes les variables ci-dessus dans Settings > Environment Variables
7. Ajouter les secrets Vercel :
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   # ... etc
   ```
8. Déployer → URL automatique en `*.vercel.app`

### Webhook Stripe
Après déploiement, configurer le webhook Stripe :
- URL : `https://votre-domaine.vercel.app/api/stripe/webhook`
- Événements : `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📦 Git

```bash
git init
git add .
git commit -m "feat: initial jevalis setup"
git branch -M main
git remote add origin https://github.com/VOTRE_USER/jevalis.git
git push -u origin main
```

## 💻 Développement local

```bash
pnpm install
cp .env.example .env  # remplir les valeurs
pnpm run db:push      # créer les tables
pnpm run dev          # démarrer sur localhost:3000
```

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Landing page principale |
| `/blog` | Blog & FAQ SEO |
| `/apercu-ebook` | Aperçu gratuit du guide fiscal |
| `/login` | Connexion / inscription clients |
| `/account` | Espace personnel (simulations + rapports) |
| `/success` | Page de confirmation paiement |
| `/cgv` | Conditions générales de vente |
| `/mentions-legales` | Mentions légales |
| `/confidentialite` | Politique de confidentialité |
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard admin |

## ⚖️ Légal

Jevalis fournit des simulations indicatives. Les résultats ne constituent pas un conseil fiscal ou juridique.

© 2026 Jevalis. Tous droits réservés.
