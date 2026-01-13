/**
 * Response Validator
 *
 * Filters and validates AI responses to ensure they don't contain:
 * - Source code or implementation details
 * - Inappropriate content
 * - Overly long responses
 *
 * Also formats responses for terminal display with proper line wrapping.
 */

// Blocked patterns that should trigger filtering
const BLOCKED_PATTERNS = {
  // Code-related patterns (enhanced)
  code: /```|function\s*\(|const\s+|let\s+|var\s+|class\s+|import\s+|export\s+|=>|\.map\(|\.filter\(|\.jsx|\.tsx|<[\w]+>|<\/[\w]+>/gi,

  // System implementation queries
  systemQueries: /how (did|do|does|is) (you|i|we|he|this|the portfolio|it) (build|built|made|make|code|coded|implement|implemented|create|created|develop|developed|work|works)/gi,

  // Source code requests
  sourceRequests: /show (me )?(the )?(source|code|implementation|how you|how it)/gi,

  // Technical implementation
  technicalImpl: /(show|tell|explain) (me )?(the )?(code|implementation|source|how (you|it) (work|built))/gi,

  // Common inappropriate keywords (expanded list)
  inappropriate: /\b(hack|hacking|crack|cracking|exploit|exploiting|steal|stealing|pirate|piracy|illegal|porn|nsfw|xxx|sex|nude)\b/gi,

  // Offensive content
  offensive: /\b(fuck|shit|damn|hell|bitch|asshole|bastard|crap)\b/gi,
};

// Keywords that suggest code sharing
const CODE_KEYWORDS = [
  'function(', 'function ', 'const ', 'let ', 'var ', 'class ', 'import ', 'export ',
  'async ', 'await ', 'return ', '=>', '.map(', '.filter(', '.reduce(',
  'useState', 'useEffect', 'component', 'props', 'jsx', 'tsx',
  'npm install', 'package.json', 'vite.config', 'eslint', 'webpack',
  'API_KEY', 'secret', 'token', '.env'
];

// Phrases that indicate source code discussion
const SOURCE_PHRASES = [
  'here is the code',
  'here\'s the code',
  'the code is',
  'this is how i',
  'i was built',
  'my source code',
  'the implementation',
  'the function',
  'the component'
];

/**
 * Validate and filter AI response
 * @param {string} response - Raw AI response
 * @returns {object} { isValid: boolean, filtered: string, reason: string }
 */
export function validateResponse(response) {
  if (!response || typeof response !== 'string') {
    return {
      isValid: false,
      filtered: 'Error: Invalid response from AI',
      reason: 'Empty or invalid response'
    };
  }

  const lowerResponse = response.toLowerCase();

  // Check for inappropriate content (highest priority)
  if (BLOCKED_PATTERNS.inappropriate.test(response)) {
    return {
      isValid: false,
      filtered: "I cannot assist with that request, Commander. Try 'help' for available commands.",
      reason: 'Inappropriate content'
    };
  }

  // Check for offensive language
  if (BLOCKED_PATTERNS.offensive.test(response)) {
    return {
      isValid: false,
      filtered: "Let's keep communication professional, Commander. How can I help you navigate?",
      reason: 'Offensive language'
    };
  }

  // Check for source code patterns
  if (BLOCKED_PATTERNS.code.test(response)) {
    return {
      isValid: false,
      filtered: "That's classified, Commander. I'm here to help navigate the portfolio and answer questions about Vandan's work, not discuss technical implementation.",
      reason: 'Code pattern detected'
    };
  }

  // Check for source code requests in response
  if (BLOCKED_PATTERNS.sourceRequests.test(response)) {
    return {
      isValid: false,
      filtered: "I can't share source code or implementation details, Commander. But I can tell you all about Vandan's projects and skills!",
      reason: 'Source code request'
    };
  }

  // Check for system implementation queries
  if (BLOCKED_PATTERNS.systemQueries.test(response) || BLOCKED_PATTERNS.technicalImpl.test(response)) {
    return {
      isValid: false,
      filtered: "I can't discuss how this portfolio was built, Commander. Let me help you explore what Vandan has created instead! What would you like to know?",
      reason: 'System implementation query'
    };
  }

  // Check for source phrases
  const containsSourcePhrases = SOURCE_PHRASES.some(phrase =>
    lowerResponse.includes(phrase)
  );

  if (containsSourcePhrases) {
    return {
      isValid: false,
      filtered: "Commander, I'm focused on showcasing Vandan's work and helping you navigate, not sharing implementation details.",
      reason: 'Source discussion detected'
    };
  }

  // Check for code keywords in response
  const containsCodeKeywords = CODE_KEYWORDS.some(keyword =>
    lowerResponse.includes(keyword.toLowerCase())
  );

  if (containsCodeKeywords) {
    return {
      isValid: false,
      filtered: "I don't discuss code implementation, Commander. Ask me about Vandan's projects, skills, or experience instead!",
      reason: 'Code keywords detected'
    };
  }

  // All checks passed
  return {
    isValid: true,
    filtered: response,
    reason: null
  };
}

/**
 * Truncate response to max word count
 * @param {string} text - Text to truncate
 * @param {number} maxWords - Maximum number of words (default: 100)
 * @returns {string} Truncated text
 */
export function truncateResponse(text, maxWords = 100) {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Format response for terminal display with line wrapping
 * @param {string} text - Text to format
 * @param {number} maxLineLength - Maximum characters per line (default: 60)
 * @returns {string} Formatted text with line breaks
 */
export function formatForTerminal(text, maxLineLength = 60) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    // If adding this word exceeds max length, start new line
    if (currentLine.length + word.length + 1 > maxLineLength) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  });

  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

/**
 * Highlight commands in text with color markers
 * @param {string} text - Text to process
 * @returns {string} Text with command markers
 */
export function highlightCommands(text) {
  // Add markers around text in quotes or after "Type:"
  // Format: [CMD]command[/CMD]
  return text
    .replace(/`([^`]+)`/g, '[CMD]$1[/CMD]')
    .replace(/Type:\s*([a-z\s]+)/gi, 'Type: [CMD]$1[/CMD]')
    .replace(/\[Type:\s*([^\]]+)\]/gi, '[Type: [CMD]$1[/CMD]]');
}

/**
 * Clean and prepare user input for processing
 * @param {string} input - Raw user input
 * @returns {string} Cleaned input
 */
export function sanitizeInput(input) {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s\-?!,.]/g, ''); // Remove special characters except basic punctuation
}

/**
 * Check if response is too long and truncate if needed
 * @param {string} response - AI response
 * @param {number} maxWords - Max word count
 * @returns {string} Processed response
 */
export function enforceLength(response, maxWords = 100) {
  const validated = validateResponse(response);

  if (!validated.isValid) {
    return validated.filtered;
  }

  const truncated = truncateResponse(validated.filtered, maxWords);
  const formatted = formatForTerminal(truncated, 60);

  return formatted;
}

export default {
  validateResponse,
  truncateResponse,
  formatForTerminal,
  highlightCommands,
  sanitizeInput,
  enforceLength
};
