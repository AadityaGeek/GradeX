
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Star, Zap, Crown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PLANS } from '@/lib/data';

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>You must be logged in to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild>
                        <Link href="/login">
                           Go to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  const currentPlan = PLANS.find(p => p.id === (user.planId || 'free'));

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <Card className="shadow-xl">
            <CardHeader className="text-center">
                <div className="relative mx-auto mb-4 h-24 w-24">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                        <AvatarFallback className="text-3xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-3xl">{user.displayName}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center space-y-2">
                        <Crown className="h-8 w-8 text-yellow-500" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Plan</span>
                        <span className="text-2xl font-bold text-primary">{currentPlan?.name || 'Free'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center space-y-2">
                        <Star className="h-8 w-8 text-primary" />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Credits</span>
                        <span className="text-2xl font-bold text-primary">
                            {user.planId === 'premium' ? 'Unlimited' : (user.generationsRemaining ?? 0)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-secondary/10">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="font-semibold">Total Questions Generated</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{user.totalGeneratedCount ?? 0}</span>
                </div>

                 <div className="text-center text-sm text-muted-foreground">
                    You use 1 credit for every 10 questions generated.
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/generate">
                            <Zap className="mr-2 h-4 w-4" />
                            Generate New Paper
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/pricing">
                            <Crown className="mr-2 h-4 w-4" />
                            Upgrade Plan
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
