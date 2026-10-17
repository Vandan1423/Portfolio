/**
 * Neural Link Map Component
 *
 * Visual graph navigation showing all star systems and planets.
 * Features:
 * - Current system at center
 * - Draggable/pannable map
 * - Interactive nodes (click to navigate)
 * - Confirmation modal for system travel
 * - Locked planets in other systems
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useStarSystem } from '../../context/StarSystemContext';
import { STAR_SYSTEMS } from '../../data/starSystemsData';
import useGraphLayout from '../../hooks/useGraphLayout';
import GraphNode from './GraphNode';
import GraphConnection from './GraphConnection';
import styles from './NeuralLinkMap.module.css';

export default function NeuralLinkMap({ isVisible, onClose, onSystemTravel, onPlanetSelect }) {
  const { currentSystemId } = useStarSystem();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [confirmSystem, setConfirmSystem] = useState(null); // System awaiting confirmation

  // Pan/Zoom state
  const [viewBox, setViewBox] = useState({ x: -400, y: -550, width: 1000, height: 1000 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  // Convert STAR_SYSTEMS object to array (memoized to prevent infinite re-renders)
  const systemsArray = useMemo(() => Object.values(STAR_SYSTEMS), []);

  // Get graph layout
  const { nodes, connections, isCalculating } = useGraphLayout(systemsArray, currentSystemId);

  // Handle ESC key to close
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (confirmSystem) {
          setConfirmSystem(null); // Close modal first
        } else {
          onClose(); // Then close map
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose, confirmSystem]);

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      setIsPanning(true);
      setStartPan({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;

    const dx = e.clientX - startPan.x;
    const dy = e.clientY - startPan.y;

    // Calculate scale factor (viewBox to screen)
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;

    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx * scaleX,
      y: prev.y - dy * scaleY,
    }));

    setStartPan({ x: e.clientX, y: e.clientY });
  }, [isPanning, startPan, viewBox.width, viewBox.height]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom handlers
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

    setViewBox(prev => {
      const newWidth = prev.width * zoomFactor;
      const newHeight = prev.height * zoomFactor;

      // Keep zoom centered
      const centerX = prev.x + prev.width / 2;
      const centerY = prev.y + prev.height / 2;

      return {
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,
      };
    });
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    if (node.type === 'system') {
      // System node clicked - show confirmation modal
      if (!node.isCurrent) {
        setConfirmSystem(node);
      }
    } else if (node.type === 'planet') {
      // Planet node clicked - navigate directly (no confirmation)
      if (node.isLocked) {
        return; // Locked planet, do nothing
      }

      // Navigate to planet
      onPlanetSelect(node.data);
      onClose();
    }
  }, [onPlanetSelect, onClose]);

  // Confirm system travel
  const handleConfirmTravel = useCallback(() => {
    if (confirmSystem) {
      // Tutorial: Step 7 (NAVIGATE_DIFFERENT_PAGE) -> Step 8 happens after wormhole completes
      // The actual transition to NEW_SYSTEM_ARRIVAL happens in App.jsx after wormhole animation

      onSystemTravel(confirmSystem.id);
      setConfirmSystem(null);
      onClose();
    }
  }, [confirmSystem, onSystemTravel, onClose]);

  // Cancel system travel
  const handleCancelTravel = useCallback(() => {
    setConfirmSystem(null);
  }, []);

  if (!isVisible) return null;

  const viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapContainer}>
        {/* Header */}
        <div className={styles.mapHeader}>
          <div className={styles.headerTitle}>
            Map
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close map"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content Area - Graph + Guide Panel */}
        <div className={styles.mapContent}>
          {/* Navigation Guide Panel */}
          <div className={styles.guidePanel}>
            <div className={styles.guidePanelHeader}>
              <span className={styles.guidePanelTitle}>How to navigate</span>
            </div>
            
            <div className={styles.guidePanelItems}>
              <div className={styles.guidePanelItem}>
                <div className={styles.itemIcon}>
                  <span className={styles.systemDot}></span>
                </div>
                <div className={styles.itemText}>
                  <span className={styles.itemTitle}>Star systems</span>
                  <span className={styles.itemDesc}>Large circles are pages. Click one to travel there.</span>
                </div>
              </div>

              <div className={styles.guidePanelItem}>
                <div className={styles.itemIcon}>
                  <span className={styles.planetDot}></span>
                </div>
                <div className={styles.itemText}>
                  <span className={styles.itemTitle}>Planets</span>
                  <span className={styles.itemDesc}>Small circles are sections. Click one to open it.</span>
                </div>
              </div>

              <div className={styles.guidePanelItem}>
                <div className={styles.itemIcon}>
                  <span className={styles.lockedDot}></span>
                </div>
                <div className={styles.itemText}>
                  <span className={styles.itemTitle}>Locked</span>
                  <span className={styles.itemDesc}>Travel to that system first to open its sections.</span>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className={styles.controlsSection}>
              <div className={styles.controlsSectionTitle}>Controls</div>
              <div className={styles.controlsList}>
                <div className={styles.controlItem}>
                  <span className={styles.controlKey}>Drag</span>
                  <span className={styles.controlAction}>Pan around</span>
                </div>
                <div className={styles.controlItem}>
                  <span className={styles.controlKey}>Scroll</span>
                  <span className={styles.controlAction}>Zoom</span>
                </div>
                <div className={styles.controlItem}>
                  <span className={styles.controlKey}>Click</span>
                  <span className={styles.controlAction}>Visit node</span>
                </div>
                <div className={styles.controlItem}>
                  <span className={styles.controlKey}>Esc</span>
                  <span className={styles.controlAction}>Close map</span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Graph */}
          <div className={styles.graphWrapper}>
          {isCalculating ? (
            <div className={styles.calculating}>
              <div className={styles.spinner}></div>
              <div className={styles.calculatingText}>
                Loading the map…
              </div>
            </div>
          ) : (
            <svg
              ref={svgRef}
              className={styles.graph}
              viewBox={viewBoxString}
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
              {/* Background grid */}
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
                    stroke="rgb(255 255 255 / 0.03)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#grid)" />

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
                    nodes={nodes}
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
                fill="rgb(255 255 255 / 0.2)"
                className={styles.centerMarker}
              />
            </svg>
          )}
        </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmSystem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Travel to {confirmSystem.data?.page}?</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.systemInfo}>
                <div className={styles.systemName}>{confirmSystem.label}</div>
                <div className={styles.systemPage}>{confirmSystem.data?.page}</div>
              </div>
              <p className={styles.warning}>
                The ship jumps through a wormhole to get there.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelTravel}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmTravel}
              >
                Travel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
