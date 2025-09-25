# Documentation des Interactions Gemini AI - Let's Save the Earth

## 🤖 Vue d'Ensemble

Votre application utilise **Google Gemini AI** de manière extensive pour générer du contenu dynamique et créer une expérience de jeu immersive. Voici l'analyse complète de toutes les interactions.

## 📊 Statistiques d'Utilisation

- **6 fonctions Gemini** actives
- **5 points d'intégration** dans le jeu
- **4 schémas JSON** structurés
- **Modèle utilisé** : `gemini-2.5-flash`
- **Timeout configuré** : 20 secondes

## 🔧 Configuration Technique

### Clé API
```typescript
const geminiApiKey = 
    import.meta.env.VITE_GEMINI_API_KEY ||
    process.env?.GEMINI_API_KEY;
```

### Initialisation
```typescript
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
```

## 📋 Interactions Détaillées

### 1. **Données Temps Réel des Pays** 🌍
**Fonction :** `fetchRealTimeData()`
**Déclenchement :** Initialisation du jeu avec données réalistes
**Fréquence :** Une fois par partie (au démarrage)

#### Processus :
1. **Boucle sur tous les pays/continents** (6 régions)
2. **Génère des données réalistes** pour chaque région
3. **Timeout de 20 secondes** par région
4. **Fallback automatique** si échec

#### Données générées :
- **Pollution** : CO2, Plastique, Déforestation (0-100)
- **Population** : Nombre total et taux de croissance
- **Économie** : PIB en trillions USD
- **Santé** : Indice de santé (0-100)
- **Énergie** : Consommation et production (TWh)

#### Prompt type :
```
"Based on the latest available real-world data, provide realistic simulation data for [Region]. 
GDP in Trillions USD, pollution indices 0-100, energy in TWh..."
```

### 2. **Narration d'Introduction** 📖
**Fonction :** `generateIntroNarration()`
**Déclenchement :** Après initialisation des données
**Fréquence :** Une fois par partie

#### Processus :
1. **Analyse du contexte mondial** (conflits, pollution)
2. **Génère une narration immersive**
3. **Ton sérieux et dramatique**
4. **Évite les noms spécifiques** de pays

#### Contenu généré :
- **Description** : 1-2 phrases sur la situation mondiale
- **Style** : Narrateur de simulation géopolitique
- **Thèmes** : Tensions, ressources, environnement

### 3. **Événements Aléatoires** 🎲
**Fonction :** `generateRandomEvent()`
**Déclenchement :** Toutes les 15-25 ticks de jeu
**Fréquence :** Environ toutes les 30-50 secondes

#### Processus :
1. **Évalue le niveau de menace nucléaire**
2. **Génère un événement contextuel**
3. **Crée 2-4 choix stratégiques**
4. **Inclut toujours une option neutre**

#### Types d'événements :
- **Catastrophes** : Naturelles, climatiques
- **Conflits** : Guerres, tensions
- **Percées** : Technologiques, scientifiques
- **Politique** : Changements gouvernementaux
- **Social** : Mouvements, manifestations
- **Économique** : Crises, marchés

#### Structure des choix :
- **2-3 choix actifs** avec coûts et effets
- **1 choix neutre** (coût 0, aucun effet)
- **Effets sur** : Pollution, économie, population, santé

### 4. **Conflits Géopolitiques** ⚔️
**Fonction :** `generateConflictEvent()`
**Déclenchement :** Quand instabilité > seuil critique
**Fréquence :** Basée sur les conditions de jeu

#### Processus :
1. **Sélectionne 2 pays instables**
2. **Analyse le contexte géopolitique**
3. **Génère un conflit réaliste**
4. **Lie aux tensions environnementales**

#### Données générées :
- **Titre** : Nom court du conflit
- **Nom complet** : Ex. "The Arctic Resource Skirmish"
- **Description** : Causes et contexte
- **Intensité** : Niveau 1-5

### 5. **Espèces Éteintes** 🦕
**Fonction :** `generateExtinctSpecies()`
**Déclenchement :** Vérification périodique d'extinction
**Fréquence :** Toutes les 120 ticks (environ 4 minutes)

#### Processus :
1. **Analyse les causes dominantes** (pollution, déforestation)
2. **Génère une espèce réaliste**
3. **Lie l'extinction à la cause principale**

#### Contenu généré :
- **Nom d'espèce** : Réaliste ou plausible
- **Contexte** : Lié à la cause environnementale

### 6. **Événements Nucléaires** ☢️
**Fonction :** `generateNuclearEvent()`
**Déclenchement :** Menace nucléaire > 80 + probabilité
**Fréquence :** Rare, basée sur l'escalade

#### Processus :
1. **Évalue la menace nucléaire globale**
2. **Génère un échange nucléaire**
3. **Sélectionne les cibles** (1-3 continents)
4. **Calcule les impacts** (population, santé)

#### Données générées :
- **Description** : Récit dramatique de l'échange
- **Cibles** : IDs des continents touchés
- **Frappes** : Nombre total (1-5)

## 🔄 Flux de Données

### Initialisation du Jeu
```
1. fetchRealTimeData() → Données réalistes pour 6 régions
2. generateIntroNarration() → Narration contextuelle
3. Affichage modal d'introduction
```

### Boucle de Jeu
```
Tick de jeu (toutes les 2s / vitesse)
├── Vérification événements (15-25 ticks)
│   └── generateRandomEvent() → Événement avec choix
├── Vérification conflits (conditions d'instabilité)
│   └── generateConflictEvent() → Nouveau conflit
├── Vérification extinctions (120 ticks)
│   └── generateExtinctSpecies() → Espèce éteinte
└── Vérification nucléaire (menace > 80)
    └── generateNuclearEvent() → Échange nucléaire
```

## 📈 Impact sur le Gameplay

### Données Temps Réel
- **Réalisme** : Données basées sur la réalité actuelle
- **Immersion** : Chaque partie commence différemment
- **Éducation** : Sensibilisation aux enjeux réels

### Événements Dynamiques
- **Imprévisibilité** : Chaque partie est unique
- **Stratégie** : Choix avec conséquences réelles
- **Progression** : Événements s'adaptent au contexte

### Narration Contextuelle
- **Immersion** : Histoire générée dynamiquement
- **Cohérence** : Événements liés au contexte
- **Engagement** : Expérience personnalisée

## ⚡ Performance et Optimisation

### Timeouts Configurés
- **fetchRealTimeData** : 20s par région
- **Autres fonctions** : Timeout par défaut Gemini

### Gestion d'Erreurs
- **Fallback automatique** sur données par défaut
- **Logs d'erreur** dans la console
- **Continuité du jeu** garantie

### Optimisations Possibles
- **Cache des réponses** pour éviter les appels répétés
- **Batch processing** pour les données initiales
- **Retry logic** avec backoff exponentiel

## 🔒 Sécurité et Coûts

### Clé API
- **Variable d'environnement** sécurisée
- **Validation** au démarrage
- **Pas d'exposition** côté client

### Contrôle des Coûts
- **Timeouts** pour éviter les appels longs
- **Schémas JSON** pour réponses structurées
- **Fallbacks** pour réduire les échecs

Cette architecture Gemini AI crée une expérience de jeu **dynamique, éducative et immersive** tout en maintenant la **performance** et la **fiabilité** ! 🎮✨
