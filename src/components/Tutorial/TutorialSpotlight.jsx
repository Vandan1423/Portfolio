import { useState, useEffect, useRef } from 'react';
import styles from './TutorialSpotlight.module.css';

/**
 * TutorialSpotlight Component
 *
 * Creates a dark overlay with a highlighted cutout for a target UI element
 * Features:
 * - SVG mask for precise spotlight effect
 * - Glowing cyan border around target
 * - Animated arrow pointing to element
 * - Auto-repositions on window resize
 * - Controls pointer events (allow/block interaction with target)
 */

const TutorialSpotlight = ({
  targetElement,
  arrow = 'down',
  allowInteraction = false,
  padding = 20,
  onBoundsCalculated = null // Callback to expose target bounds
}) => {
  const [targetBounds, setTargetBounds] = useState(null);
  const [arrowPosition, setArrowPosition] = useState(null);
  const overlayRef = useRef(null);

  // Calculate target element position and dimensions
  const calculateTargetBounds = () => {
    try {
      const element = document.querySelector(targetElement);

      if (!element) {
        console.warn(`Tutorial spotlight: Element "${targetElement}" not found`);
        return null;
      }

      const rect = element.getBoundingClientRect();

      // Add padding around element
      const bounds = {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2),
        borderRadius: 8
      };

      // Calculate arrow position based on arrow direction
      let arrowPos = {};
      const arrowOffset = 60; // Distance from element

      switch (arrow) {
        case 'up':
          arrowPos = {
            x: rect.left + rect.width / 2,
            y: rect.bottom + arrowOffset,
            rotation: 0 // Triangle points up (default)
          };
          break;
        case 'down':
          arrowPos = {
            x: rect.left + rect.width / 2,
            y: rect.top - arrowOffset,
            rotation: 180 // Triangle points down
          };
          break;
        case 'left':
          arrowPos = {
            x: rect.right + arrowOffset,
            y: rect.top + rect.height / 2,
            rotation: -90 // Triangle points left
          };
          break;
        case 'right':
          arrowPos = {
            x: rect.left - arrowOffset,
            y: rect.top + rect.height / 2,
            rotation: 90 // Triangle points right
          };
          break;
        default:
          arrowPos = {
            x: rect.left + rect.width / 2,
            y: rect.top - arrowOffset,
            rotation: 180
          };
      }

      setTargetBounds(bounds);
      setArrowPosition(arrowPos);

      // Call callback to expose bounds to parent
      if (onBoundsCalculated) {
        onBoundsCalculated(bounds);
      }

      return bounds;
    } catch (error) {
      console.error('Error calculating spotlight bounds:', error);
      return null;
    }
  };

  // Calculate bounds on mount and when target changes
  useEffect(() => {
    // Initial calculation with small delay to ensure element is rendered
    const timer = setTimeout(() => {
      calculateTargetBounds();
    }, 100);

    return () => clearTimeout(timer);
  }, [targetElement]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      calculateTargetBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetElement]);

  // Recalculate periodically (in case of dynamic content)
  useEffect(() => {
    const interval = setInterval(() => {
      calculateTargetBounds();
    }, 500);

    return () => clearInterval(interval);
  }, [targetElement]);

  // Don't render if target not found
  if (!targetBounds) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.spotlight}
      style={{
        pointerEvents: allowInteraction ? 'none' : 'auto'
      }}
    >
      {/* SVG mask for spotlight effect */}
      <svg
        className={styles.svg}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White fills the mask, black creates cutout */}
            <rect fill="white" width="100%" height="100%" />
            <rect
              fill="black"
              x={targetBounds.x}
              y={targetBounds.y}
              width={targetBounds.width}
              height={targetBounds.height}
              rx={targetBounds.borderRadius}
            />
          </mask>
        </defs>

        {/* Dark overlay with mask applied */}
        <rect
          fill="rgba(0, 0, 0, 0.85)"
          width="100%"
          height="100%"
          mask="url(#spotlight-mask)"
        />

        {/* Glowing border around target */}
        <rect
          className={styles.highlightBorder}
          x={targetBounds.x}
          y={targetBounds.y}
          width={targetBounds.width}
          height={targetBounds.height}
          rx={targetBounds.borderRadius}
          fill="none"
          stroke="#00ffff"
          strokeWidth="3"
        />
      </svg>

      {/* Animated arrow */}
      {arrowPosition && (
        <div
          className={styles.arrow}
          style={{
            left: `${arrowPosition.x}px`,
            top: `${arrowPosition.y}px`,
            transform: `translate(-50%, -50%) rotate(${arrowPosition.rotation}deg)`
          }}
        >
          <div className={styles.arrowShape}></div>
        </div>
      )}

      {/* Invisible click-through overlay for target element (if interaction allowed) */}
      {allowInteraction && (
        <div
          className={styles.interactionZone}
          style={{
            left: `${targetBounds.x}px`,
            top: `${targetBounds.y}px`,
            width: `${targetBounds.width}px`,
            height: `${targetBounds.height}px`,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            // Allow clicks to pass through to target element
            e.stopPropagation();
            const targetEl = document.querySelector(targetElement);
            if (targetEl) {
              targetEl.click();
            }
          }}
        />
      )}
    </div>
  );
};

export default TutorialSpotlight;
