
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePdf } from "@/lib/pdf";
import type { GenerateQuestionsOutput, QuestionWithAnswer } from "@/ai/flows/generate-questions";
import { Download, ListChecks, Baseline, PencilLine, FileText, Binary, Eye, EyeOff, ArrowLeft, MessageSquareQuote, Lightbulb, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface QuestionDisplayProps {
  questionsData: GenerateQuestionsOutput;
  title: string;
  subtitle: string;
}

const iconMap: Record<string, React.ElementType> = {
  MCQ: ListChecks,
  "Fill in the Blanks": Baseline,
  "Short Answer": PencilLine,
  "Long Answer": FileText,
  "True/False": Binary,
  "Very Short Answer": MessageSquareQuote,
};

export function QuestionDisplay({ questionsData, title, subtitle }: QuestionDisplayProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [includeAnswersInPdf, setIncludeAnswersInPdf] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const handleDownload = async () => {
    setIsGeneratingPdf(true);
    try {
        await generatePdf(questionsData, title, subtitle, includeAnswersInPdf);
    } catch (error) {
        console.error("PDF generation failed:", error);
        toast({
            variant: "destructive",
            title: "PDF Generation Failed",
            description: "Could not generate the PDF. One or more of the required images (logo, watermark) might be missing from the /public/images directory.",
        });
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const questionTypesWithContent = Object.keys(questionsData.questions).filter(
    (type) => questionsData.questions[type] && questionsData.questions[type].length > 0
  );

  if (questionTypesWithContent.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg print:shadow-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">No Questions Generated</CardTitle>
          <CardDescription>
            The AI could not generate questions based on the provided material and selections. Please try again with different options.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderAnswer = (item: QuestionWithAnswer) => (
    <>
      <div className="mt-2 p-3 bg-secondary border-l-4 border-primary rounded-r-md">
          <span className="font-semibold text-secondary-foreground">Answer: </span>
          <span className="text-secondary-foreground whitespace-pre-line">{item.answer}</span>
      </div>
      {item.explanation && (
        <div className="mt-2 p-3 bg-secondary/80 border-l-4 border-accent rounded-r-md">
          <div className="flex items-center font-semibold text-secondary-foreground mb-1">
            <Lightbulb className="h-4 w-4 mr-2 text-accent" />
            <span>Explanation</span>
          </div>
          <p className="text-muted-foreground whitespace-pre-line">{item.explanation}</p>
        </div>
      )}
    </>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg print:shadow-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4 print:block">
            <div className="flex-1 space-y-1">
                <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-4 print:hidden w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <CardTitle className="font-headline text-2xl md:text-3xl">{title}</CardTitle>
                <CardDescription className="text-base">{subtitle}</CardDescription>
            </div>
            <div className="flex flex-col gap-4 print:hidden items-start sm:items-end">
                <div className="flex items-center space-x-2">
                    <Switch id="show-answers" checked={showAnswers} onCheckedChange={setShowAnswers} />
                    <Label htmlFor="show-answers" className="flex items-center gap-2 cursor-pointer">
                        {showAnswers ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        Show Answers
                    </Label>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2 w-full">
                    <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto" disabled={isGeneratingPdf}>
                         {isGeneratingPdf ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        Download PDF
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="include-answers" checked={includeAnswersInPdf} onCheckedChange={(checked) => setIncludeAnswersInPdf(!!checked)} />
                        <Label htmlFor="include-answers" className="text-sm font-medium leading-none cursor-pointer">Include Answers in PDF</Label>
                    </div>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={questionTypesWithContent} className="w-full space-y-4">
          {questionTypesWithContent.map((type) => {
            const Icon = iconMap[type] || PencilLine;
            return (
              <AccordionItem value={type} key={type} className="border rounded-lg bg-card">
                <AccordionTrigger className="text-xl font-semibold hover:no-underline px-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <span>{type} ({questionsData.questions[type].length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-5 px-4 text-base md:text-lg">
                    {questionsData.questions[type].map((item, index) => (
                      <li key={index} className="leading-relaxed">
                        <span className="whitespace-pre-line font-code">{item.question}</span>
                         {showAnswers && renderAnswer(item)}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
