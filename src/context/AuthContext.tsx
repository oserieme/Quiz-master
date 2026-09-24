import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, firebaseConfig } from '../lib/firebase';
import { UserProfile } from '../types/user';
import { syncUserProfile, getUserProfile, PRIMARY_ADMIN_EMAIL } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isSigningIn: boolean;
  authError: string | null;
  authErrorCode: string | null;
  currentHost: string;
  projectId: string;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig.projectId || '';

  // Listen for Firebase authentication state changes
  useEffect(() => {
    // 1. Process any pending redirect result if signInWithRedirect was triggered
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const redirectUser = result.user;
          setUser(redirectUser);
          try {
            const profile = await syncUserProfile(redirectUser);
            setUserProfile(profile);
          } catch (profileErr) {
            console.warn('Profile sync after redirect fallback:', profileErr);
            setUserProfile({
              uid: redirectUser.uid,
              displayName: redirectUser.displayName || redirectUser.email?.split('@')[0] || 'Quiz Player',
              email: redirectUser.email || '',
              photoURL: redirectUser.photoURL || '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              totalQuizzesPlayed: 0,
              highScore: 0,
            });
          }
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
      });

    // 2. Continuous onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // First time profile creation in Firestore
            const synced = await syncUserProfile(currentUser);
            setUserProfile(synced);
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          // Fallback profile representation directly from authenticated user
          setUserProfile({
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Quiz Player',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            totalQuizzesPlayed: 0,
            highScore: 0,
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setAuthErrorCode(null);
  }, []);

  const parseAuthError = useCallback((err: unknown): { message: string; code: string | null } => {
    console.error('Firebase Auth sign-in error details:', err);

    let code: string | null = null;
    let message = 'Unable to complete Google Sign-In. Please try again.';

    if (err && typeof err === 'object' && 'code' in err) {
      code = (err as { code: string }).code;
      const rawMessage = (err as { message?: string }).message;

      switch (code) {
        case 'auth/unauthorized-domain':
          message = `Domain not authorized in Firebase: "${currentHost}". Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.`;
          break;
        case 'auth/popup-blocked':
          message = 'The Google Sign-In popup was blocked by your browser. Please allow popups for this site or use the redirect sign-in option.';
          break;
        case 'auth/popup-closed-by-user':
          message = 'The sign-in window was closed before completing authentication.';
          break;
        case 'auth/cancelled-popup-request':
          message = 'Another sign-in attempt was initiated. Please use the open window.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Google Sign-In is not enabled for this project. Please enable Google in Firebase Console → Authentication → Sign-in method.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error during sign-in. Please check your internet connection.';
          break;
        default:
          message = rawMessage || `Authentication error (${code}). Please try again.`;
          break;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }

    return { message, code };
  }, [currentHost]);

  // Primary: Popup Google Sign-In
  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsSigningIn(true);
    setAuthError(null);
    setAuthErrorCode(null);

    try {
      const provider = new GoogleAuthProvider();
      // Configure select_account prompt to guarantee account chooser
      provider.setCustomParameters({ prompt: 'select_account' });

      // Execute Firebase Authentication Google sign-in
      const result = await signInWithPopup(auth, provider);
      const authenticatedUser = result.user;

      setUser(authenticatedUser);

      // Attempt Firestore user profile sync
      try {
        const syncedProfile = await syncUserProfile(authenticatedUser);
        setUserProfile(syncedProfile);
      } catch (profileErr) {
        console.warn('Firestore profile sync error (user remains authenticated in Firebase Auth):', profileErr);
        setUserProfile({
          uid: authenticatedUser.uid,
          displayName: authenticatedUser.displayName || authenticatedUser.email?.split('@')[0] || 'Quiz Player',
          email: authenticatedUser.email || '',
          photoURL: authenticatedUser.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          totalQuizzesPlayed: 0,
          highScore: 0,
        });
      }

      setIsSigningIn(false);
      return true;
    } catch (err: unknown) {
      setIsSigningIn(false);
      const { message, code } = parseAuthError(err);
      setAuthError(message);
      setAuthErrorCode(code);
      return false;
    }
  }, [parseAuthError]);

  // Fallback: Redirect Google Sign-In (for browsers blocking popups)
  const signInWithGoogleRedirect = useCallback(async (): Promise<void> => {
    setIsSigningIn(true);
    setAuthError(null);
    setAuthErrorCode(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
    } catch (err: unknown) {
      setIsSigningIn(false);
      const { message, code } = parseAuthError(err);
      setAuthError(message);
      setAuthErrorCode(code);
    }
  }, [parseAuthError]);

  // Sign out
  const signOutUser = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setAuthError(null);
      setAuthErrorCode(null);
    } catch (err) {
      console.error('Error signing out of Firebase:', err);
    }
  }, []);

  // Refresh user profile from Firestore
  const refreshUserProfile = useCallback(async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (err) {
        console.warn('Error refreshing user profile:', err);
      }
    }
  }, []);

  // Secure admin check: user must be authenticated with the verified primary administrator email
  const isAdmin = Boolean(
    user &&
    user.email &&
    user.email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        isSigningIn,
        authError,
        authErrorCode,
        currentHost,
        projectId,
        signInWithGoogle,
        signInWithGoogleRedirect,
        signOutUser,
        clearAuthError,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
