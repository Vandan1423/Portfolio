/**
 * Navigation Intelligence Service
 * 
 * Advanced AI navigation system that intelligently determines navigation types
 */

import { STAR_SYSTEMS } from '../data/starSystemsData.js';

// Static pages mapping
const STATIC_PAGES = {
  'home': { page: 'home', route: '/' },
  'landing': { page: 'home', route: '/' },
  '3d portfolio': { page: '3d-portfolio', route: '/3d-portfolio' },
  '3d': { page: '3d-portfolio', route: '/3d-portfolio' },
  'portfolio': { page: '3d-portfolio', route: '/3d-portfolio' },
  'about': { page: 'about-me', route: '/about-me', system: 'alpha-centauri' },
  'about me': { page: 'about-me', route: '/about-me', system: 'alpha-centauri' },
  'projects': { page: 'projects', route: '/projects', system: 'sirius' },
  'experience': { page: 'experience', route: '/experience', system: 'vega' },
  'contact': { page: 'contact', route: '/contact', system: 'betelgeuse' },
  'journey': { page: 'journey', route: '/journey', system: 'polaris' },
  'technologies': { page: 'technologies', route: '/technologies', system: 'rigel' },
  'tech': { page: 'technologies', route: '/technologies', system: 'rigel' },
  'skills': { page: 'technologies', route: '/technologies', system: 'rigel' }
};

export function findStarSystem(query) {
  const q = query.toLowerCase().trim();
  
  return Object.values(STAR_SYSTEMS).find(system => {
    return (
      system.id === q ||
      system.name.toLowerCase() === q ||
      system.code.toLowerCase() === q ||
      system.page.toLowerCase() === q ||
      system.page.toLowerCase().replace(/ /g, '-') === q ||
      system.page.toLowerCase().replace(/ /g, '') === q
    );
  });
}

export function findPlanet(query, currentSystemId = null) {
  const q = query.toLowerCase().trim();
  
  if (currentSystemId && STAR_SYSTEMS[currentSystemId]) {
    const currentSystem = STAR_SYSTEMS[currentSystemId];
    const planet = currentSystem.planets.find(p =>
      p.id.toLowerCase() === q ||
      p.name.toLowerCase() === q ||
      p.name.toLowerCase().replace(/ /g, '-') === q ||
      p.sectionId === q
    );
    
    if (planet) {
      return { system: currentSystem, planet: planet, isSameSystem: true };
    }
  }
  
  for (const system of Object.values(STAR_SYSTEMS)) {
    const planet = system.planets.find(p =>
      p.id.toLowerCase() === q ||
      p.name.toLowerCase() === q ||
      p.name.toLowerCase().replace(/ /g, '-') === q ||
      p.sectionId === q
    );
    
    if (planet) {
      return { system: system, planet: planet, isSameSystem: system.id === currentSystemId };
    }
  }
  
  return null;
}

export function findStaticPage(query) {
  const q = query.toLowerCase().trim();
  return STATIC_PAGES[q] || null;
}

export function resolveNavigation(target, currentSystemId = null) {
  const cleanTarget = target.toLowerCase().trim();
  
  const system = findStarSystem(cleanTarget);
  if (system) {
    return {
      type: 'STAR_SYSTEM',
      action: 'INTER_SYSTEM_TRAVEL',
      systemId: system.id,
      systemName: system.name,
      description: `Initiating wormhole jump to ${system.name} (${system.page})`,
      command: `[NAVIGATE:${system.id}]`,
      needsWormhole: system.id !== currentSystemId
    };
  }
  
  const planetResult = findPlanet(cleanTarget, currentSystemId);
  if (planetResult) {
    const { system: targetSystem, planet, isSameSystem } = planetResult;
    
    if (isSameSystem) {
      return {
        type: 'PLANET_SAME_SYSTEM',
        action: 'PLANET_DETAIL',
        systemId: targetSystem.id,
        systemName: targetSystem.name,
        planetId: planet.id,
        planetName: planet.name,
        description: `Navigating to ${planet.name} in ${targetSystem.name}`,
        command: `[NAVIGATE_PLANET:${planet.id}]`,
        needsWormhole: false
      };
    } else {
      return {
        type: 'PLANET_OTHER_SYSTEM',
        action: 'INTER_SYSTEM_THEN_PLANET',
        systemId: targetSystem.id,
        systemName: targetSystem.name,
        planetId: planet.id,
        planetName: planet.name,
        description: `Initiating wormhole to ${targetSystem.name}, then navigating to ${planet.name}`,
        command: `[NAVIGATE:${targetSystem.id}:${planet.id}]`,
        needsWormhole: true
      };
    }
  }
  
  const page = findStaticPage(cleanTarget);
  if (page) {
    return {
      type: 'STATIC_PAGE',
      action: 'PAGE_NAVIGATION',
      page: page.page,
      route: page.route,
      systemId: page.system || null,
      description: `Navigating to ${page.page} page`,
      command: `[NAVIGATE_PAGE:${page.page}]`,
      needsWormhole: false
    };
  }
  
  return {
    type: 'NOT_FOUND',
    action: 'ERROR',
    target: target,
    description: `Location "${target}" not found in navigation database`,
    command: null,
    needsWormhole: false,
    suggestions: []
  };
}

export function createSuggestedResponse(answer, suggestedTarget, currentSystemId = null) {
  const navigation = resolveNavigation(suggestedTarget, currentSystemId);
  
  if (navigation.type === 'NOT_FOUND') {
    return { text: answer, hasSuggestion: false };
  }
  
  let suggestionText = '';
  
  switch (navigation.type) {
    case 'STAR_SYSTEM':
      suggestionText = `\n\n💫 Want to explore more? I can take you to the ${navigation.systemName} system. Type "yes" to visit!`;
      break;
    case 'PLANET_SAME_SYSTEM':
      suggestionText = `\n\n🌍 Want to see details? I can navigate to ${navigation.planetName}. Type "yes" to view!`;
      break;
    case 'PLANET_OTHER_SYSTEM':
      suggestionText = `\n\n🚀 Interested? I can jump to ${navigation.systemName} and show you ${navigation.planetName}. Type "yes" to travel!`;
      break;
    case 'STATIC_PAGE':
      suggestionText = `\n\n📄 Want to see more? I can open the ${navigation.page} page. Type "yes" to navigate!`;
      break;
  }
  
  return { text: answer + suggestionText, hasSuggestion: true, navigation: navigation };
}

export default {
  findStarSystem,
  findPlanet,
  findStaticPage,
  resolveNavigation,
  createSuggestedResponse
};
