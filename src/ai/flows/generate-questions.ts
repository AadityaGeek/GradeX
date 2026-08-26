
// src/ai/flows/generate-questions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating exam-style questions with answers by searching for content online.
 *
 * The flow takes class, subject, chapter, and question types/counts as input.
 * It then uses a language model to find relevant information and generate questions and answers tailored to the CBSE pattern.
 *
 * @param {GenerateQuestionsInput} input - The input for the question generation flow.
 * @returns {Promise<GenerateQuestionsOutput>} - A promise that resolves to the generated questions and answers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const QuestionRequestSchema = z.object({
  type: z.enum(['MCQ', 'Fill in the Blanks', 'Short Answer', 'Long Answer', 'True/False', 'Very Short Answer']),
  count: z.number(),
});

// Define the input schema for the generateQuestions flow
const GenerateQuestionsInputSchema = z.object({
  class: z.string().describe('The class for which to generate questions (e.g., 10, 11, 12).'),
  subject: z.string().describe('The subject for which to generate questions (e.g., Science, Math).'),
  chapter: z.string().describe('The chapter(s) for which to generate questions.'),
  questionTypes: z
    .array(QuestionRequestSchema)
    .describe('The types of questions to generate and the count for each type.'),
});

export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsInputSchema>;

// Define the schema for a single question with its answer and an optional explanation
const QuestionWithAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string().optional().nullable(),
});
export type QuestionWithAnswer = z.infer<typeof QuestionWithAnswerSchema>;

// Define the output schema for the generateQuestions flow
const GenerateQuestionsOutputSchema = z.object({
  questions: z.record(
    z.string(),
    z.array(QuestionWithAnswerSchema)
  ).describe('Generated questions and answers, grouped by question type. The keys of this record should be the question types from the input.'),
});

export type GenerateQuestionsOutput = z.infer<typeof GenerateQuestionsOutputSchema>;

// Define the generateQuestions function
export async function generateQuestions(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
  return generateQuestionsFlow(input);
}

// Define the prompt for generating questions with structured output schema
const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: { schema: GenerateQuestionsInputSchema },
  output: { schema: GenerateQuestionsOutputSchema },
  prompt: process.env.GENERATE_QUESTIONS_PROMPT || '',
});

// Helper to clean and parse JSON from AI text when needed
function parseAIJsonResponse(rawText: string) {
  let cleaned = rawText.trim();
  // Strip markdown code fences if present (```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  
  // Extract JSON bounds if extra text was included
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

// Define the Genkit flow for generating questions
const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    inputSchema: GenerateQuestionsInputSchema,
    outputSchema: GenerateQuestionsOutputSchema,
  },
  async input => {
    if (!process.env.GENERATE_QUESTIONS_PROMPT) {
      throw new Error("CRITICAL: The GENERATE_QUESTIONS_PROMPT environment variable is not set.");
    }

    const response = await generateQuestionsPrompt(input);

    // 1. Direct structured output from Genkit if available
    if (response.output) {
      const parsed = GenerateQuestionsOutputSchema.safeParse(response.output);
      if (parsed.success) {
        const cleanedQuestions: Record<string, QuestionWithAnswer[]> = {};
        for (const req of input.questionTypes) {
          const generated = parsed.data.questions[req.type] || [];
          cleanedQuestions[req.type] = generated.slice(0, req.count);
        }
        return { questions: cleanedQuestions };
      }
    }

    // 2. Fallback to parsing text response
    const textResponse = response.text || '';
    try {
      const parsedJson = parseAIJsonResponse(textResponse);
      const validationResult = GenerateQuestionsOutputSchema.safeParse(parsedJson);

      if (!validationResult.success) {
        console.error("AI output failed Zod validation:", JSON.stringify(validationResult.error.issues, null, 2));
        throw new Error("The AI returned data in an unexpected format. Please try again.");
      }

      // Post-process: ensure question counts strictly match the user's requested counts
      const cleanedQuestions: Record<string, QuestionWithAnswer[]> = {};
      for (const req of input.questionTypes) {
        const generated = (validationResult.data as GenerateQuestionsOutput).questions[req.type] || [];
        cleanedQuestions[req.type] = generated.slice(0, req.count);
      }

      return { questions: cleanedQuestions };
    } catch (error) {
      console.error("Failed to parse JSON response from AI:", error);
      console.error("Raw AI response was:", textResponse);
      throw new Error("There was an issue processing the AI's response. Please try again.");
    }
  }
);
