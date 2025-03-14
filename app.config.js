module.exports = () => {
  return {
    expo: {
      name: "centsible",
      slug: "expensetracker",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/playstore.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
   
      extra: {
        // Firebase config
        firebaseApiKey: process.env.FIREBASE_API_KEY || "AIzaSyB6DPrkMCuuU2om_jDGuovSuWb1ddCfxtk",
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "expensetracker-3ab7c.firebaseapp.com",
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "expensetracker-3ab7c",
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "expensetracker-3ab7c.firebasestorage.app",
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "717595371091",
        firebaseAppId: process.env.FIREBASE_APP_ID || "1:717595371091:web:7e3e73304dfdc069ae48a6",
        firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-DR7YSMFD17",
        
        // Cloudinary config
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "dcacejyme",
        cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || "images",
        
        // Copy any existing "extra" configuration from app.json
        router: {
          origin: false
        },
        eas: {
          projectId: "7412a682-3dd7-41d4-8264-2944c9ca27d9"
        }
      },
    }
  };
};