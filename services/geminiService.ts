
import { GoogleGenAI } from "@google/genai";
import { Task, ChatMessage } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

// Models to try in order - using models with best free tier availability
const MODELS = ['gemini-2.0-flash-lite', 'gemini-1.5-flash-8b', 'gemini-1.5-flash', 'gemini-pro'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback responses when API is unavailable
const getFallbackResponse = (message: string, tasks: Task[]): string => {
  const lowerMessage = message.toLowerCase();
  const pendingTasks = tasks.filter(t => !t.completed);
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
  
  // Study/planning related
  if (lowerMessage.includes('study') || lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
    return `📚 **Here's a study plan template:**

**Morning Block (9 AM - 12 PM)**
• Focus on your **most challenging** subject
• Use **25-min Pomodoro** sessions
• Take a 5-min break between sessions

**Afternoon Block (2 PM - 5 PM)**  
• Review and practice problems
• Active recall & flashcards
• 15-min break halfway

**Evening Block (7 PM - 9 PM)**
• Light review of the day's material
• Prepare tomorrow's priorities

${pendingTasks.length > 0 ? `\n💡 **Your pending tasks:** ${pendingTasks.slice(0, 3).map(t => t.title).join(', ')}` : ''}

*Tip: Start with your hardest task when energy is highest!*`;
  }
  
  // Morning routine
  if (lowerMessage.includes('morning') || lowerMessage.includes('wake') || lowerMessage.includes('start')) {
    return `☀️ **Power Morning Routine:**

• **6:30 AM** - Wake up, hydrate immediately
• **6:45 AM** - 10-min stretch or light exercise
• **7:00 AM** - Healthy breakfast, no phone
• **7:30 AM** - Review your **top 3 priorities**
• **8:00 AM** - Start your **most important task**

${highPriorityTasks.length > 0 ? `\n🔥 **Your high-priority tasks:** ${highPriorityTasks.map(t => t.title).join(', ')}` : ''}

*Remember: Win the morning, win the day!*`;
  }
  
  // Focus/productivity tips
  if (lowerMessage.includes('focus') || lowerMessage.includes('productive') || lowerMessage.includes('concentrate')) {
    return `🎯 **Deep Focus Strategies:**

• **Pomodoro Technique** - 25 min work, 5 min rest
• **Remove distractions** - Phone in another room
• **Single-tasking** - One task at a time only
• **Time blocking** - Schedule specific tasks
• **2-minute rule** - If it takes <2 min, do it now

**Environment tips:**
• Use noise-canceling or lo-fi music
• Keep water nearby
• Good lighting is essential

*Your focus is your superpower!*`;
  }
  
  // Task management
  if (lowerMessage.includes('task') || lowerMessage.includes('todo') || lowerMessage.includes('manage')) {
    const taskSummary = pendingTasks.length > 0 
      ? `\n📋 **Your current tasks (${pendingTasks.length}):**\n${pendingTasks.slice(0, 5).map(t => `• ${t.title} (**${t.priority}** priority)`).join('\n')}`
      : '\n✨ You have no pending tasks!';
    
    return `📝 **Task Management Tips:**

**Prioritization Framework:**
1. **Urgent + Important** → Do first
2. **Important, not urgent** → Schedule it
3. **Urgent, not important** → Delegate if possible
4. **Neither** → Consider removing
${taskSummary}

*Focus on progress, not perfection!*`;
  }
  
  // Default helpful response
  return `👋 **Hey! I'm Verva, your productivity partner.**

I'm currently in **offline mode** (API limit reached), but I can still help!

**Try asking me about:**
• "Plan my study session"
• "Morning routine tips"  
• "How to focus better"
• "Help with my tasks"

${pendingTasks.length > 0 ? `\n📋 **Quick tip:** You have **${pendingTasks.length} pending tasks**. Start with the highest priority one!` : ''}

*Full AI features will resume shortly!*`;
};

export const getAiResponse = async (
  message: string, 
  history: ChatMessage[], 
  tasks: Task[]
): Promise<string> => {
  if (!API_KEY) {
    console.error("Gemini API key not found. Using fallback mode.");
    return getFallbackResponse(message, tasks);
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

  // Keep only last 4 messages to reduce token usage
  const recentHistory = history.slice(-4);
  
  const formattedContents = recentHistory.map(msg => ({
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
            maxOutputTokens: 500,
          }
        });

        return response.text || "I'm sorry, I couldn't generate a response. Let's try that again.";
      } catch (error: any) {
        console.error(`Gemini API Error (${model}, attempt ${attempt + 1}):`, error);
        
        // Check if it's a rate limit error
        if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
          const retryMatch = error?.message?.match(/retry in (\d+\.?\d*)s/i);
          const retryDelay = retryMatch ? parseFloat(retryMatch[1]) * 1000 : 5000;
          
          if (attempt === 0) {
            console.log(`Rate limited. Waiting ${retryDelay}ms before retry...`);
            await delay(Math.min(retryDelay, 15000));
            continue;
          }
        }
        
        break;
      }
    }
  }

  // All models failed - use fallback
  return getFallbackResponse(message, tasks);
};
