
"use server";

import { generateQuestions, type GenerateQuestionsInput, type GenerateQuestionsOutput } from "@/ai/flows/generate-questions";
import { getClassAndSubjectDetails } from "@/lib/data";
import { questionFormSchema, type QuestionFormSchema, type QuestionType } from "@/lib/schemas";

type ActionState = {
  success: boolean;
  data: (GenerateQuestionsOutput & { title: string; subtitle:string }) | null;
  error: string | null;
};

export async function createQuestionPaper(
  formData: QuestionFormSchema
): Promise<ActionState> {
  const validatedFields = questionFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      error: "Invalid form data. Please check your selections.",
    };
  }

  const { classId, subjectId, chapters: selectedChapters, questionTypes: questionsToGenerate } = validatedFields.data;

  try {
    const classSubjectDetails = await getClassAndSubjectDetails(classId, subjectId);
    if (!classSubjectDetails) {
        throw new Error("Could not find class or subject details.");
    }
    const { className, subjectName } = classSubjectDetails;
    
    if (selectedChapters.length === 0) {
        throw new Error("No chapters selected.");
    }
    
    const chapterTitles = selectedChapters.map(c => c.title).join(", ");

    const aiInput: GenerateQuestionsInput = {
      class: className,
      subject: subjectName,
      chapter: chapterTitles,
      questionTypes: questionsToGenerate.map(({ type, count }) => ({ type, count })),
    };

    const aiOutput = await generateQuestions(aiInput);

    if (!aiOutput || !aiOutput.questions || Object.keys(aiOutput.questions).length === 0) {
        throw new Error("The AI failed to generate questions. Please try again with different options.");
    }

    return {
      success: true,
      data: {
        ...aiOutput,
        title: `${subjectName} - ${className}`,
        subtitle: `Questions for: ${chapterTitles}`,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error generating question paper:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while generating questions.";
    return {
      success: false,
      data: null,
      error: errorMessage,
    };
  }
}
