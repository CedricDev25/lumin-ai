import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface StudyResult {
  id: string;
  type: 'summarize' | 'quiz' | 'explain';
  input: string;
  output: string;
  timestamp: number;
}

export const summarizeText = async (text: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please configure it in the secrets panel.');
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following study notes concisely, highlighting key concepts and main points:\n\n${text}`,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || 'Failed to generate summary.';
};

export const generateQuiz = async (text: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please configure it in the secrets panel.');
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 5-question multiple-choice quiz based on the following text. Include correct answers at the end:\n\n${text}`,
    config: {
      temperature: 0.8,
    }
  });

  return response.text || 'Failed to generate quiz.';
};

export const explainSimply = async (text: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please configure it in the secrets panel.');
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the following concept in very simple terms, as if you were teaching a 10-year-old:\n\n${text}`,
    config: {
      temperature: 0.7,
    }
  });

  return response.text || 'Failed to generate explanation.';
};

export const chatWithAi = async (message: string, history: any[]): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing.');
  }

  // Convert history entries to the format expected by ai.chats.create
  // history is already in {role, parts: [{text}]} format
  
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: history
  });

  const response = await chat.sendMessage({
    message: message
  });

  return response.text || 'Failed to get response.';
};
