/**
 * Neural Link Map Component
 *
 * Visual graph navigation showing all star systems and planets.
 * Features:
 * - Current system at center
 * - Force-directed layout
 * - Interactive nodes (click to navigate)
 * - Locked planets in other systems
 * - "Ask ARIA" button for help
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useStarSystem } from '../../context/StarSystemContext';
import { useAI } from '../../context/AIContext';
import { STAR_SYSTEMS } from '../../data/starSystemsData';
import useGraphLayout from '../../hooks/useGraphLayout';
import GraphNode from './GraphNode';
import GraphConnection from './GraphConnection';
import styles from './NeuralLinkMap.module.css';

export default function NeuralLinkMap({ isVisible, onClose, onSystemTravel, onPlanetSelect }) {
  const { currentSystemId } = useStarSystem();
  const { openTerminal } = useAI();
  const [hoveredNode, setHoveredNode] = useState(null);

  // Convert STAR_SYSTEMS object to array (memoized to prevent infinite re-renders)
  const systemsArray = useMemo(() => Object.values(STAR_SYSTEMS), []);

  // Get graph layout
  const { nodes, connections, isCalculating } = useGraphLayout(systemsArray, currentSystemId);

  // Handle ESC key to close
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    if (node.type === 'system') {
      // System node clicked - trigger wormhole jump
      if (!node.isCurrent) {
        onSystemTravel(node.id);
        onClose();
      }
    } else if (node.type === 'planet') {
      // Planet node clicked
      if (node.isLocked) {
        // Show message that planet is locked
        // Could trigger ARIA terminal with message
        return;
      }

      // Navigate to planet
      onPlanetSelect(node.data);
      onClose();
    }
  }, [onSystemTravel, onPlanetSelect, onClose]);

  // Handle "Ask ARIA" button
  const handleAskARIA = () => {
    onClose();
    openTerminal();
  };

  if (!isVisible) return null;

  // Calculate viewBox to center the graph (much larger for better spacing)
  const viewBox = '-1500 -1000 3000 2000';

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapContainer}>
        {/* Header */}
        <div className={styles.mapHeader}>
          <div className={styles.headerTitle}>
            NEURAL LINK MAP - NAVIGATION INTERFACE
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close map"
          >
            ✕
          </button>
        </div>

        {/* SVG Graph */}
        <div className={styles.graphWrapper}>
          {isCalculating ? (
            <div className={styles.calculating}>
              <div className={styles.spinner}></div>
              <div className={styles.calculatingText}>
                Calculating neural pathways...
              </div>
            </div>
          ) : (
            <svg
              className={styles.graph}
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background grid (optional) */}
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="rgba(0, 255, 65, 0.05)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect x="-1500" y="-1000" width="3000" height="2000" fill="url(#grid)" />

              {/* Connections */}
              <g className={styles.connectionsLayer}>
                {connections.map(connection => (
                  <GraphConnection
                    key={connection.id}
                    connection={connection}
                    nodes={nodes}
                  />
                ))}
              </g>

              {/* Nodes */}
              <g className={styles.nodesLayer}>
                {nodes.map(node => (
                  <GraphNode
                    key={node.id}
                    node={node}
                    onClick={handleNodeClick}
                    isHovered={hoveredNode?.id === node.id}
                    onHover={setHoveredNode}
                    onLeave={() => setHoveredNode(null)}
                  />
                ))}
              </g>

              {/* Center marker */}
              <circle
                cx="0"
                cy="0"
                r="2"
                fill="rgba(0, 255, 65, 0.5)"
                className={styles.centerMarker}
              />
            </svg>
          )}
        </div>

        {/* Footer with instructions */}
        <div className={styles.mapFooter}>
          <div className={styles.instructions}>
            <span className={styles.instructionItem}>
              ⚪ System: Click to warp
            </span>
            <span className={styles.instructionItem}>
              🟢 Planet: Click to visit
            </span>
            <span className={styles.instructionItem}>
              🔒 Locked: Warp to system first
            </span>
          </div>
          <button
            className={styles.ariaButton}
            onClick={handleAskARIA}
          >
            Lost in space? Ask ARIA
          </button>
        </div>
      </div>

      {/* Scanline effect overlay */}
      <div className={styles.scanline}></div>
    </div>
  );
}
