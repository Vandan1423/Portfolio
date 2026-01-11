import { useState, useEffect, useRef } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import styles from './MissionBriefing.module.css';

/**
 * MissionBriefing Component
 *
 * Displays Commander ARIA's mission directives in a styled panel
 * Features:
 * - Typewriter effect for messages
 * - Progress bar
 * - Commander badge (clickable for easter egg)
 * - Keyboard-highlighted keys
 * - Scan line animation
 * - Multiple positions
 */

const MissionBriefing = ({
  message,
  objective,
  progress,
  action,
  position = 'bottom-center',
  compact = false,
  celebration = false,
  targetBounds = null // Bounds of highlighted element for intelligent positioning
}) => {
  const { nextStep, skipTutorial, currentStep, completeTutorial, discoverEasterEgg } = useTutorial();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [computedPosition, setComputedPosition] = useState(null);
  const messageRef = useRef(message);
  const panelRef = useRef(null);

  // Intelligent positioning based on target bounds
  useEffect(() => {
    if (!targetBounds || !panelRef.current) {
      setComputedPosition(null);
      return;
    }

    const calculateBestPosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = 500; // From CSS
      const panelHeight = panelRef.current.offsetHeight || 300;
      const margin = 30;

      // Calculate available space in each direction
      const spaceAbove = targetBounds.y;
      const spaceBelow = viewportHeight - (targetBounds.y + targetBounds.height);
      const spaceLeft = targetBounds.x;
      const spaceRight = viewportWidth - (targetBounds.x + targetBounds.width);

      // Determine best vertical position
      let top, bottom;
      if (spaceBelow >= panelHeight + margin && spaceBelow > spaceAbove) {
        // Position below target
        top = targetBounds.y + targetBounds.height + margin;
        bottom = 'auto';
      } else if (spaceAbove >= panelHeight + margin) {
        // Position above target
        bottom = viewportHeight - targetBounds.y + margin;
        top = 'auto';
      } else if (spaceBelow > spaceAbove) {
        // Not enough space, but below is better
        top = targetBounds.y + targetBounds.height + margin;
        bottom = 'auto';
      } else {
        // Not enough space, but above is better
        top = margin;
        bottom = 'auto';
      }

      // Determine best horizontal position
      let left, right;
      const targetCenter = targetBounds.x + targetBounds.width / 2;

      // Try to center on target first
      if (targetCenter - panelWidth / 2 >= margin &&
          targetCenter + panelWidth / 2 <= viewportWidth - margin) {
        // Can center on target
        left = targetCenter - panelWidth / 2;
        right = 'auto';
      } else if (spaceRight >= panelWidth + margin) {
        // Position to the right
        left = targetBounds.x + targetBounds.width + margin;
        right = 'auto';
      } else if (spaceLeft >= panelWidth + margin) {
        // Position to the left
        right = viewportWidth - targetBounds.x + margin;
        left = 'auto';
      } else {
        // Center in viewport
        left = (viewportWidth - panelWidth) / 2;
        right = 'auto';
      }

      return { top, bottom, left, right };
    };

    const newPosition = calculateBestPosition();
    setComputedPosition(newPosition);
  }, [targetBounds]);

  // Typewriter effect
  useEffect(() => {
    messageRef.current = message;
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    const typeInterval = setInterval(() => {
      if (currentIndex < messageRef.current.length) {
        setDisplayedText(messageRef.current.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [message]);

  // Format message to highlight keyboard keys
  const formatMessage = (text) => {
    // Replace **text** with <strong>text</strong> for bold
    // Replace keyboard keys with <kbd> tags
    return text
      .split(/(\*\*.*?\*\*)/)
      .map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          // Check if it's a single letter (keyboard key)
          if (content.length === 1 && content.match(/[A-Z?]/i)) {
            return <kbd key={i} className={styles.keyHighlight}>{content}</kbd>;
          }
          return <strong key={i}>{content}</strong>;
        }
        return part;
      });
  };

  // Handle NEXT button click
  const handleNext = () => {
    if (celebration) {
      // Complete tutorial and unlock final achievement
      completeTutorial();
    } else if (currentStep === 'COCKPIT_WELCOME') {
      nextStep('COCKPIT_TERMINAL');
    }
  };

  // Handle ARIA badge click (easter egg)
  const handleAriaBadgeClick = () => {
    discoverEasterEgg('aria-secret');
  };

  // Skip button click
  const handleSkip = () => {
    skipTutorial();
  };

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // If minimized, show compact version
  if (isMinimized) {
    return (
      <div className={`${styles.minimized} ${styles[position]}`} onClick={toggleMinimize}>
        <span className={styles.minimizedIcon}>📋</span>
        <span className={styles.minimizedText}>MISSION DIRECTIVE</span>
        <span className={styles.minimizedProgress}>{progress}%</span>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`${styles.briefing} ${computedPosition ? '' : styles[position]} ${compact ? styles.compact : ''} ${celebration ? styles.celebration : ''}`}
      style={computedPosition ? {
        top: computedPosition.top !== 'auto' ? `${computedPosition.top}px` : 'auto',
        bottom: computedPosition.bottom !== 'auto' ? `${computedPosition.bottom}px` : 'auto',
        left: computedPosition.left !== 'auto' ? `${computedPosition.left}px` : 'auto',
        right: computedPosition.right !== 'auto' ? `${computedPosition.right}px` : 'auto',
        transform: 'none' // Override CSS transform when using intelligent positioning
      } : {}}
    >
      {/* Scan line effect */}
      <div className={styles.scanLine}></div>

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>
          {celebration ? 'MISSION ACCOMPLISHED' : 'MISSION DIRECTIVE'}
        </span>
        <div className={styles.headerButtons}>
          <button
            className={styles.minimizeButton}
            onClick={toggleMinimize}
            title="Minimize"
          >
            -
          </button>
          <button
            className={styles.ariaBadge}
            onClick={handleAriaBadgeClick}
            title="Click to learn about ARIA"
          >
            ARIA
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Message content */}
      <div className={styles.content}>
        <p className={styles.message}>
          {formatMessage(displayedText)}
          {isTyping && <span className={styles.cursor}>▮</span>}
        </p>

        {/* Objective */}
        {objective && !celebration && (
          <div className={styles.objective}>
            <span className={styles.objectiveIcon}>📍</span>
            <span className={styles.objectiveText}>{objective}</span>
          </div>
        )}

        {/* Progress bar */}
        {!compact && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}% COMPLETE</span>
          </div>
        )}

        {/* Action buttons */}
        {action === 'click-next' && !isTyping && (
          <div className={styles.buttons}>
            <button className={styles.buttonPrimary} onClick={handleNext}>
              NEXT
            </button>
            <button className={styles.buttonSecondary} onClick={handleSkip}>
              SKIP ALL
            </button>
          </div>
        )}

        {celebration && !isTyping && (
          <div className={styles.buttons}>
            <button className={styles.buttonPrimary} onClick={handleNext}>
              START EXPLORING
            </button>
          </div>
        )}
      </div>

      {/* Corner decorations */}
      <div className={styles.cornerTL}></div>
      <div className={styles.cornerTR}></div>
      <div className={styles.cornerBL}></div>
      <div className={styles.cornerBR}></div>
    </div>
  );
};

export default MissionBriefing;
