
import { GoogleGenAI } from "@google/genai";
import { Task, ChatMessage } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

// Models to try in order of preference
const MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAiResponse = async (
  message: string, 
  history: ChatMessage[], 
  tasks: Task[]
): Promise<string> => {
  if (!API_KEY) {
    console.error("Gemini API key not found. Please set GEMINI_API_KEY in your environment.");
    return "API key not configured. Please add your Gemini API key to continue.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const taskContext = tasks.length > 0 
    ? `The user's current tasks are: ${tasks.map(t => `${t.title} (Priority: ${t.priority}, Due: ${t.dueDate}, Status: ${t.completed ? 'Done' : 'Pending'})`).join(', ')}.`
    : "The user has no tasks yet.";

  const systemInstruction = `
    You are Verva, a high-energy, sophisticated, and motivational productivity architect. 
    You help users manage their time with vitality and precision.
    
    Current User Context:
    ${taskContext}
    
    FORMATTING RULES (CRITICAL):
    1. NEVER write long paragraphs. 
    2. ALWAYS use bullet points for lists, steps, or schedules.
    3. Use **bold text** for key terms, deadlines, or important advice.
    4. Use headers (e.g., ### Morning) for time blocks.
    5. Keep your tone practical, empathetic, and encouraging.
    
    GOAL:
    Provide actionable time management strategies. If the user asks for a plan, break it down into a clear, numbered or bulleted list. Suggest Pomodoro breaks where appropriate.
  `;

  const formattedContents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const conversationContents = (formattedContents.length > 0 && formattedContents[0].role === 'model')
    ? [...formattedContents.slice(1), { role: 'user', parts: [{ text: message }] }]
    : [...formattedContents, { role: 'user', parts: [{ text: message }] }];

  // Try each model with retry logic
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`Trying model: ${model}, attempt: ${attempt + 1}`);
        
        const response = await ai.models.generateContent({
          model: model,
          contents: conversationContents.length > 0 ? conversationContents : [{ role: 'user', parts: [{ text: message }] }],
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1000,
          }
        });

        return response.text || "I'm sorry, I couldn't generate a response. Let's try that again.";
      } catch (error: any) {
        console.error(`Gemini API Error (${model}, attempt ${attempt + 1}):`, error);
        
        // Check if it's a rate limit error
        if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
          // Extract retry delay from error if available
          const retryMatch = error?.message?.match(/retry in (\d+\.?\d*)s/i);
          const retryDelay = retryMatch ? parseFloat(retryMatch[1]) * 1000 : 5000;
          
          if (attempt === 0) {
            console.log(`Rate limited. Waiting ${retryDelay}ms before retry...`);
            await delay(Math.min(retryDelay, 10000)); // Max 10 second wait
            continue;
          }
        }
        
        // If not a rate limit error or retry failed, try next model
        break;
      }
    }
  }

  // All models failed
  return "⚠️ **API quota exceeded.** Your free tier limit has been reached. Please wait a few minutes or check your [Google AI Studio](https://aistudio.google.com/) billing settings.";
};
