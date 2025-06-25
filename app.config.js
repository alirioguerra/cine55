import 'dotenv/config';

export default {
  expo: {
    name: "cine55",
    slug: "cine55",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      bundleIdentifier: "com.acervoapps.cine55",
      supportsTablet: true
    },
    android: {
      package: "com.acervoapps.cine55",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.TMDB_API_KEY,
      eas: {
        projectId: "8b1a6bb0-aa1e-4748-b203-c974f4987968"
      }
    }
  }
}; 