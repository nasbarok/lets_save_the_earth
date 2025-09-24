import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.letsavetheearth.game',
  appName: "Let's Save the Earth",
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1e40af",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1e40af",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    App: {
      launchUrl: "com.letsavetheearth.game://",
    },
    AdMob: {
      // Configuration AdMob pour production
      appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // À remplacer par votre ID AdMob
      testingDevices: [], // Vide en production
      initializeForTesting: false, // False en production
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      maxAdContentRating: "G", // Contenu familial
      bannerAdId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      interstitialAdId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
      rewardedAdId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    InAppPurchases: {
      // Configuration Google Play Billing
      products: [
        {
          id: 'premium_upgrade',
          type: 'inapp'
        }
      ]
    },
    Haptics: {
      // Vibrations pour feedback utilisateur
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#1e40af",
      sound: "beep.wav",
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'lets-save-earth-key.keystore',
      keystoreAlias: 'lets-save-earth',
      releaseType: 'APK', // ou 'AAB' pour Android App Bundle
      signingType: 'apksigner'
    }
  }
};

export default config;
