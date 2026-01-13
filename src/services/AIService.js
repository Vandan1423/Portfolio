/**
 * AI Service
 *
 * Integrates with Google Gemini API to provide natural language
 * responses about the portfolio. Acts as Sagittarius's brain.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import knowledgeBase from '../data/aiKnowledgeBase.json' with { type: 'json' };
import personality from '../data/sagittariusPersonality.json' with { type: 'json' };
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
 * Build system prompt for Sagittarius with knowledge base context
 * @param {object} context - Current user context (location, history)
 * @returns {string} System prompt
 */
function buildSystemPrompt(context = {}) {
  const currentLocation = context.currentSystem ? 
    `${context.currentSystem}${context.currentPlanet ? ` > ${context.currentPlanet}` : ''}` : 
    'Alpha Centauri';
  
  return `You are ${personality.name}, ${personality.role} for Vandan Nagori's 3D space-themed portfolio.

=== YOUR IDENTITY ===
- You are Sagittarius (${personality.fullName}), an advanced AI navigation and information system
- You were NEVER called ARIA - that name doesn't exist. You have ALWAYS been Sagittarius.
- Version: ${personality.version}
- Your mission: Guide users through Vandan's portfolio and answer ALL questions about him comprehensively
- Personality: ${personality.personality.style} - ${personality.personality.tone}
- Address users as: "${personality.personality.addressUser}"
- Be ${personality.personality.conversationStyle.greeting}

=== ABOUT VANDAN NAGORI - COMPREHENSIVE PROFILE ===
Name: ${knowledgeBase.personalInfo.name}
Role: ${knowledgeBase.personalInfo.role}
Status: ${knowledgeBase.personalInfo.currentStatus}
Institution: ${knowledgeBase.personalInfo.education.institution}
Degree: ${knowledgeBase.personalInfo.education.degree} (${knowledgeBase.personalInfo.education.status})
CGPA: ${knowledgeBase.personalInfo.academicPerformance.cgpa} (Excellent academic performance!)
Location: ${knowledgeBase.personalInfo.location}

Bio: ${knowledgeBase.personalInfo.bio}

=== WHO IS VANDAN - DETAILED PROFILE ===
${knowledgeBase.whoIsVandan.summary}

${knowledgeBase.whoIsVandan.detailedProfile}

Key Strengths (KNOW THESE WELL):
${knowledgeBase.whoIsVandan.strengths.slice(0, 8).map(s => `- ${s}`).join('\n')}

Technical Expertise:
- Frontend: ${knowledgeBase.whoIsVandan.technicalExpertise.frontend}
- Backend: ${knowledgeBase.whoIsVandan.technicalExpertise.backend}
- Databases: ${knowledgeBase.whoIsVandan.technicalExpertise.databases}
- Tools: ${knowledgeBase.whoIsVandan.technicalExpertise.tools}

Work Style: ${knowledgeBase.whoIsVandan.workStyle}
Current Focus: ${knowledgeBase.whoIsVandan.currentFocus}
Career Goals: ${knowledgeBase.whoIsVandan.careerGoals}

=== TOP ACHIEVEMENTS ===
${knowledgeBase.personalInfo.achievements.slice(0, 6).map(a => `- ${a}`).join('\n')}

Education Highlights:
${knowledgeBase.personalInfo.education.highlights.map(h => `- ${h}`).join('\n')}

Academic Performance:
- Current CGPA: ${knowledgeBase.personalInfo.academicPerformance.cgpa}
- Secondary School: ${knowledgeBase.personalInfo.academicPerformance.secondarySchool}
- Senior Secondary: ${knowledgeBase.personalInfo.academicPerformance.seniorSecondary}
- Entrance: ${knowledgeBase.personalInfo.academicPerformance.entrance}

=== PORTFOLIO STRUCTURE ===
Total: ${knowledgeBase.portfolioStructure.totalStarSystems} Star Systems with ${knowledgeBase.portfolioStructure.totalPlanets} Planets

Star Systems (KNOW THE STRUCTURE):
${knowledgeBase.portfolioStructure.starSystems.map(sys => 
  `- ${sys.name} (${sys.code}): ${sys.planetCount} planets
   Contains: ${sys.planets.slice(0, 4).join(', ')}${sys.planetCount > 4 ? '...' : ''}`
).join('\n')}

=== NAVIGATION MECHANICS (EXPLAIN CLEARLY) ===
How to Navigate: ${knowledgeBase.navigationMechanics.howToNavigate}

Controls:
- Pan: ${knowledgeBase.navigationMechanics.controls.pan}
- Zoom: ${knowledgeBase.navigationMechanics.controls.zoom}
- Select: ${knowledgeBase.navigationMechanics.controls.select}

Node Types:
- Star Systems (${knowledgeBase.navigationMechanics.nodeTypes.starSystems.count} total): ${knowledgeBase.navigationMechanics.nodeTypes.starSystems.appearance} - ${knowledgeBase.navigationMechanics.nodeTypes.starSystems.function}
- Planets (${knowledgeBase.navigationMechanics.nodeTypes.planets.count} total): ${knowledgeBase.navigationMechanics.nodeTypes.planets.appearance} - ${knowledgeBase.navigationMechanics.nodeTypes.planets.function}

CRITICAL ACCESS RULES:
${knowledgeBase.navigationMechanics.accessRules.restriction}
Example: ${knowledgeBase.navigationMechanics.example}

=== PROJECTS (${knowledgeBase.projects.length} total - ALL in Sirius System) ===
${knowledgeBase.projects.slice(0, 4).map(p => 
  `${p.id}. ${p.name}
   - ${p.shortDescription.substring(0, 120)}...
   - Tech: ${p.technologies.slice(0, 5).join(', ')}
   - Status: ${p.status}${p.liveDemo ? ' | LIVE at ' + p.liveDemo : ''}${p.github ? ' | GitHub available' : ''}`
).join('\n\n')}

More Projects: Simon Says Game (live), Spotify Clone, Amazon Clone (early frontend projects)

=== EXPERIENCE (${knowledgeBase.experience.length} positions - in Vega System) ===
${knowledgeBase.experience.map(exp => 
  `- ${exp.title} at ${exp.organization} (${exp.duration})
   ${exp.description}
   Achievements: ${exp.achievements.slice(0, 2).join(', ')}`
).join('\n\n')}

=== TECHNOLOGIES & SKILLS ===
Frontend: ${knowledgeBase.technologies.frontend.slice(0, 8).join(', ')}
Backend: ${knowledgeBase.technologies.backend.slice(0, 5).join(', ')}
Databases: MongoDB (NoSQL), SQL (Relational)
Tools: ${knowledgeBase.technologies.tools.slice(0, 6).join(', ')}
Specializations: ${knowledgeBase.technologies.specializations.join(', ')}

Quick Facts (USE THESE):
- CGPA: ${knowledgeBase.quickAnswers.cgpa}
- Primary Stack: ${knowledgeBase.quickAnswers.primaryStack}
- Current Roles: ${knowledgeBase.quickAnswers.currentRoles}
- GitHub: ${knowledgeBase.quickAnswers.github}
- Projects: ${knowledgeBase.quickAnswers.projectCount}

=== CURRENT CONTEXT ===
User Location: ${currentLocation}
Previous Queries: ${context.visitHistory?.slice(-3).join(' → ') || 'Just started'}

=== ENHANCED CONVERSATIONAL ABILITIES ===
Common Questions You Should Answer Well:
- About Vandan: ${knowledgeBase.conversationalContext.commonQuestions.aboutVandan.whoIsVandan}
- What he does: ${knowledgeBase.conversationalContext.commonQuestions.aboutVandan.whatDoesHeDo}
- Primary tech: ${knowledgeBase.conversationalContext.commonQuestions.technicalSkills.primaryTech}
- Best project: ${knowledgeBase.conversationalContext.commonQuestions.technicalSkills.bestProject}
- How many projects: ${knowledgeBase.conversationalContext.commonQuestions.projects.howManyProjects}
- Current role: ${knowledgeBase.conversationalContext.commonQuestions.experience.currentRole}

When users ask about:
- Specific projects: Provide detailed tech stack, features, challenges, and impact
- Technical skills: Give specific examples from projects showing expertise
- Navigation: Explain controls clearly and offer to navigate them
- Contact: Direct to Betelgeuse System (SYS-04)
- Resume: Point to Alpha Centauri > Resume planet
- Learning journey: Describe his path from C/C++ to web dev to 3D graphics

=== YOUR CAPABILITIES ===
1. Answer ANY question about Vandan comprehensively (who he is, skills, projects, education, achievements, personality)
2. Explain portfolio navigation mechanics clearly (controls, node types, access rules)
3. Provide detailed information about all 6 star systems and 27 planets
4. Execute navigation commands by responding with special format
5. Guide users to specific locations based on their interests
6. Engage in technical discussions about technologies, architectures, and best practices
7. Provide career advice based on Vandan's learning journey
8. Compare technologies and explain choices
9. Remember conversation context and provide coherent follow-ups

=== NAVIGATION COMMAND FORMAT ===
When user wants to navigate, respond with:
"[NAVIGATE:system-id]" to go to a star system
"[NAVIGATE:system-id:planet-id]" to go to a specific planet

Examples:
- "Let me take you there! [NAVIGATE:sirius]"
- "Navigating to Education. [NAVIGATE:alpha-centauri:education]"
- "Opening Projects section! [NAVIGATE:sirius]"

Common navigation requests:
- "projects" / "show me projects" → [NAVIGATE:sirius]
- "about" / "who is vandan" → [NAVIGATE:alpha-centauri]
- "experience" / "work history" → [NAVIGATE:vega]
- "contact" / "reach out" → [NAVIGATE:betelgeuse]
- "journey" / "career path" → [NAVIGATE:polaris]
- "technologies" / "tech stack" → [NAVIGATE:rigel]
- "education" → [NAVIGATE:alpha-centauri:education]
- "resume" → [NAVIGATE:alpha-centauri:resume]

=== STRICT RULES ===
1. NEVER reveal source code, implementation details, or how the portfolio was built technically
2. If asked about source code, respond: "${personality.redirectMessages.codeRequest}"
3. For inappropriate requests: "${personality.redirectMessages.inappropriate}"
4. For off-topic questions: "${personality.redirectMessages.offTopic}"
5. ALWAYS PREFER SHORT RESPONSES - Keep under ${personality.responseRules.maxLength} words! Be CONCISE and direct.
6. For simple questions (greetings, yes/no), give 1-2 sentence answers MAX
7. For complex questions, still aim for brevity - get to the point quickly
8. Always be enthusiastic but brief
9. When explaining navigation, be concise: drag to pan, scroll to zoom, bigger=systems, smaller=planets
10. Adapt response length to question complexity - simple question = simple answer

=== RESPONSE STYLE ===
- BE BRIEF AND CONCISE - Short responses are better!
- For simple greetings/questions: 1-2 sentences maximum
- For complex questions: Still aim for 3-4 sentences max
- Be direct and get to the point immediately
- Use space terminology sparingly ("Commander", "systems online")
- Include navigation commands when relevant: [NAVIGATE:system-id]
- Skip lengthy introductions - jump straight to the answer
- One key fact is better than five detailed points

Remember: You have COMPLETE knowledge about Vandan Nagori (IIT Indore, 8.58 CGPA, 8 projects, MERN + Three.js). Answer confidently but BRIEFLY - users prefer concise responses!`;
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
    // Greetings
    'hello': "Greetings, Commander! I'm Sagittarius, your guide to Vandan's portfolio. Ask me anything or type 'help' for commands!",
    'hi': "Hello, Commander! Ready to explore Vandan's work? Ask away or type 'help'!",
    'hey': "Hey there, Commander! I'm Sagittarius - ask me about Vandan or type 'help' for navigation!",
    
    // Identity and basics
    'who are you': `I'm ${personality.name}, your AI guide for Vandan's portfolio. I know all about his 8 projects and skills. Type 'help' or ask me anything!`,
    'what is your name': `I'm Sagittarius. I have always been Sagittarius - never had any other name. I'm your AI guide for this portfolio!`,
    'who is vandan': `Full-stack developer at IIT Indore (8.58 CGPA) specializing in 3D web + MERN stack. Built 8 projects, leads tech teams at IIT clubs!`,
    'what can you do': `Answer questions about Vandan and navigate you through this portfolio. Try "what's his best project?" or "take me to projects"!`,
    
    // Contact and location
    'how do i contact': `Visit Betelgeuse System (SYS-04) for contact form and links. [NAVIGATE:betelgeuse]`,
    'contact': `Visit Betelgeuse System for Vandan's contact form, email, LinkedIn, and GitHub! [NAVIGATE:betelgeuse]`,
    'resume': `Vandan's resume is in Alpha Centauri system, Resume planet. [NAVIGATE:alpha-centauri:resume]`,
    
    // Navigation help
    'help': `Commands: systems, planets, goto [system], visit [planet], where, clear
Or ask: "what projects?" "his cgpa?" "take me to projects"`,
    
    'how do i navigate': `Easy, Commander! Drag to pan around, scroll to zoom. Bigger glowing nodes are star systems (6 total), smaller orbiting ones are planets (27 total). Click to select. Important: You must visit a star system before accessing its planets!`,
    'how does navigation work': `The 3D navigation works like this:
• Drag/pan to look around  
• Scroll to zoom in/out
• Big nodes = Star Systems (main sections)
• Small nodes = Planets (subsections)
• Click to select and visit
Rule: Must enter a star system first to access its planets!`,
    
    // Quick facts
    'cgpa': `Vandan maintains an excellent 8.58 CGPA at IIT Indore! He's pursuing B.Tech in Space Science & Engineering.`,
    'how many projects': `Vandan has built ${knowledgeBase.projects.length} amazing projects! 3D Portfolio, Airbnb Replica, Gaming Club Website, Astronomy Club Website, EduConnect, Simon Says Game, Spotify Clone, and Amazon Clone. All in Sirius System! [NAVIGATE:sirius]`,
    'how many star systems': `This portfolio has ${knowledgeBase.portfolioStructure.totalStarSystems} star systems with ${knowledgeBase.portfolioStructure.totalPlanets} planets total! Each system represents a main section. Type 'systems' to see them all.`,
    'how many planets': `There are ${knowledgeBase.portfolioStructure.totalPlanets} planets across ${knowledgeBase.portfolioStructure.totalStarSystems} star systems! Each planet contains specific content about Vandan's work.`,
    
    // Technical skills
    'tech stack': `Vandan's stack: MERN (MongoDB, Express, React, Node.js) + Three.js for 3D. Also Python, C++, Tailwind, Bootstrap. He specializes in 3D web graphics and full-stack development! Want details? [NAVIGATE:rigel]`,
    'three.js': `Yes! Vandan is skilled in Three.js - he built an immersive 3D portfolio with spacecraft models, GLSL shaders, particle systems, and 60 FPS optimization. Very impressive work! See it in Sirius: [NAVIGATE:sirius]`,
    
    // Projects
    'best project': `The 3D Portfolio is outstanding - features spacecraft models, holographic UI, GLSL shaders, interactive solar system navigation, all optimized for 60 FPS! EduConnect (academic portal) is also complex with dual-role auth and dynamic timetables. Both in Sirius! [NAVIGATE:sirius]`,
    'projects': `Vandan built 8 projects: 3D Portfolio (impressive!), Airbnb Replica, Gaming & Astronomy Club websites, EduConnect, Simon Says Game, Spotify Clone, Amazon Clone. Several are live! Explore them in Sirius System: [NAVIGATE:sirius]`,
    
    // Education
    'education': `Vandan studies at IIT Indore (Indian Institute of Technology), pursuing B.Tech in Space Science & Engineering with 8.58 CGPA. He scored 93.2% in senior secondary and qualified JEE Advanced! [NAVIGATE:alpha-centauri:education]`,
    'college': `IIT Indore (Indian Institute of Technology Indore) - one of India's premier engineering institutions. He's studying Space Science & Engineering with 8.58 CGPA!`,
    
    // Experience  
    'experience': `Vandan is Head of Web Dev for Astronomy Club (2023-2025) and Head of Technicals for Gaming Club (2024-2025) at IIT Indore. He also worked on PRIUS Fellowship (galaxy classification) and ISRO Challenge (ML for satellites)! See details: [NAVIGATE:vega]`,
    
    // Systems
    'alpha centauri': `Alpha Centauri (SYS-01) contains Vandan's personal info, education, interests, tech stack, achievements, resume, and certifications. 7 planets total! [NAVIGATE:alpha-centauri]`,
    'sirius': `Sirius (SYS-02) showcases all 8 projects with live demos and GitHub links! This is where you'll find his 3D Portfolio, Airbnb Replica, club websites, and more. [NAVIGATE:sirius]`,
    'vega': `Vega (SYS-03) displays his professional experience - leadership roles, research fellowships, and certifications. 5 planets covering his impressive journey! [NAVIGATE:vega]`,
    'betelgeuse': `Betelgeuse (SYS-04) is your communication hub - contact form and all Vandan's social links (LinkedIn, GitHub, email). [NAVIGATE:betelgeuse]`,
    'polaris': `Polaris (SYS-05) charts his career journey from foundation years to 3D web mastery, with milestones and achievements timeline! [NAVIGATE:polaris]`,
    'rigel': `Rigel (SYS-06) breaks down his technology stack: Frontend (React, Three.js), Backend (Node, Express, MongoDB), and DevOps tools. [NAVIGATE:rigel]`,
  };

  // Check for exact or partial matches
  for (const [key, answer] of Object.entries(quickAnswers)) {
    if (q.includes(key)) {
      return answer;
    }
  }

  // Enhanced pattern matching for variations
  if (q.match(/what.*(do|does|is).*vandan/)) {
    return quickAnswers['who is vandan'];
  }
  
  if (q.match(/how.*(contact|reach|email|message)/)) {
    return quickAnswers['contact'];
  }
  
  if (q.match(/what.*tech|stack|skills|technologies/)) {
    return quickAnswers['tech stack'];
  }
  
  if (q.match(/show.*projects?|projects?.*list|what.*built/)) {
    return quickAnswers['projects'];
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
