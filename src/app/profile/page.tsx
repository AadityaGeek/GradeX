'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star, Zap, Crown, BookOpen, CalendarDays, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PLANS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PLAN_META: Record<string, { gradient: string; badge: string; glow: string }> = {
  free:    { gradient: 'from-slate-500/20 to-slate-600/10',    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',    glow: '' },
  basic:   { gradient: 'from-blue-500/20 to-blue-600/10',      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',        glow: 'shadow-blue-500/20' },
  pro:     { gradient: 'from-purple-500/20 to-purple-600/10',  badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',  glow: 'shadow-purple-500/20' },
  premium: { gradient: 'from-yellow-500/20 to-amber-600/10',   badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',  glow: 'shadow-yellow-500/20' },
};

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
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlan = PLANS.find((p) => p.id === (user.planId || 'free')) ?? PLANS[0];
  const planId = user.planId || 'free';
  const isPremium = planId === 'premium';
  const planStyle = PLAN_META[planId] ?? PLAN_META.free;

  const totalCredits = isPremium ? Infinity : (currentPlan.generations as number);
  const creditRemaining = user.generationsRemaining ?? 0;
  const creditPercent = isPremium ? 100 : totalCredits > 0 ? Math.round((creditRemaining / totalCredits) * 100) : 0;

  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const provider = user.providerData?.[0]?.providerId ?? 'unknown';
  const providerLabel = provider === 'google.com' ? 'Google' : provider === 'password' ? 'Email / Password' : provider;

  const initials = user.displayName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 -z-10 bg-background bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="container mx-auto max-w-2xl px-4 py-10 space-y-5">

        {/* ── Hero Card ── */}
        <div className={cn(
          'relative overflow-hidden rounded-2xl border shadow-xl',
          planStyle.glow && `shadow-lg ${planStyle.glow}`,
        )}>
          {/* Dark top band fading to card background — two-tone effect */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
          {/* Plan-tinted colour wash underneath */}
          <div className={cn('absolute inset-x-0 top-0 h-40 bg-gradient-to-br opacity-50', planStyle.gradient)} />
          {/* Lighter bottom half */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/80 to-transparent" />

          <div className="relative px-6 pt-10 pb-6 flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/40 ring-offset-4 ring-offset-background shadow-xl">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Premium crown badge */}
              {isPremium && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 shadow">
                  <Crown className="h-3.5 w-3.5 text-yellow-900" />
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
            </div>

            <Badge variant="outline" className={cn('text-sm px-3 py-1 font-semibold', planStyle.badge)}>
              <Crown className="mr-1.5 h-3.5 w-3.5" />
              {currentPlan.name} Plan
            </Badge>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-card p-5 text-center space-y-1 hover:border-primary/50 transition-colors">
            <Star className="h-6 w-6 text-yellow-400 mx-auto" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Credits Left</p>
            <p className="text-3xl font-bold">{isPremium ? '∞' : creditRemaining}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5 text-center space-y-1 hover:border-primary/50 transition-colors">
            <BookOpen className="h-6 w-6 text-primary mx-auto" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Papers Generated</p>
            <p className="text-3xl font-bold">{user.totalGeneratedCount ?? 0}</p>
          </div>
        </div>

        {/* ── Credit Usage ── */}
        {!isPremium && (
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Credit Usage</span>
              <span className="text-sm font-bold tabular-nums">
                <span className={cn(creditPercent < 20 ? 'text-destructive' : 'text-primary')}>{creditRemaining}</span>
                <span className="text-muted-foreground"> / {totalCredits}</span>
              </span>
            </div>
            {/* Gradient progress bar */}
            <div className="h-2.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  creditPercent < 20 ? 'bg-destructive' : 'bg-gradient-to-r from-primary to-cyan-400',
                )}
                style={{ width: `${creditPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {creditPercent < 20
                ? '⚠️ Running low on credits. Consider upgrading your plan.'
                : '1 credit is consumed per 10 questions generated.'}
            </p>
          </div>
        )}

        {/* ── Account Info ── */}
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account Info</h2>
          <div className="divide-y divide-border text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Sign-in method
              </span>
              <span className="font-medium">{providerLabel}</span>
            </div>
            {memberSince && (
              <div className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Member since
                </span>
                <span className="font-medium">{memberSince}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/generate" className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Generate Paper
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/pricing" className="flex items-center justify-center gap-2">
              <Crown className="h-4 w-4" />
              {isPremium ? 'View Plans' : 'Upgrade Plan'}
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
