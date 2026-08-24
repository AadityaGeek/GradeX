
'use client';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import React, { createContext, useContext } from 'react';
import firebaseApp from '@/firebase/config';
import { Firestore, getFirestore } from 'firebase/firestore';

interface IFirebaseContext {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<IFirebaseContext | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return (
    <FirebaseContext.Provider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
