# JOY - Configuration Locale pour Cursor

## Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Cursor IDE

## Installation

1. **Cloner le projet** depuis Replit ou télécharger les fichiers

2. **Installer les dépendances** :
```bash
npm install
```

3. **Structure du projet** :
```
joy-ecommerce/
├── client/           # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── main.tsx
│   └── index.html
├── server/           # Backend Express + TypeScript
│   ├── index.ts      # Point d'entrée du serveur
│   ├── routes.ts     # Routes API
│   ├── storage.ts    # Stockage en mémoire
│   └── vite.ts       # Configuration Vite
├── shared/           # Types partagés
│   └── schema.ts
└── package.json
```

## Lancement du serveur

```bash
npm run dev
```

Le site sera accessible sur : `http://localhost:5000`

## Configuration pour Cursor

1. **Ouvrir le projet** dans Cursor
2. **Extensions recommandées** :
   - TypeScript et JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets

3. **Configuration TypeScript** :
   - Le projet utilise des alias de chemin (`@/` pour `client/src/`)
   - Configuration dans `tsconfig.json` et `vite.config.ts`

## Fonctionnalités principales

### Panier
- **Ajout de produits** : Clic sur "Ajouter au panier" avec sélection taille/couleur
- **Interface panier** : Sidebar qui s'ouvre depuis l'icône panier en header
- **Gestion quantités** : Boutons +/- pour modifier les quantités
- **Persistance** : Utilise le sessionStorage du navigateur

### Navigation
- **Catégories** : Hommes, Femmes, Enfants, Accessoires
- **Produits** : 16 produits de luxe avec descriptions en français
- **Prix** : Formatés en dinars algériens (DA)

## Résolution des erreurs communes

### Erreur "index.ts introuvable"
- Vérifier que tous les fichiers sont présents
- Relancer `npm install`

### Erreur "index.html introuvable"
- Le fichier se trouve dans `client/index.html`
- Vérifier la configuration Vite

### Port déjà utilisé
```bash
# Tuer le processus sur le port 5000
npx kill-port 5000
# Puis relancer
npm run dev
```

### Erreurs TypeScript
- Vérifier les imports avec alias `@/`
- S'assurer que `tsconfig.json` est correctement configuré

## Architecture technique

- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **Backend** : Express.js + TypeScript
- **State Management** : React Context (panier) + TanStack Query (API)
- **Base de données** : Stockage en mémoire (MemStorage)
- **Build** : Vite pour le développement et la production

## Scripts disponibles

```bash
npm run dev        # Développement (frontend + backend)
npm run build      # Build production
npm run preview    # Aperçu de la version build
```

## Support

Si vous rencontrez des problèmes :
1. Vérifier que Node.js est installé (`node --version`)
2. Supprimer `node_modules` et relancer `npm install`
3. Vérifier que le port 5000 est libre
4. Consulter les logs de la console pour plus de détails