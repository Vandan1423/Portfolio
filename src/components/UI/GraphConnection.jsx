/**
 * GraphConnection Component
 *
 * Renders connection lines between systems and planets with animated particles.
 * Features:
 * - Curved lines for visual appeal
 * - Animated data flow particles
 * - Different colors for locked/unlocked connections
 */

import { useMemo } from 'react';
import styles from './NeuralLinkMap.module.css';

export default function GraphConnection({ connection, nodes }) {
  // Find source and target nodes
  const sourceNode = useMemo(() =>
    nodes.find(n => n.id === connection.source),
    [nodes, connection.source]
  );

  const targetNode = useMemo(() =>
    nodes.find(n => n.id === connection.target),
    [nodes, connection.target]
  );

  if (!sourceNode || !targetNode) return null;

  // Use straight lines instead of curves to reduce visual clutter
  const pathData = `M ${sourceNode.x},${sourceNode.y} L ${targetNode.x},${targetNode.y}`;

  // Connection class based on locked state
  const connectionClass = connection.isLocked
    ? styles.lockedConnection
    : styles.activeConnection;

  return (
    <g className={styles.connectionGroup}>
      {/* Main connection line - thinner and more transparent to reduce clutter */}
      <path
        d={pathData}
        className={`${styles.connection} ${connectionClass}`}
        fill="none"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Remove animated particles to reduce visual noise */}
    </g>
  );
}
