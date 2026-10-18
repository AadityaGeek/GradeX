import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';
config();

const model = process.env.GEMINI_MODEL || 'googleai/gemini-3.8-flash';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model,
});
