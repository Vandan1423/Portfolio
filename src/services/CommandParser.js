/**
 * Command Parser
 *
 * Parses user input and executes predefined terminal commands.
 * Commands are Unix-like (ls, cd, pwd) mixed with space navigation terminology.
 */

import { STAR_SYSTEMS } from '../data/starSystemsData.js';
import knowledgeBase from '../data/aiKnowledgeBase.json' with { type: 'json' };

/**
 * Intelligent mapping of common terms to star systems and planets
 * This allows natural language navigation like "visit projects" -> "visit sirius"
 */
const SYSTEM_ALIASES = {
  // Alpha Centauri (About Me)
  'about': 'alpha-centauri',
  'about me': 'alpha-centauri',
  'aboutme': 'alpha-centauri',
  'personal': 'alpha-centauri',
  'bio': 'alpha-centauri',
  'profile': 'alpha-centauri',
  'info': 'alpha-centauri',
  'introduction': 'alpha-centauri',
  
  // Sirius (Projects)
  'projects': 'sirius',
  'project': 'sirius',
  'portfolio': 'sirius',
  'work': 'sirius',
  'builds': 'sirius',
  'creations': 'sirius',
  
  // Vega (Experience)
  'experience': 'vega',
  'exp': 'vega',
  'career': 'vega',
  'professional': 'vega',
  'job': 'vega',
  'jobs': 'vega',
  'roles': 'vega',
  'positions': 'vega',
  
  // Betelgeuse (Contact)
  'contact': 'betelgeuse',
  'reach': 'betelgeuse',
  'message': 'betelgeuse',
  'connect': 'betelgeuse',
  'email': 'betelgeuse',
  'social': 'betelgeuse',
  
  // Polaris (Journey)
  'journey': 'polaris',
  'timeline': 'polaris',
  'path': 'polaris',
  'milestones': 'polaris',
  'story': 'polaris',
  
  // Rigel (Technologies)
  'technologies': 'rigel',
  'tech': 'rigel',
  'skills': 'rigel',
  'stack': 'rigel',
  'tools': 'rigel',
  'expertise': 'rigel'
};

/**
 * Intelligent mapping for planets/sections within systems
 * Format: 'search-term': { system: 'system-id', planet: 'planet-id' }
 */
const PLANET_ALIASES = {
  // Alpha Centauri planets
  'education': { system: 'alpha-centauri', planet: 'education' },
  'edu': { system: 'alpha-centauri', planet: 'education' },
  'school': { system: 'alpha-centauri', planet: 'education' },
  'college': { system: 'alpha-centauri', planet: 'education' },
  'interests': { system: 'alpha-centauri', planet: 'interests' },
  'hobbies': { system: 'alpha-centauri', planet: 'interests' },
  'achievements': { system: 'alpha-centauri', planet: 'achievements' },
  'resume': { system: 'alpha-centauri', planet: 'resume' },
  'cv': { system: 'alpha-centauri', planet: 'resume' },
  'certifications': { system: 'alpha-centauri', planet: 'certifications' },
  'certificates': { system: 'alpha-centauri', planet: 'certifications' },
  
  // Sirius planets (Projects)
  '3d portfolio': { system: 'sirius', planet: 'project-1' },
  'airbnb': { system: 'sirius', planet: 'project-2' },
  'gaming club': { system: 'sirius', planet: 'project-3' },
  'astronomy club': { system: 'sirius', planet: 'project-4' },
  'astro club': { system: 'sirius', planet: 'project-4' },
  'educonnect': { system: 'sirius', planet: 'project-5' },
  'academic portal': { system: 'sirius', planet: 'project-5' },
  'simon says': { system: 'sirius', planet: 'project-6' },
  'spotify': { system: 'sirius', planet: 'project-7' },
  'amazon': { system: 'sirius', planet: 'project-8' },
  
  // Vega planets (Experience)
  'astronomy': { system: 'vega', planet: 'exp-1' },
  'gaming': { system: 'vega', planet: 'exp-2' },
  'prius': { system: 'vega', planet: 'exp-3' },
  'isro': { system: 'vega', planet: 'exp-4' },
  
  // Rigel planets (Technologies)
  'frontend': { system: 'rigel', planet: 'frontend-tech' },
  'backend': { system: 'rigel', planet: 'backend-tech' },
  'devops': { system: 'rigel', planet: 'tools-tech' }
};

/**
 * Intelligently resolve a navigation target from natural language
 * @param {string} target - User's navigation target (e.g., "projects", "experience page")
 * @returns {object} { type: 'system'|'planet', systemId, planetId }
 */
export function resolveNavigationTarget(target) {
  const normalized = target.toLowerCase()
    .replace(/\s+page$/, '') // Remove "page" suffix
    .replace(/\s+section$/, '') // Remove "section" suffix
    .trim();
  
  // First, check if it's a planet alias (more specific)
  for (const [alias, mapping] of Object.entries(PLANET_ALIASES)) {
    if (normalized.includes(alias)) {
      return {
        type: 'planet',
        systemId: mapping.system,
        planetId: mapping.planet
      };
    }
  }
  
  // Then check system aliases
  for (const [alias, systemId] of Object.entries(SYSTEM_ALIASES)) {
    if (normalized.includes(alias)) {
      return {
        type: 'system',
        systemId,
        planetId: null
      };
    }
  }
  
  // Finally, try direct system/planet matching from STAR_SYSTEMS
  for (const [systemId, system] of Object.entries(STAR_SYSTEMS)) {
    // Check system name/id match
    if (normalized.includes(system.name.toLowerCase()) || 
        normalized.includes(systemId) ||
        normalized.includes(system.page.toLowerCase())) {
      return {
        type: 'system',
        systemId,
        planetId: null
      };
    }
    
    // Check planet names
    const planet = system.planets.find(p => 
      normalized.includes(p.name.toLowerCase()) ||
      normalized.includes(p.id)
    );
    
    if (planet) {
      return {
        type: 'planet',
        systemId,
        planetId: planet.id
      };
    }
  }
  
  return null;
}

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
    isCommand: isCommandFunction(input)
  };
}

/**
 * Check if input matches a known command
 * @param {string} input - User input
 * @returns {boolean} True if input is a command
 */
export function isCommand(input) {
  return isCommandFunction(input);
}

/**
 * Internal function to check if input is a command
 * @param {string} input - User input
 * @returns {boolean} True if input matches a command
 */
function isCommandFunction(input) {
  const cleaned = input.trim().toLowerCase();
  const firstWord = cleaned.split(' ')[0];

  return Object.keys(COMMANDS).includes(firstWord) ||
         Object.values(COMMANDS).some(cmd => cmd.aliases?.includes(cleaned));
}

// Note: The actual COMMANDS registry and execute functions will be
// implemented in the terminal component with access to navigation context
// This file provides the parsing logic only

export default {
  parseCommand,
  isCommand,
  resolveNavigationTarget
};
