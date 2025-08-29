// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: Never expose your API key in client-side code.
// This is a server-side file and will not be accessible to the public.
// You must set GEMINI_API_KEY as an environment variable in Vercel.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

// Access your API key as an environment variable (best practice).
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the generative model.
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default model;