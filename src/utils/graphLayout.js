/**
 * Graph Layout Utilities
 *
 * Radial layout algorithm for positioning star systems and planets
 * in the Neural Link Map. Implements:
 * - Current system at center
 * - Other systems in circle around it
 * - Planets branch out from their parent systems
 * - Clean spacing, no overlaps
 */

const SIZES = {
  SYSTEM_RADIUS: 60,
  PLANET_RADIUS: 30,
  SYSTEM_ORBIT_RADIUS: 500, // Distance of other systems from center
  PLANET_DISTANCE: 220,     // Distance of planets from their system (increased for less overlap)
  PLANET_SPACING: 120,      // Angular spacing between planets
};

const VIEWPORT = {
  WIDTH: 2600,  // Larger viewport for bigger layout
  HEIGHT: 2600,
  PADDING: 150,
};

/**
 * Initialize node positions using radial layout
 * - Current system at center (0, 0)
 * - Other systems in circle around center
 * - Planets radiate out from their parent systems
 */
export function initializePositions(systems, currentSystemId) {
  const nodes = [];
  const systemNodes = [];

  // Separate current system from others
  const currentSystem = systems.find(s => s.id === currentSystemId);
  const otherSystems = systems.filter(s => s.id !== currentSystemId);

  // Place current system at center
  if (currentSystem) {
    const systemNode = {
      id: currentSystem.id,
      type: 'system',
      label: currentSystem.name,
      code: currentSystem.code,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      isCurrent: true,
      data: currentSystem,
    };
    nodes.push(systemNode);
    systemNodes.push(systemNode);

    // Add planets for current system radiating outward
    const planetCount = currentSystem.planets.length;
    currentSystem.planets.forEach((planet, i) => {
      const angle = (i / planetCount) * Math.PI * 2; // Full circle
      nodes.push({
        id: planet.id,
        type: 'planet',
        label: planet.name,
        x: Math.cos(angle) * SIZES.PLANET_DISTANCE,
        y: Math.sin(angle) * SIZES.PLANET_DISTANCE,
        vx: 0,
        vy: 0,
        parentId: currentSystem.id,
        isLocked: false,
        data: planet,
      });
    });
  }

  // Place other systems in circle around center
  const systemCount = otherSystems.length;
  otherSystems.forEach((system, i) => {
    const angle = (i / systemCount) * Math.PI * 2; // Evenly distributed
    const systemX = Math.cos(angle) * SIZES.SYSTEM_ORBIT_RADIUS;
    const systemY = Math.sin(angle) * SIZES.SYSTEM_ORBIT_RADIUS;

    const systemNode = {
      id: system.id,
      type: 'system',
      label: system.name,
      code: system.code,
      x: systemX,
      y: systemY,
      vx: 0,
      vy: 0,
      isCurrent: false,
      data: system,
    };
    nodes.push(systemNode);
    systemNodes.push(systemNode);

    // Add planets for this system radiating outward from system position
    const planetCount = system.planets.length;
    system.planets.forEach((planet, j) => {
      // Planets radiate outward from their parent system
      // Use smaller arc (120 degrees) on the outer side
      const baseAngle = angle; // System's angle from center
      const arcStart = baseAngle - Math.PI / 3; // -60 degrees
      const arcEnd = baseAngle + Math.PI / 3;   // +60 degrees
      const planetAngle = arcStart + (j / (planetCount - 1 || 1)) * (arcEnd - arcStart);

      const planetX = systemX + Math.cos(planetAngle) * SIZES.PLANET_DISTANCE;
      const planetY = systemY + Math.sin(planetAngle) * SIZES.PLANET_DISTANCE;

      nodes.push({
        id: planet.id,
        type: 'planet',
        label: planet.name,
        x: planetX,
        y: planetY,
        vx: 0,
        vy: 0,
        parentId: system.id,
        isLocked: true,
        data: planet,
      });
    });
  });

  return { nodes, systemNodes };
}

/**
 * No simulation needed for radial layout
 * Positions are fixed and calculated deterministically
 */
export function simulateStep(nodes) {
  // Return nodes as-is (no physics simulation)
  return nodes;
}

/**
 * Run layout (no simulation needed)
 */
export function runSimulation(systems, currentSystemId) {
  try {
    const { nodes } = initializePositions(systems, currentSystemId);
    // No simulation needed - positions are already final
    return nodes;
  } catch (error) {
    console.error('runSimulation: Error occurred', error);
    throw error;
  }
}

/**
 * Create connections between nodes
 */
export function generateConnections(nodes) {
  const connections = [];

  // Connect each planet to its parent system
  nodes.forEach(node => {
    if (node.type === 'planet') {
      connections.push({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        isLocked: node.isLocked,
      });
    }
  });

  return connections;
}

export default {
  initializePositions,
  simulateStep,
  runSimulation,
  generateConnections,
  SIZES,
  VIEWPORT,
};
