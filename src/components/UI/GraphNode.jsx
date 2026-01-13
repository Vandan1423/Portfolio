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

export default function GraphNode({ node, nodes, onClick, isHovered, onHover, onLeave }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Find parent system for locked planets to show specific system name
  const getParentSystemPage = () => {
    if (node.type === 'planet' && node.isLocked && node.parentId) {
      const parentSystem = nodes?.find(n => n.id === node.parentId && n.type === 'system');
      return parentSystem?.data?.page || 'system';
    }
    return null;
  };

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
        r={node.type === 'system' ? 60 : 30}
      />

      {/* Current system glow effect */}
      {node.type === 'system' && node.isCurrent && (
        <>
          <circle
            className={styles.currentSystemGlow}
            r={80}
          />
          <circle
            className={styles.currentSystemPulse}
            r={100}
          />
        </>
      )}

      {/* Locked icon for locked planets */}
      {node.type === 'planet' && node.isLocked && (
        <text
          className={styles.lockIcon}
          textAnchor="middle"
          dy="0.35em"
          fontSize="22"
        >
          🔒
        </text>
      )}

      {/* System page name label - inside the circle */}
      {node.type === 'system' && (
        <text
          className={styles.systemCode}
          textAnchor="middle"
          dy="0.35em"
          fontSize="16"
          fontWeight="bold"
        >
          {node.data?.page || node.code}
        </text>
      )}

      {/* Node label below - OUTSIDE the circle, larger font */}
      {/* Show label only for systems and unlocked planets (hides locked planet labels to prevent overlap) */}
      {(node.type === 'system' || !node.isLocked) && (
        <>
          <text
            className={styles.nodeLabel}
            textAnchor="middle"
            dy={node.type === 'system' ? 90 : 55}
            fontSize={node.type === 'system' ? 18 : 15}
            fontWeight="500"
          >
            {node.label}
          </text>

          {/* "Click to visit" hint text below planet name */}
          {node.type === 'planet' && !node.isLocked && (
            <text
              className={styles.clickHint}
              textAnchor="middle"
              dy={70}
              fontSize="11"
              fontWeight="400"
              opacity="0.7"
            >
              Click to visit
            </text>
          )}

          {/* "Click to warp" hint text below system name */}
          {node.type === 'system' && !node.isCurrent && (
            <text
              className={styles.clickHint}
              textAnchor="middle"
              dy={108}
              fontSize="11"
              fontWeight="400"
              opacity="0.7"
            >
              Click to warp
            </text>
          )}
        </>
      )}

      {/* Tooltip on hover - wider for long text */}
      {showTooltip && (
        <g className={styles.tooltip}>
          <rect
            x={-140}
            y={-100}
            width={280}
            height={70}
            rx={8}
            className={styles.tooltipBg}
          />
          <text
            className={styles.tooltipTitle}
            textAnchor="middle"
            y={-75}
            fontSize="13"
            fontWeight="bold"
          >
            {node.label}
          </text>
          <text
            className={styles.tooltipText}
            textAnchor="middle"
            y={-52}
            fontSize="13"
          >
            {node.type === 'system' ?
              (node.isCurrent ? `Current: ${node.data?.page || 'System'}` : `${node.data?.page || 'System'} - Click to warp`) :
              (node.isLocked ? `Locked - Go to ${getParentSystemPage()} first` : 'Click to visit')
            }
          </text>
        </g>
      )}
    </g>
  );
}
