// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// This is where your API key is accessed.
// It reads the GEMINI_API_KEY from the environment variables you set in Vercel.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

// Access your API key as an environment variable (best practice).
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the generative model.
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default model;