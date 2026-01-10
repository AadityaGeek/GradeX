
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { PLANS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle2, Diamond, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const handleChoosePlan = () => {
    if (!user) {
        // This case is handled by the redirect, but as a fallback
        toast({
            title: 'Please log in',
            description: 'You need to be logged in to choose a plan.',
            variant: 'destructive',
        });
        return;
    }
    // In a real app, this would trigger a checkout flow (e.g., Stripe)
    toast({
      title: 'Coming Soon!',
      description: 'The ability to upgrade your plan is coming soon. Stay tuned!',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Find the Perfect Plan for You
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're just starting out or need unlimited power, we have a plan that fits your needs.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PLANS.map((plan) => {
                const isCurrentPlan = user?.planId === plan.id;
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      'flex flex-col shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1',
                      isCurrentPlan && 'border-2 border-primary shadow-primary/20',
                      plan.isFeatured && !isCurrentPlan && 'border-2 border-border'
                    )}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                          {plan.name === "Premium" && <Diamond className="text-primary"/>}
                          {plan.name}
                      </CardTitle>
                      <CardDescription>{plan.price} <span className="text-xs">{plan.priceDetails}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      {isCurrentPlan ? (
                          <Button disabled className="w-full">
                              Current Plan
                          </Button>
                      ) : (
                          <Button onClick={handleChoosePlan} className={cn("w-full", !plan.isFeatured && "bg-secondary text-secondary-foreground hover:bg-secondary/80")}>
                              {user ? 'Upgrade' : 'Get Started'}
                          </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
             {!user && (
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                        .
                    </p>
                </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
