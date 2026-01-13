/**
 * Sagittarius Button Component
 *
 * Animated floating button to open Sagittarius Terminal.
 * Features:
 * - Pulsing animation
 * - Tooltip on hover
 * - Click to open terminal
 * - Positioned in bottom-right corner
 */

import { useState } from 'react';
import { useAI } from '../../context/AIContext';
import styles from './SagittariusButton.module.css';

export default function SagittariusButton({ hide = false }) {
  const { openTerminal } = useAI();
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't render if hide prop is true
  if (hide) return null;

  return (
    <div className={styles.sagittariusButtonContainer}>
      {/* Tooltip */}
      {showTooltip && (
        <div className={styles.tooltip}>
          Ask Sagittarius for help
          <div className={styles.tooltipHint}>(Press 'T' or click)</div>
        </div>
      )}

      {/* Button */}
      <button
        className={styles.sagittariusButton}
        onClick={openTerminal}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Open Sagittarius Terminal"
      >
        {/* Sagittarius Icon/Badge */}
        <div className={styles.sagittariusBadge}>
          <div className={styles.sagittariusText}>SGTR</div>
          <div className={styles.sagittariusSubtext}>AI</div>
        </div>

        {/* Pulse rings */}
        <div className={styles.pulseRing}></div>
        <div className={styles.pulseRing2}></div>
      </button>
    </div>
  );
}
