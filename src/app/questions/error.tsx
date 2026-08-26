"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, PlusCircle, Home } from "lucide-react";
import Link from "next/link";

export default function QuestionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[/questions error boundary]", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription className="text-base">
            {error.message || "An unexpected error occurred while loading your question paper."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Button asChild>
            <Link href="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a New Paper
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
