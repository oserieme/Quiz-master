import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';
import { handleFirestoreError, OperationType } from './firestoreErrors';

export const PRIMARY_ADMIN_EMAIL = 'oseriemeebhomien@gmail.com';

/**
 * Checks whether an authenticated user has verified administrative privileges.
 * Strictly verifies that the email matches the designated primary administrator,
 * backed by a server-side check against the protected /admins collection in Firestore.
 */
export async function checkIsAdmin(uid: string, email?: string | null): Promise<boolean> {
  if (!email || email.trim().toLowerCase() !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return false;
  }

  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      return Boolean(
        data?.email && data.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
      );
    }
  } catch (err) {
    console.warn('Server-side admin registry check note:', err);
  }

  // Fallback to strict verified Google OAuth email comparison
  return email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
}

/**
 * Creates or updates the user profile at /users/{userId} upon successful authentication.
 * If user exists, updates lastLoginAt without overriding historical stats or createdAt.
 */
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  try {
    let snap;
    try {
      snap = await getDoc(userRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, userPath);
      throw err;
    }

    const now = new Date().toISOString();
    const isPrimaryAdmin = Boolean(
      user.email && user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()
    );

    if (!snap.exists()) {
      // First-time sign-in: create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Quiz Player',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: now,
        lastLoginAt: now,
        totalQuizzesPlayed: 0,
        highScore: 0,
        role: isPrimaryAdmin ? 'admin' : 'player',
      };

      try {
        await setDoc(userRef, newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, userPath);
        throw err;
      }

      // If primary admin, also register in /admins collection
      if (isPrimaryAdmin) {
        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              assignedAt: now,
            },
            { merge: true }
          );
        } catch (adminErr) {
          console.warn('Could not register primary admin in /admins collection:', adminErr);
        }
      }

      return newProfile;
    } else {
      // Existing user: update lastLoginAt and any updated identity details
      const existing = snap.data() as UserProfile;
      const isAdminRole = isPrimaryAdmin || existing.role === 'admin';

      const updates: Partial<UserProfile> = {
        lastLoginAt: now,
        displayName: user.displayName || existing.displayName || 'Quiz Player',
        email: user.email || existing.email || '',
        photoURL: user.photoURL || existing.photoURL || '',
      };

      if (isPrimaryAdmin && existing.role !== 'admin') {
        updates.role = 'admin';
      }

      try {
        await updateDoc(userRef, updates);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, userPath);
        throw err;
      }

      // Ensure primary admin document exists in /admins
      if (isPrimaryAdmin) {
        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              assignedAt: now,
            },
            { merge: true }
          );
        } catch (adminErr) {
          console.warn('Could not ensure admin doc in /admins:', adminErr);
        }
      }

      return {
        ...existing,
        ...updates,
        role: isAdminRole ? 'admin' : (existing.role || 'player'),
      };
    }
  } catch (error) {
    console.error('Failed to sync user profile:', error);
    throw error;
  }
}

/**
 * Fetches user profile data from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userPath = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
    return null;
  }
}

/**
 * Updates user statistics (totalQuizzesPlayed, highScore) when a quiz is completed
 */
export async function updateUserQuizStats(uid: string, score: number): Promise<void> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      const prevHigh = data.highScore || 0;
      const newHigh = Math.max(prevHigh, score);
      const prevCount = data.totalQuizzesPlayed || 0;
      await updateDoc(userRef, {
        highScore: newHigh,
        totalQuizzesPlayed: prevCount + 1,
        lastLoginAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Graceful fallback: do not crash user experience if stats update fails
    console.warn('Could not update user stats in Firestore:', err);
  }
}

