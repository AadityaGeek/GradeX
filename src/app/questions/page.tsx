
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { QuestionDisplay } from "@/components/question-display";
import type { GenerateQuestionsOutput } from "@/ai/flows/generate-questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, PlusCircle } from "lucide-react";
import Link from "next/link";

type QuestionPaperData = GenerateQuestionsOutput & { title: string; subtitle: string };

export default function QuestionsPage() {
  const router = useRouter();
  const [questionPaperData, setQuestionPaperData] = React.useState<QuestionPaperData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("questionPaperData");
      if (storedData) {
        setQuestionPaperData(JSON.parse(storedData));
      } else {
        setError("No question paper data found. Please generate a new paper.");
      }
    } catch (e) {
      setError("Failed to load question paper data. Please try again.");
      console.error(e);
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/generate")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a New Paper
            </Button>
             <Button asChild variant="outline">
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

  if (!questionPaperData) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      {/* Ephemeral-data warning */}
      <EphemeralWarning />

      <QuestionDisplay 
        questionsData={questionPaperData} 
        title={questionPaperData.title} 
        subtitle={questionPaperData.subtitle}
      />
    </div>
  );
}

function EphemeralWarning() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      {/* Icon */}
      <span className="mt-0.5 shrink-0 text-amber-400" aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </span>

      {/* Text */}
      <div className="flex-1">
        <p className="font-semibold text-amber-300">Download before you leave</p>
        <p className="mt-0.5 text-amber-200/80">
          This paper is stored temporarily and <strong className="text-amber-300">will be lost</strong> if you refresh, close this tab, or navigate away. Use the <strong className="text-amber-300">Download PDF</strong> button below to save it.
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss warning"
        className="shrink-0 rounded p-0.5 text-amber-400/70 hover:text-amber-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
}
