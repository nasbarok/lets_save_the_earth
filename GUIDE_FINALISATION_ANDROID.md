# Guide de Finalisation Android Studio

## ✅ État Actuel

Le projet a été optimisé et est prêt pour la compilation Android :

### Améliorations Implémentées
- ✅ Système d'indice de santé avec inertie
- ✅ Multiplicateurs de vitesse optimisés (x2 = 4x, x3 = 8x plus rapide)
- ✅ Vitesse préservée après événements
- ✅ Système de crises sanitaires équilibré
- ✅ Configuration Capacitor corrigée
- ✅ Build de production généré
- ✅ Synchronisation Android effectuée

## 🔧 Prochaines Étapes

### 1. Ouvrir dans Android Studio

```bash
# Ouvrir le projet Android
npx cap open android
```

### 2. Configuration Requise

#### Gradle et SDK
- **Android SDK**: Version 34 (Android 14)
- **Gradle**: Version 8.0+
- **Java**: JDK 17+

#### Permissions dans AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### 3. Tests et Débogage

#### Émulateur Android
1. Créer un AVD (Android Virtual Device)
2. Lancer l'émulateur
3. Tester toutes les fonctionnalités

#### Device Physique
1. Activer le mode développeur
2. Activer le débogage USB
3. Connecter l'appareil

### 4. Optimisations Performance

#### Réduction Taille APK
- Les images sont déjà optimisées (2-3MB chacune)
- Considérer la compression WebP pour réduire davantage
- Utiliser ProGuard pour l'obfuscation

#### Configuration Build
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 5. Signature et Publication

#### Génération Keystore
```bash
keytool -genkey -v -keystore lets-save-earth-key.keystore -alias lets-save-earth -keyalg RSA -keysize 2048 -validity 10000
```

#### Configuration Signing
Dans `android/app/build.gradle` :
```gradle
android {
    signingConfigs {
        release {
            keyAlias 'lets-save-earth'
            keyPassword 'YOUR_KEY_PASSWORD'
            storeFile file('../lets-save-earth-key.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
        }
    }
}
```

### 6. Build de Production

```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (recommandé pour Play Store)
./gradlew bundleRelease
```

## 🚀 Déploiement Play Store

### Prérequis
1. Compte Google Play Developer (25$ one-time)
2. Icônes et captures d'écran préparées
3. Description et métadonnées traduites
4. Politique de confidentialité publiée

### Assets Requis
- **Icône**: 512x512px (déjà générée)
- **Feature Graphic**: 1024x500px
- **Screenshots**: Minimum 2 par orientation
- **Store Listing**: Titre, description courte/longue

### Configuration AdMob
Remplacer les IDs de test dans `capacitor.config.production.ts` :
```typescript
AdMob: {
  appId: 'ca-app-pub-VOTRE_ID_ADMOB~XXXXXXXXXX',
  bannerAdId: 'ca-app-pub-VOTRE_ID_ADMOB/XXXXXXXXXX',
  interstitialAdId: 'ca-app-pub-VOTRE_ID_ADMOB/XXXXXXXXXX',
  rewardedAdId: 'ca-app-pub-VOTRE_ID_ADMOB/XXXXXXXXXX',
}
```

## 🔍 Tests Finaux

### Checklist Fonctionnelle
- [ ] Démarrage de nouvelle partie
- [ ] Système de vitesse (x1, x2, x3)
- [ ] Événements et crises sanitaires
- [ ] Sauvegarde/chargement
- [ ] Publicités (banner et interstitiel)
- [ ] Achat premium (remove ads)
- [ ] Changement de langue
- [ ] Performance sur différents appareils

### Métriques Performance
- **Temps de démarrage**: < 3 secondes
- **Utilisation mémoire**: < 200MB
- **Taille APK**: < 100MB
- **FPS**: 60fps stable

## 📱 Optimisations Mobile

### Interface Utilisateur
- Boutons adaptés au touch (minimum 44px)
- Texte lisible sur petits écrans
- Navigation intuitive
- Feedback haptique

### Performance
- Lazy loading des images
- Optimisation des animations
- Gestion mémoire efficace
- Cache intelligent

## 🛠️ Dépannage Courant

### Erreurs Build
```bash
# Clean et rebuild
./gradlew clean
./gradlew assembleDebug
```

### Problèmes Capacitor
```bash
# Resync complet
npx cap sync android --force
```

### Erreurs Gradle
- Vérifier la version Java (JDK 17)
- Mettre à jour Android Gradle Plugin
- Nettoyer le cache Gradle

## 📊 Monitoring Post-Lancement

### Analytics Recommandés
- Google Analytics for Firebase
- Crashlytics pour les crashes
- AdMob pour les revenus publicitaires
- Play Console pour les métriques

### KPIs à Suivre
- Taux de rétention (D1, D7, D30)
- Revenus par utilisateur (ARPU)
- Taux de conversion premium
- Temps de session moyen

---

**Note**: Ce guide suppose que vous avez Android Studio installé et configuré. Pour une première installation, suivez le guide officiel Capacitor : https://capacitorjs.com/docs/android
