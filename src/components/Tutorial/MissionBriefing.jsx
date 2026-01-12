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
  targetBounds = null, // Deprecated - no longer used
  autoMinimize = false, // Auto-minimize trigger
  onMinimizeChange = null, // Callback when minimize state changes
  isNavigationVisible = false, // Is navigation panel open?
  currentPhase = 'exploration' // Current phase: cockpit, exploration, planet-detail, launching
}) => {
  const { nextStep, skipTutorial, currentStep, completeTutorial, discoverEasterEgg } = useTutorial();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [wasManuallyExpanded, setWasManuallyExpanded] = useState(false);
  const messageRef = useRef(message);
  const panelRef = useRef(null);

  // Smart positioning based on context to avoid overlaps
  const smartPosition = (() => {
    // If position is explicitly 'center' (for celebration), use it
    if (position === 'center') return 'center';

    // Context-aware positioning to avoid overlaps
    if (isNavigationVisible) {
      // Navigation panel is center of screen, so use top-left (away from it)
      return 'top-left';
    }

    if (currentPhase === 'planet-detail') {
      // Info panel is on right side, planet on left, docking hint at bottom-center
      // Use bottom-left to avoid all of them
      return 'bottom-left';
    }

    if (currentPhase === 'cockpit' || currentPhase === 'launching') {
      // Cockpit terminal at bottom-center, so use top-center
      return 'top-center';
    }

    // Default: bottom-center (safe for exploration mode and content pages)
    return 'bottom-center';
  })();

  // Auto-minimize when triggered (only if not manually expanded)
  useEffect(() => {
    if (autoMinimize && !wasManuallyExpanded) {
      setIsMinimized(true);
      if (onMinimizeChange) {
        onMinimizeChange(true);
      }
    }
  }, [autoMinimize, wasManuallyExpanded, onMinimizeChange]);

  // Reset states when autoMinimize becomes false (e.g., navigation closes)
  useEffect(() => {
    if (!autoMinimize) {
      setWasManuallyExpanded(false);
      setIsMinimized(false);
      if (onMinimizeChange) {
        onMinimizeChange(false);
      }
    }
  }, [autoMinimize, onMinimizeChange]);

  // Notify parent when minimize state changes
  useEffect(() => {
    if (onMinimizeChange) {
      onMinimizeChange(isMinimized);
    }
  }, [isMinimized, onMinimizeChange]);

  // No more dynamic positioning - use fixed CSS positions only

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

  // Handle FINISH button click (for SYSTEM_ARRIVAL step)
  const handleFinish = () => {
    nextStep('MISSION_COMPLETE');
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
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    // If user is expanding (un-minimizing), mark as manually expanded
    if (!newMinimized) {
      setWasManuallyExpanded(true);
    }
  };

  // If minimized, show compact version
  if (isMinimized) {
    return (
      <div className={`${styles.minimized} ${styles[smartPosition]}`} onClick={toggleMinimize}>
        <span className={styles.minimizedIcon}>📋</span>
        <span className={styles.minimizedText}>MISSION DIRECTIVE</span>
        <span className={styles.minimizedProgress}>{progress}%</span>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`${styles.briefing} ${styles[smartPosition]} ${compact ? styles.compact : ''} ${celebration ? styles.celebration : ''}`}
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
              SKIP TUTORIAL
            </button>
          </div>
        )}

        {action === 'click-finish' && !isTyping && (
          <div className={styles.buttons}>
            <button className={styles.buttonPrimary} onClick={handleFinish}>
              FINISH TRAINING
            </button>
            <button className={styles.buttonSecondary} onClick={handleSkip}>
              SKIP TUTORIAL
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

        {/* Skip button for all other steps */}
        {!['click-next', 'click-finish', 'complete'].includes(action) && !celebration && (
          <div className={styles.buttons}>
            <button className={styles.buttonSecondary} onClick={handleSkip}>
              SKIP TUTORIAL
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
