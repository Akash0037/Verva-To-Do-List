
import { GoogleGenAI } from "@google/genai";
import { Task, ChatMessage } from "../types";

export const getAiResponse = async (
  message: string, 
  history: ChatMessage[], 
  tasks: Task[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

  try {
    const formattedContents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const conversationContents = (formattedContents.length > 0 && formattedContents[0].role === 'model')
      ? [...formattedContents.slice(1), { role: 'user', parts: [{ text: message }] }]
      : [...formattedContents, { role: 'user', parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: conversationContents.length > 0 ? conversationContents : [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Let's try that again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a momentary sync issue. Let's get back to planning in a second!";
  }
};
