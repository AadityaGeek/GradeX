
'use client';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useFirebase } from '../client-provider';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile extends User {
  generationsRemaining?: number;
  totalGeneratedCount?: number;
  planId?: string;
}

export const useUser = () => {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setLoading(true);
        const userDocRef = doc(firestore, `users/${authUser.uid}`);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userProfileData = doc.data();
            setUser({
              ...authUser,
              generationsRemaining: userProfileData.generationsRemaining,
              totalGeneratedCount: userProfileData.totalGeneratedCount,
              planId: userProfileData.planId,
            });
          } else {
            // User exists in Auth but not in Firestore yet.
            // This can happen briefly during the first login.
            setUser(authUser);
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, loading };
};
