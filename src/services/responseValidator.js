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
  // Code-related patterns
  code: /```|function|const\s+|let\s+|var\s+|class\s+|import\s+|export\s+|=>|\.map\(|\.filter\(/gi,

  // System implementation queries
  systemQueries: /how (did|do) (you|i|we) (build|make|code|implement|create|develop)/gi,

  // Common inappropriate keywords (basic list)
  inappropriate: /\b(hack|crack|exploit|steal|pirate|illegal)\b/gi,
};

// Keywords that suggest code sharing
const CODE_KEYWORDS = [
  'function', 'const ', 'let ', 'var ', 'class ', 'import ', 'export ',
  'async ', 'await ', 'return ', '=>', '.map(', '.filter(', '.reduce(',
  'useState', 'useEffect', 'component', 'props', 'jsx'
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

  // Check for code patterns
  if (BLOCKED_PATTERNS.code.test(response)) {
    return {
      isValid: false,
      filtered: "That's classified, Commander. I'm here to help navigate the portfolio, not discuss technical implementation.",
      reason: 'Code pattern detected'
    };
  }

  // Check for system implementation queries
  if (BLOCKED_PATTERNS.systemQueries.test(response)) {
    return {
      isValid: false,
      filtered: "I can't discuss how this portfolio was built, Commander. Let me help you explore what it showcases instead!",
      reason: 'System implementation query'
    };
  }

  // Check for inappropriate content
  if (BLOCKED_PATTERNS.inappropriate.test(response)) {
    return {
      isValid: false,
      filtered: "I cannot assist with that request, Commander. Type 'help' for available commands.",
      reason: 'Inappropriate content'
    };
  }

  // Check for code keywords in response
  const containsCodeKeywords = CODE_KEYWORDS.some(keyword =>
    response.toLowerCase().includes(keyword)
  );

  if (containsCodeKeywords) {
    return {
      isValid: false,
      filtered: "Commander, I'm focused on navigation and information about the portfolio, not code implementation.",
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
