      "use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createQuestionPaper } from "@/app/actions";
import { type Chapter, type Class, type Subject, getClasses, getSubjects, getChapters } from "@/lib/data";
import { QUESTION_TYPES, questionFormSchema, type QuestionFormSchema } from "@/lib/schemas";
import { Loader2, Lock } from "lucide-react";
import { ReviewDialog } from "./review-dialog";
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase } from "@/firebase/client-provider";
import { doc, increment, writeBatch } from "firebase/firestore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function QuestionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { user } = useUser();
  const { firestore } = useFirebase();

  const [classes, setClasses] = React.useState<Pick<Class, "id" | "name">[]>([]);
  const [subjects, setSubjects] = React.useState<Pick<Subject, "id" | "name">[]>([]);
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [reviewData, setReviewData] = React.useState<QuestionFormSchema | null>(null);

  const form = useForm<QuestionFormSchema>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      classId: "",
      subjectId: "",
      chapters: [],
      questionTypes: [],
    },
  });

  const watchedClassId = form.watch("classId");
  const watchedSubjectId = form.watch("subjectId");
  
  const fetchChapters = React.useCallback(async () => {
    if (watchedClassId && watchedSubjectId) {
      getChapters(watchedClassId, watchedSubjectId).then(setChapters);
    }
  }, [watchedClassId, watchedSubjectId]);

  React.useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  React.useEffect(() => {
    if (watchedClassId) {
      form.setValue("subjectId", "");
      form.setValue("chapters", []);
      setSubjects([]);
      setChapters([]);
      getSubjects(watchedClassId).then(setSubjects);
    }
  }, [watchedClassId, form]);

  React.useEffect(() => {
    if (watchedClassId && watchedSubjectId) {
      form.setValue("chapters", []);
      setChapters([]);
      fetchChapters();
    }
  }, [watchedClassId, watchedSubjectId, form, fetchChapters]);

  const onSubmit = (formData: QuestionFormSchema) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to generate questions.",
        });
        router.push('/login');
        return;
    }
    if ((user.generationsRemaining ?? 0) <= 0) {
        toast({
            variant: "destructive",
            title: "No Generations Left",
            description: "You have used all your free generations. Please upgrade for more.",
        });
        return;
    }
    setReviewData(formData);
  };
  
  const handleConfirm = () => {
    if (!reviewData || !user) return;

    startTransition(async () => {
      const result = await createQuestionPaper(reviewData);
      if (result.success && result.data) {
        // Decrement generationsRemaining on successful generation
        if (user.planId === 'free') {
            const userDocRef = doc(firestore, "users", user.uid);
            const batch = writeBatch(firestore);
            batch.update(userDocRef, { generationsRemaining: increment(-1) });
            await batch.commit();
        }

        sessionStorage.setItem("questionPaperData", JSON.stringify(result.data));
        toast({ title: "Success!", description: "Your questions have been generated." });
        router.push("/questions");
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
        setReviewData(null);
      }
    });
  };

  const socialScienceChapters = React.useMemo(() => {
    if (watchedSubjectId !== 'social-science') {
      return null;
    }
    const grouped: Record<string, Chapter[]> = {
      "History": [],
      "Geography": [],
      "Political Science (Civics)": [],
      "Economics": [],
    };
    chapters.forEach(chapter => {
      if (chapter.id.startsWith('hist-')) {
        grouped["History"].push(chapter);
      } else if (chapter.id.startsWith('geo-')) {
        grouped["Geography"].push(chapter);
      } else if (chapter.id.startsWith('civ-')) {
        grouped["Political Science (Civics)"].push(chapter);
      } else if (chapter.id.startsWith('econ-')) {
        grouped["Economics"].push(chapter);
      }
    });
    return grouped;
  }, [chapters, watchedSubjectId]);


  return (
    <>
      {reviewData && (
          <ReviewDialog
            isOpen={!!reviewData}
            onClose={() => setReviewData(null)}
            onConfirm={handleConfirm}
            isPending={isPending}
            formData={reviewData}
            classAndSubject={{
              className: classes.find(c => c.id === reviewData.classId)?.name || '',
              subjectName: subjects.find(s => s.id === reviewData.subjectId)?.name || '',
            }}
          />
      )}
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Your Question Paper</CardTitle>
          <CardDescription>Fill out the details below to generate your questions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Class</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Subject</Label>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!watchedClassId}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <AnimatePresence>
                {chapters.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Separator />
                    <FormField
                      control={form.control}
                      name="chapters"
                      render={() => (
                        <FormItem className="mt-8">
                          <div className="mb-4">
                            <Label>Chapters</Label>
                            <FormMessage className="ml-2" />
                          </div>
                          <div className="space-y-3">
                           {socialScienceChapters ? (
                              Object.entries(socialScienceChapters).map(([group, chapters]) => (
                                chapters.length > 0 && (
                                <div key={group} className="space-y-3">
                                  <h3 className="text-lg font-semibold mt-4 pt-2">{group}</h3>
                                  {chapters.map((chapter) => (
                                     <FormField
                                        key={chapter.id}
                                        control={form.control}
                                        name="chapters"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <Checkbox
                                                id={`chapter-${chapter.id}`}
                                                checked={field.value?.some(c => c.id === chapter.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...(field.value || []), chapter])
                                                    : field.onChange(field.value?.filter((value) => value.id !== chapter.id));
                                                }}
                                              />
                                            </FormControl>
                                            <label htmlFor={`chapter-${chapter.id}`} className="font-normal cursor-pointer">{chapter.title}</label>
                                          </FormItem>
                                        )}
                                      />
                                  ))}
                                </div>
                                )
                              ))
                           ) : (
                            chapters.map((chapter) => (
                              <FormField
                                key={chapter.id}
                                control={form.control}
                                name="chapters"
                                render={({ field }) => {
                                  return (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        id={`chapter-${chapter.id}`}
                                        checked={field.value?.some(c => c.id === chapter.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), chapter])
                                            : field.onChange(field.value?.filter((value) => value.id !== chapter.id));
                                        }}
                                      />
                                    </FormControl>
                                    <label htmlFor={`chapter-${chapter.id}`} className="font-normal cursor-pointer">{chapter.title}</label>
                                  </FormItem>
                                )}}
                              />
                            ))
                           )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Separator />
              
              <FormField
                control={form.control}
                name="questionTypes"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <div className="mb-4">
                      <Label className="text-base">Question Types</Label>
                      <FormMessage className="ml-2" />
                    </div>
                     <TooltipProvider>
                        <div className="space-y-4">
                        {QUESTION_TYPES.map((type) => {
                            const isSelected = field.value.some((q) => q.id === type.id);
                            const isLocked = user?.planId === 'free' && type.isPremium;

                            const content = (
                                <motion.div
                                key={type.id}
                                layout
                                className="flex flex-row items-center justify-between p-3 bg-secondary/50 rounded-lg"
                                >
                                <Label className="font-normal flex items-center space-x-2 cursor-pointer">
                                    <Checkbox
                                    checked={isSelected}
                                    disabled={isLocked}
                                    onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                        field.onChange([...currentValues, { id: type.id, type: type.name, count: 5 }]);
                                        } else {
                                        field.onChange(currentValues.filter((q) => q.id !== type.id));
                                        }
                                    }}
                                    />
                                    <span>{type.name}</span>
                                    {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                                </Label>
                                <motion.div
                                    animate={{
                                    opacity: isSelected ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className={!isSelected ? "invisible pointer-events-none" : ""}
                                >
                                    <Input
                                    type="number"
                                    value={field.value.find((q) => q.id === type.id)?.count || 0}
                                    onChange={(e) => {
                                        const newCount = parseInt(e.target.value, 10) || 0;
                                        const newQuestionTypes = field.value.map((q) =>
                                        q.id === type.id ? { ...q, count: newCount } : q
                                        );
                                        field.onChange(newQuestionTypes);
                                    }}
                                    className="h-8 w-24 text-center"
                                    disabled={!isSelected}
                                    />
                                </motion.div>
                                </motion.div>
                            );

                            if (isLocked) {
                                return (
                                <Tooltip key={type.id}>
                                    <TooltipTrigger asChild>
                                    <div className="cursor-not-allowed">{content}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                    <p>Upgrade to a paid plan to use this question type.</p>
                                    </TooltipContent>
                                </Tooltip>
                                );
                            }

                            return content;
                        })}
                        </div>
                    </TooltipProvider>
                  </FormItem>
                )}
              />


              <CardFooter className="px-0 pt-8">
                <Button type="submit" disabled={isPending || !user} className="w-full md:w-auto">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Generating..." : "Generate Questions"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
    

    

    

