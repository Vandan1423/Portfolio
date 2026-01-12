/**
 * ARIA Button Component
 *
 * Animated floating button to open ARIA Terminal.
 * Features:
 * - Pulsing animation
 * - Tooltip on hover
 * - Click to open terminal
 * - Positioned in bottom-right corner
 */

import { useState } from 'react';
import { useAI } from '../../context/AIContext';
import styles from './ARIAButton.module.css';

export default function ARIAButton({ hide = false }) {
  const { openTerminal } = useAI();
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't render if hide prop is true
  if (hide) return null;

  return (
    <div className={styles.ariaButtonContainer}>
      {/* Tooltip */}
      {showTooltip && (
        <div className={styles.tooltip}>
          Ask ARIA for help
          <div className={styles.tooltipHint}>(Press 'T' or click)</div>
        </div>
      )}

      {/* Button */}
      <button
        className={styles.ariaButton}
        onClick={openTerminal}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Open ARIA Terminal"
      >
        {/* ARIA Icon/Badge */}
        <div className={styles.ariaBadge}>
          <div className={styles.ariaText}>ARIA</div>
          <div className={styles.ariaSubtext}>AI</div>
        </div>

        {/* Pulse rings */}
        <div className={styles.pulseRing}></div>
        <div className={styles.pulseRing2}></div>
      </button>
    </div>
  );
}
