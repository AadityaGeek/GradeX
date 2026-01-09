
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/firebase/client-provider";
import { useToast } from "@/hooks/use-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Home, Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

export function AuthRedirectDialog() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

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
          await setDoc(
            userDocRef,
            {
              displayName: loggedInUser.displayName,
              photoURL: loggedInUser.photoURL,
              lastLogin: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (dbError) {
        console.error("Error writing to Firestore: ", dbError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Could not save your profile. Please try again.",
        });
      }

      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      // The generate page will re-render now that the user is logged in.
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not sign you in with Google. Please try again.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authentication Required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to be logged in to create a question paper. Please log in
            or create an account to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:gap-2">
          <Button onClick={handleLogin} disabled={isSigningIn}>
            {isSigningIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src="/images/assets/google-logo.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
            )}
            {isSigningIn ? "Signing in..." : "Sign in with Google"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} disabled={isSigningIn}>
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
