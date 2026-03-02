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
├── README.md
├── index.html          # Page principale du simulateur
├── .gitignore
└── assets/
    ├── css/            # Feuilles de style (futures)
    ├── js/             # Scripts (futures)
    └── images/         # Images et ressources visuelles
```

## Lancer le projet

### En local

Ouvrez simplement `index.html` dans votre navigateur :

```bash
# Avec Python
python3 -m http.server 8000

# Ou avec Node.js (npx)
npx serve .
```

Puis accédez à [http://localhost:8000](http://localhost:8000).

### Déploiement sur Vercel

Le projet est prêt pour un déploiement statique sur [Vercel](https://vercel.com) :

1. Connectez votre repository GitHub à Vercel
2. Vercel détecte automatiquement le projet comme un site statique
3. Le fichier `index.html` à la racine est servi directement

Aucune configuration supplémentaire n'est nécessaire.

## Licence

Tous droits réservés © Jevalis
