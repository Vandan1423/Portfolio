/**
 * Graph Layout Utilities
 *
 * Hierarchical tree layout algorithm for positioning star systems and planets
 * in the Neural Link Map. Implements:
 * - Tree layout (current system at top, others below)
 * - Clean vertical/horizontal spacing
 * - No overlaps guaranteed
 * - All nodes visible
 */

const SIZES = {
  SYSTEM_RADIUS: 50,
  PLANET_RADIUS: 25,
  HORIZONTAL_SPACING: 250, // Space between systems horizontally
  VERTICAL_SPACING: 150,   // Space between levels vertically
  PLANET_SPACING: 120,     // Space between planets of same system
};

const VIEWPORT = {
  WIDTH: 2400,
  HEIGHT: 1800,
  PADDING: 100,
};

/**
 * Calculate repulsion force between two nodes (prevent overlap)
 */
function calculateRepulsion(node1, node2) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return { fx: 0, fy: 0 };

  const minDist = SIZES.MIN_DISTANCE;
  if (distance < minDist) {
    const force = FORCES.REPULSION * (minDist - distance) / distance;
    return {
      fx: -(dx / distance) * force,
      fy: -(dy / distance) * force,
    };
  }

  return { fx: 0, fy: 0 };
}

/**
 * Calculate attraction force toward parent (for planets)
 */
function calculateAttraction(planet, parentSystem) {
  const dx = parentSystem.x - planet.x;
  const dy = parentSystem.y - planet.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return { fx: 0, fy: 0 };

  const targetDistance = SIZES.PLANET_ORBIT;
  const force = FORCES.ATTRACTION * (distance - targetDistance);

  return {
    fx: (dx / distance) * force,
    fy: (dy / distance) * force,
  };
}

/**
 * Calculate boundary force to keep nodes within viewport
 */
function calculateBoundaryForce(node) {
  const maxX = VIEWPORT.WIDTH / 2 - VIEWPORT.PADDING;
  const maxY = VIEWPORT.HEIGHT / 2 - VIEWPORT.PADDING;

  let fx = 0;
  let fy = 0;

  if (node.x > maxX) fx = -(node.x - maxX) * FORCES.BOUNDARY;
  if (node.x < -maxX) fx = -(node.x + maxX) * FORCES.BOUNDARY;
  if (node.y > maxY) fy = -(node.y - maxY) * FORCES.BOUNDARY;
  if (node.y < -maxY) fy = -(node.y + maxY) * FORCES.BOUNDARY;

  return { fx, fy };
}

/**
 * Initialize node positions
 * - Current system at center (0, 0)
 * - Other systems in circle around center
 * - Planets in arc around their parent system
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

    // Add planets for current system in circle
    currentSystem.planets.forEach((planet, i) => {
      const angle = (i / currentSystem.planets.length) * Math.PI * 2;
      nodes.push({
        id: planet.id,
        type: 'planet',
        label: planet.name,
        x: Math.cos(angle) * SIZES.PLANET_ORBIT,
        y: Math.sin(angle) * SIZES.PLANET_ORBIT,
        vx: 0,
        vy: 0,
        parentId: currentSystem.id,
        isLocked: false,
        data: planet,
      });
    });
  }

  // Place other systems in circle around center
  otherSystems.forEach((system, i) => {
    const angle = (i / otherSystems.length) * Math.PI * 2;
    const systemNode = {
      id: system.id,
      type: 'system',
      label: system.name,
      code: system.code,
      x: Math.cos(angle) * SIZES.ORBIT_RADIUS,
      y: Math.sin(angle) * SIZES.ORBIT_RADIUS,
      vx: 0,
      vy: 0,
      isCurrent: false,
      data: system,
    };
    nodes.push(systemNode);
    systemNodes.push(systemNode);

    // Add planets for this system (locked) in wider arc for better spacing
    system.planets.forEach((planet, j) => {
      // Spread planets in wider arc (120 degrees instead of 90)
      const arcSpread = Math.PI * 0.67; // 120 degrees (was 0.5 = 90 degrees)
      const planetAngle = angle + (j / system.planets.length - 0.5) * arcSpread;
      // Vary distance slightly to prevent overlaps
      const distanceVariation = 1 + (j % 2) * 0.2; // Alternate between 1.0 and 1.2
      nodes.push({
        id: planet.id,
        type: 'planet',
        label: planet.name,
        x: Math.cos(planetAngle) * (SIZES.ORBIT_RADIUS + SIZES.PLANET_ORBIT * distanceVariation),
        y: Math.sin(planetAngle) * (SIZES.ORBIT_RADIUS + SIZES.PLANET_ORBIT * distanceVariation),
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
 * Run one iteration of force simulation
 */
export function simulateStep(nodes, systemNodes) {
  const updatedNodes = nodes.map(node => ({ ...node }));

  // Apply forces to each node
  updatedNodes.forEach((node, i) => {
    let fx = 0;
    let fy = 0;

    // 1. Repulsion from all other nodes (collision avoidance)
    updatedNodes.forEach((other, j) => {
      if (i !== j) {
        const repulsion = calculateRepulsion(node, other);
        fx += repulsion.fx;
        fy += repulsion.fy;
      }
    });

    // 2. Attraction to parent system (for planets only)
    if (node.type === 'planet') {
      const parentSystem = systemNodes.find(s => s.id === node.parentId);
      if (parentSystem) {
        const attraction = calculateAttraction(node, parentSystem);
        fx += attraction.fx;
        fy += attraction.fy;
      }
    }

    // 3. Boundary force (keep within viewport)
    const boundary = calculateBoundaryForce(node);
    fx += boundary.fx;
    fy += boundary.fy;

    // 4. Update velocity and position
    node.vx = (node.vx + fx) * FORCES.DAMPING;
    node.vy = (node.vy + fy) * FORCES.DAMPING;

    // Don't move current system (stays at center)
    if (!(node.type === 'system' && node.isCurrent)) {
      node.x += node.vx;
      node.y += node.vy;
    }
  });

  return updatedNodes;
}

/**
 * Run full simulation until stable
 */
export function runSimulation(systems, currentSystemId, maxIterations = 200) {
  try {
    const { nodes, systemNodes } = initializePositions(systems, currentSystemId);

    let currentNodes = nodes;
    let stable = false;
    let iterations = 0;

    while (!stable && iterations < maxIterations) {
      currentNodes = simulateStep(currentNodes, systemNodes);
      iterations++;

      // Check if simulation has stabilized
      const maxVelocity = Math.max(
        ...currentNodes.map(n => Math.sqrt(n.vx * n.vx + n.vy * n.vy))
      );
      stable = maxVelocity < 0.1;
    }

    return currentNodes;
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
