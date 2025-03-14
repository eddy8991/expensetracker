// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {initializeAuth, getReactNativePersistence} from "firebase/auth";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB6DPrkMCuuU2om_jDGuovSuWb1ddCfxtk",
//   authDomain: "expensetracker-3ab7c.firebaseapp.com",
//   projectId: "expensetracker-3ab7c",
//   storageBucket: "expensetracker-3ab7c.firebasestorage.app",
//   messagingSenderId: "717595371091",
//   appId: "1:717595371091:web:7e3e73304dfdc069ae48a6",
//   measurementId: "G-DR7YSMFD17"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
// export const firestore = getFirestore(app);




import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import Constants from 'expo-constants';

// Get environment variables from Constants
const extra = Constants.expoConfig?.extra;

const firebaseConfig = {
  apiKey: extra?.firebaseApiKey,
  authDomain: extra?.firebaseAuthDomain,
  projectId: extra?.firebaseProjectId,
  storageBucket: extra?.firebaseStorageBucket,
  messagingSenderId: extra?.firebaseMessagingSenderId,
  appId: extra?.firebaseAppId,
  measurementId: extra?.firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
export const firestore = getFirestore(app);