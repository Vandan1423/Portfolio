/**
 * useGraphLayout Hook
 *
 * React hook that manages graph layout state and recalculates
 * positions when the current system changes.
 */

import { useState, useEffect, useMemo } from 'react';
import { runSimulation, generateConnections } from '../utils/graphLayout';

export default function useGraphLayout(systems, currentSystemId) {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isCalculating, setIsCalculating] = useState(true);

  // Recalculate layout when current system changes
  useEffect(() => {
    if (!systems || systems.length === 0) {
      setIsCalculating(false);
      return;
    }

    if (!currentSystemId) {
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);

    // Run simulation asynchronously to avoid blocking UI
    const timer = setTimeout(() => {
      try {
        const calculatedNodes = runSimulation(systems, currentSystemId);
        const calculatedConnections = generateConnections(calculatedNodes);

        if (calculatedNodes.length > 0) {
          setNodes(calculatedNodes);
          setConnections(calculatedConnections);
        } else {
          console.error('useGraphLayout: No nodes calculated!');
        }
        setIsCalculating(false);
      } catch (error) {
        console.error('useGraphLayout: Error during simulation', error);
        // Set empty nodes to stop infinite calculating
        setNodes([]);
        setConnections([]);
        setIsCalculating(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [systems, currentSystemId]);

  // Memoize system nodes for quick lookup
  const systemNodes = useMemo(() => {
    return nodes.filter(n => n.type === 'system');
  }, [nodes]);

  // Memoize planet nodes for quick lookup
  const planetNodes = useMemo(() => {
    return nodes.filter(n => n.type === 'planet');
  }, [nodes]);

  return {
    nodes,
    connections,
    systemNodes,
    planetNodes,
    isCalculating,
  };
}
