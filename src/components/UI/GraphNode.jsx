/**
 * GraphNode Component
 *
 * Renders individual nodes (systems or planets) in the Neural Link Map.
 * Features:
 * - Different styles for systems vs planets
 * - Visual states: current, locked, unlocked, hovered
 * - Click handlers for navigation
 * - Tooltips on hover
 */

import { useState } from 'react';
import styles from './NeuralLinkMap.module.css';

export default function GraphNode({ node, onClick, isHovered, onHover, onLeave }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onHover?.(node);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onLeave?.();
  };

  const handleClick = () => {
    if (node.isLocked && node.type === 'planet') {
      // Show message that planet is locked
      return;
    }
    onClick?.(node);
  };

  // Determine node class based on type and state
  const getNodeClass = () => {
    const classes = [styles.node];

    if (node.type === 'system') {
      classes.push(styles.systemNode);
      if (node.isCurrent) {
        classes.push(styles.currentSystem);
      }
    } else {
      classes.push(styles.planetNode);
      if (node.isLocked) {
        classes.push(styles.lockedPlanet);
      } else {
        classes.push(styles.unlockedPlanet);
      }
    }

    if (isHovered) {
      classes.push(styles.hoveredNode);
    }

    return classes.join(' ');
  };

  // Determine if node is clickable
  const isClickable = node.type === 'system' || !node.isLocked;
  const cursor = isClickable ? 'pointer' : 'not-allowed';

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor }}
      className={styles.nodeGroup}
    >
      {/* Node circle - larger for better visibility */}
      <circle
        className={getNodeClass()}
        r={node.type === 'system' ? 50 : 25}
      />

      {/* Current system glow effect */}
      {node.type === 'system' && node.isCurrent && (
        <>
          <circle
            className={styles.currentSystemGlow}
            r={65}
          />
          <circle
            className={styles.currentSystemPulse}
            r={80}
          />
        </>
      )}

      {/* Locked icon for locked planets */}
      {node.type === 'planet' && node.isLocked && (
        <text
          className={styles.lockIcon}
          textAnchor="middle"
          dy="0.35em"
          fontSize="18"
        >
          🔒
        </text>
      )}

      {/* System code label */}
      {node.type === 'system' && (
        <text
          className={styles.systemCode}
          textAnchor="middle"
          dy="0.35em"
          fontSize="16"
          fontWeight="bold"
        >
          {node.code}
        </text>
      )}

      {/* Node label below - larger font */}
      <text
        className={styles.nodeLabel}
        textAnchor="middle"
        dy={node.type === 'system' ? 75 : 45}
        fontSize={node.type === 'system' ? 16 : 13}
      >
        {node.label}
      </text>

      {/* Tooltip on hover */}
      {showTooltip && (
        <g className={styles.tooltip}>
          <rect
            x={-80}
            y={-90}
            width={160}
            height={60}
            rx={8}
            className={styles.tooltipBg}
          />
          <text
            className={styles.tooltipTitle}
            textAnchor="middle"
            y={-70}
            fontSize="12"
            fontWeight="bold"
          >
            {node.label}
          </text>
          <text
            className={styles.tooltipText}
            textAnchor="middle"
            y={-50}
            fontSize="10"
          >
            {node.type === 'system' ?
              (node.isCurrent ? 'Current System' : 'Click to warp') :
              (node.isLocked ? `Locked - Warp to ${node.data.system || 'system'} first` : 'Click to visit')
            }
          </text>
        </g>
      )}
    </g>
  );
}
