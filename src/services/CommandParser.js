/**
 * Command Parser
 *
 * Parses user input and executes predefined terminal commands.
 * Commands are Unix-like (ls, cd, pwd) mixed with space navigation terminology.
 */

import { STAR_SYSTEMS } from '../data/starSystemsData.js';
import knowledgeBase from '../data/aiKnowledgeBase.json' with { type: 'json' };

/**
 * Command registry with all available commands
 */
const COMMANDS = {
  // Navigation commands
  systems: {
    aliases: ['systems', 'ls', 'list'],
    description: 'List all 6 star systems',
    action: 'listSystems'
  },
  planets: {
    aliases: ['planets', 'ls planets'],
    description: 'List planets in current system',
    action: 'listPlanets'
  },
  goto: {
    aliases: ['goto', 'travel', 'jump', 'warp'],
    args: ['system-name'],
    description: 'Travel to a star system',
    action: 'gotoSystem'
  },
  visit: {
    aliases: ['visit', 'go', 'nav', 'open'],
    args: ['planet-name'],
    description: 'Navigate to a specific planet'
  },
  back: {
    aliases: ['back', 'cd ..', 'return'],
    description: 'Return to previous location'
  },
  home: {
    aliases: ['home'],
    description: 'Return to Alpha Centauri (starting system)'
  },
  map: {
    aliases: ['map'],
    description: 'Open Neural Link visualization'
  },

  // Info commands
  where: {
    aliases: ['pwd', 'location'],
    action: 'showLocation'
  },
  history: {
    action: 'showHistory'
  },
  about: {
    action: 'showAbout',
    takesArgs: true
  },
  search: {
    aliases: ['find'],
    action: 'search',
    requiresArgs: true
  },

  // Utility commands
  help: {
    aliases: [],
    action: 'showHelp'
  },
  clear: {
    aliases: ['cls'],
    action: 'clearTerminal'
  },
  exit: {
    aliases: ['quit', 'close'],
    action: 'closeTerminal'
  },
  tutorial: {
    aliases: ['tut'],
    action: 'restartTutorial'
  },
  map: {
    aliases: [],
    action: 'openNeuralMap'
  }
};

/**
 * Parse user input and extract command + arguments
 * @param {string} input - User input string
 * @returns {object} { command: string, args: array, raw: string }
 */
export function parseCommand(input) {
  const cleaned = input.trim().toLowerCase();
  const parts = cleaned.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  return {
    command: command,
    args,
    raw: input.trim(),
    isCommand: isCommand(input)
  };
}

/**
 * Check if input matches a known command
 * @param {string} input - User input
 * @returns {boolean} True if input is a command
 */
export function isCommand(input) {
  const cleaned = input.trim().toLowerCase();
  const firstWord = cleaned.split(' ')[0];

  return Object.keys(COMMANDS).includes(firstWord) ||
         Object.values(COMMANDS).some(cmd => cmd.aliases?.includes(cleaned));
}

/**
 * Parse user input into command and arguments
 * @param {string} input - User input string
 * @returns {object} { command: string, args: string[], raw: string }
 */
export function parseCommand(input) {
  const cleaned = input.trim().toLowerCase();
  const parts = cleaned.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  return {
    command,
    args,
    raw: input.trim()
  };
}

/**
 * Check if input is a recognized command
 * @param {string} input - User input
 * @returns {boolean} True if input matches a command
 */
export function isCommand(input) {
  const { command } = parseCommand(input);
  return COMMANDS.hasOwnProperty(command) || COMMAND_ALIASES[command];
}

/**
 * Parse user input into command and arguments
 * @param {string} input - Raw user input
 * @returns {object} { command: string, args: string[], raw: string }
 */
export function parseCommand(input) {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  return {
    command,
    args,
    raw: input
  };
}

/**
 * Check if input is a predefined command
 * @param {string} input - User input
 * @returns {boolean}
 */
export function isCommand(input) {
  const cleaned = input.trim().toLowerCase();
  const firstWord = cleaned.split(' ')[0];

  // Check if it matches any command or alias
  for (const [cmd, config] of Object.entries(COMMANDS)) {
    if (cmd === firstWord(input) || config.aliases?.includes(firstWord)) {
      return true;
    }
  }

  return false;
}

// Note: The actual COMMANDS registry and execute functions will be
// implemented in the terminal component with access to navigation context
// This file provides the parsing logic only

export default {
  parseCommand,
  fuzzyMatch,
  suggestCommand,
  isCommand
};
