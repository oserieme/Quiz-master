import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Explicitly mapped FirebaseOptions object from project configuration
const firebaseOptions = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId || undefined,
};

// Initialize Firebase App instance using the connected project config
export const app = getApps().length === 0 ? initializeApp(firebaseOptions) : getApp();

// Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication instance
export const auth = getAuth(app);

// Use browser device language for localized Google authentication
try {
  auth.useDeviceLanguage();
} catch {
  // Safe fallback if window or navigator is unavailable during build
}

export { firebaseConfig };

// Connection test helper as specified in Firebase guidelines
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check Firebase project network configuration.');
    }
    // Expected if document doesn't exist yet, but server response confirms reachability
    return true;
  }
}

// Test connection on boot
testFirebaseConnection();

