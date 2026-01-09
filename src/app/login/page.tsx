
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase } from '@/firebase/client-provider';
import { useUser } from '@/firebase/auth/use-user';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const { auth, firestore } = useFirebase();
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      // Create or update user profile in Firestore
      try {
        const userDocRef = doc(firestore, "users", loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // New user
          await setDoc(userDocRef, {
              uid: loggedInUser.uid,
              displayName: loggedInUser.displayName,
              email: loggedInUser.email,
              photoURL: loggedInUser.photoURL,
              generationsRemaining: 5,
              createdAt: serverTimestamp(),
          });
        } else {
          // Returning user, just update their profile info in case it changed
          await setDoc(userDocRef, {
              displayName: loggedInUser.displayName,
              photoURL: loggedInUser.photoURL,
              lastLogin: serverTimestamp(),
          }, { merge: true });
        }
      } catch (dbError) {
        console.error('Error writing to Firestore: ', dbError);
         toast({
          variant: 'destructive',
          title: 'Database Error',
          description: 'Could not save your profile. Please try again.',
        });
      }

      toast({
        title: 'Success!',
        description: 'You have successfully logged in.',
      });
      // Redirect is handled by the useEffect hook
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign you in with Google. Please try again.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };
  
  if (loading || user) {
      return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"></div>
      <Card className="w-full max-w-sm text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to GradeX.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} disabled={isSigningIn} className="w-full">
            {isSigningIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image src="/images/assets/google-logo.svg" alt="Google" width={20} height={20} className="mr-2"/>
            )}
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
