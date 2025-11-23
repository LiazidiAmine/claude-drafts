# Optimiseur de Congés

Application web moderne pour optimiser vos congés en France en maximisant vos jours de repos tout en minimisant le nombre de jours de congés à poser.

## Fonctionnalités

- **Optimisation intelligente** : Trouve les meilleures périodes de congés en tenant compte des weekends et jours fériés français
- **Top 5 suggestions** : Affiche les 5 meilleures périodes avec leur ratio d'efficacité
- **Dates bloquées** : Possibilité de bloquer certaines dates selon vos contraintes personnelles
- **Interface intuitive** : Design moderne et épuré avec Tailwind CSS
- **Responsive** : S'adapte parfaitement à tous les écrans (mobile, tablette, desktop)
- **Compatible Capacitor** : Prêt pour être wrappé dans une application mobile native

## Technologies utilisées

- **Next.js 14** : Framework React avec App Router et export statique
- **TypeScript** : Pour un code robuste et maintenable
- **Tailwind CSS v4** : Framework CSS moderne et performant
- **Lucide React** : Icônes modernes et élégantes
- **date-fns** : Manipulation des dates

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm start
```

## Utilisation

1. **Définir la période** : Sélectionnez une plage de dates (ex: avril à juin)
2. **Indiquer vos jours disponibles** : Entrez le nombre de jours de congés dont vous disposez
3. **Bloquer des dates (optionnel)** : Ajoutez les dates où vous ne pouvez pas prendre de congés
4. **Optimiser** : Cliquez sur le bouton "Optimiser mes congés"
5. **Consulter les résultats** : Explorez les 5 meilleures suggestions avec leurs métriques

## Métriques expliquées

- **Jours à poser** : Nombre de jours de congés à poser en entreprise
- **Jours off totaux** : Nombre total de jours de repos (incluant weekends et jours fériés)
- **Efficacité** : Ratio entre jours off totaux et jours à poser
- **Bonus** : Pourcentage de jours off supplémentaires obtenus

## Jours fériés français

L'application prend en compte tous les jours fériés français :

- Jours fixes : Nouvel An, Fête du Travail, Victoire 1945, Fête Nationale, Assomption, Toussaint, Armistice 1918, Noël
- Jours mobiles : Lundi de Pâques, Ascension, Lundi de Pentecôte

## Wrap avec Capacitor

Cette application est configurée pour être facilement wrappée avec Capacitor :

```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli

# Initialiser Capacitor
npx cap init

# Ajouter les plateformes
npx cap add ios
npx cap add android

# Builder et synchroniser
npm run build
npx cap sync

# Ouvrir dans l'IDE natif
npx cap open ios
npx cap open android
```

## Structure du projet

```
/app                    # Pages Next.js (App Router)
  /page.tsx            # Page d'accueil
  /layout.tsx          # Layout principal
  /globals.css         # Styles globaux

/components            # Composants React
  /ui                  # Composants UI réutilisables
  /vacation-optimizer.tsx  # Composant principal

/lib                   # Utilitaires et logique métier
  /holidays.ts         # Calcul des jours fériés
  /optimizer.ts        # Algorithme d'optimisation
  /utils.ts            # Fonctions utilitaires

/types                 # Définitions TypeScript
  /index.ts            # Types de l'application

/public                # Assets statiques
  /manifest.json       # Manifest PWA
```

## Algorithme d'optimisation

L'algorithme analyse toutes les périodes possibles dans la plage définie et calcule pour chacune :

1. Le nombre de jours ouvrables (jours à poser)
2. Le nombre total de jours off (incluant weekends et fériés)
3. Le ratio d'efficacité

Les suggestions sont triées par efficacité décroissante et filtrées pour éviter les doublons.

## Développement

### Prérequis

- Node.js 18+
- npm ou yarn

### Commandes utiles

```bash
# Lancer les tests
npm test

# Linter
npm run lint

# Formater le code
npm run format
```

## Licence

Ce projet est open source et disponible sous licence MIT.

## Auteur

Créé avec pour optimiser les congés des travailleurs français.
