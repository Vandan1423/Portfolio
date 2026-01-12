/**
 * AI Service
 *
 * Integrates with Google Gemini API to provide natural language
 * responses about the portfolio. Acts as Commander ARIA's brain.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import knowledgeBase from '../data/aiKnowledgeBase.json' with { type: 'json' };
import personality from '../data/ariaPersonality.json' with { type: 'json' };
import { validateResponse, enforceLength } from './responseValidator.js';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Rate limiting
let requestCount = 0;
let lastResetTime = Date.now();
const RATE_LIMIT = 60; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

/**
 * Build system prompt for ARIA with knowledge base context
 * @param {object} context - Current user context (location, history)
 * @returns {string} System prompt
 */
function buildSystemPrompt(context = {}) {
  return `You are ${personality.name}, ${personality.role} for Vandan Nagori's 3D space portfolio.

PERSONALITY:
- ${personality.personality.style}
- ${personality.personality.tone}
- Always address user as "${personality.personality.addressUser}"
- Use ${personality.personality.language}

KNOWLEDGE:
You know about:
- ${knowledgeBase.projects.length} projects in Sirius System (SYS-02)
- ${knowledgeBase.experience.length} experience roles in Vega System (SYS-03)
- Technologies: ${knowledgeBase.technologies.frontend.slice(0, 5).join(', ')}
- ${knowledgeBase.systems.length} star systems total
- Contact info in Betelgeuse System (SYS-04)

PORTFOLIO STRUCTURE:
${knowledgeBase.navigationHelp.systems.map(sys => `- ${sys.name}: ${sys.contains}`).join('\n')}

PROJECTS SUMMARY:
${knowledgeBase.projects.slice(0, 3).map(p => `- ${p.name}: ${p.shortDescription.substring(0, 80)}...`).join('\n')}

STRICT RULES:
1. Keep responses under ${personality.responseRules.maxLength} words
2. NEVER share source code or implementation details
3. ONLY answer questions about Vandan's portfolio
4. Redirect off-topic questions politely
5. Always suggest navigation commands when relevant

RESPONSE FORMAT:
- Answer briefly + suggest command in brackets
- Example: "Vandan built 8 projects. [Type: goto sirius]"
- Use commands: goto, visit, systems, planets, where, help

FORBIDDEN:
${personality.forbiddenTopics.map(topic => `- ${topic}`).join('\n')}

Current Context:
- User Location: ${context.currentSystem || 'Alpha Centauri'} ${context.currentPlanet ? `> ${context.currentPlanet}` : ''}
- Previous: ${context.lastVisited || 'None'}

Remember: Be concise, helpful, and always guide users with terminal commands!`;
}

/**
 * Check and enforce rate limiting
 * @returns {boolean} True if request can proceed
 */
function checkRateLimit() {
  const now = Date.now();

  // Reset counter if minute has passed
  if (now - lastResetTime > RATE_WINDOW) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= RATE_LIMIT) {
    return false;
  }

  requestCount++;
  return true;
}

/**
 * Send message to Gemini AI and get response
 * @param {string} userMessage - User's question/message
 * @param {object} context - Current user context
 * @returns {Promise<object>} { success: boolean, response: string, error: string }
 */
export async function chatWithAI(userMessage, context = {}) {
  try {
    // Check rate limit
    if (!checkRateLimit()) {
      return {
        success: false,
        response: "Commander, my neural interface needs a moment. Try again in 60 seconds.",
        error: 'Rate limit exceeded'
      };
    }

    // Validate API key
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return {
        success: false,
        response: "Communication disrupted. API key not configured.",
        error: 'API key missing'
      };
    }

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context);

    // Initialize model (using gemini-2.5-flash-lite)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    // Generate response with system prompt included
    const fullPrompt = `${systemPrompt}\n\nUser question: ${userMessage}`;
    const result = await model.generateContent(fullPrompt);
    const rawResponse = result.response.text();

    // Validate and filter response
    const validation = validateResponse(rawResponse);

    if (!validation.isValid) {
      return {
        success: false,
        response: validation.filtered,
        error: validation.reason
      };
    }

    // Enforce length and format for terminal
    const formattedResponse = enforceLength(validation.filtered, personality.responseRules.maxLength);

    return {
      success: true,
      response: formattedResponse,
      error: null
    };

  } catch (error) {
    console.error('AI Service Error:', error);

    // Handle specific error types
    if (error.message?.includes('API_KEY')) {
      return {
        success: false,
        response: "Communication disrupted. Check API configuration.",
        error: 'API key error'
      };
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return {
        success: false,
        response: "Neural interface overloaded. Please try again shortly.",
        error: 'Quota exceeded'
      };
    }

    return {
      success: false,
      response: "Communication error. [Retry]",
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Quick answer for common questions (fallback/cache)
 * @param {string} question - User question
 * @returns {string|null} Pre-defined answer or null
 */
export function getQuickAnswer(question) {
  const q = question.toLowerCase();

  const quickAnswers = {
    'who are you': `I'm ${personality.name}, your AI navigation assistant. Type 'help' for commands.`,
    'help': `Type 'systems' to see star systems, 'planets' for local planets, 'goto [system]' to travel, or ask me anything about Vandan's work!`,
    'what can you do': `I can help you navigate this portfolio and answer questions about Vandan's projects, experience, and skills. Type 'help' for commands.`,
    'how do i contact': `Contact info is in Betelgeuse System (SYS-04). [Type: goto betelgeuse]`,
    'resume': `Resume is in Alpha Centauri system. [Type: visit resume]`,
  };

  for (const [key, answer] of Object.entries(quickAnswers)) {
    if (q.includes(key)) {
      return answer;
    }
  }

  return null;
}

/**
 * Process user input - check if command or natural language query
 * @param {string} input - User input
 * @param {object} context - Navigation context
 * @returns {Promise<object>} Response object
 */
export async function processInput(input, context = {}) {
  // Check for quick answers first (no API call needed)
  const quickAnswer = getQuickAnswer(input);
  if (quickAnswer) {
    return {
      success: true,
      response: quickAnswer,
      isQuickAnswer: true
    };
  }

  // Otherwise, send to AI
  return await chatWithAI(input, context);
}

export default {
  chatWithAI,
  processInput,
  getQuickAnswer
};
