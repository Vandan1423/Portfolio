import { useState, useEffect } from 'react';
import UserGuide from './UserGuide';
import styles from './HelpButton.module.css';

/**
 * HelpButton Component
 *
 * Floating help button that triggers the UserGuide
 * - Shows UserGuide automatically on first visit
 * - Can be triggered by clicking the button or pressing '?' key
 * - Uses localStorage to track if user has seen the guide
 * - Pulses to attract attention for new visitors
 */
const HelpButton = () => {
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(true);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('portfolio-guide-seen');

    if (!hasVisited) {
      // First time visitor - show guide after 2 seconds
      const timer = setTimeout(() => {
        setIsGuideVisible(true);
        setHasSeenGuide(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  // Handle keyboard shortcut '?' to toggle guide
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if '?' key is pressed (Shift + / on most keyboards)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsGuideVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle closing the guide
  const handleCloseGuide = () => {
    setIsGuideVisible(false);

    // Mark guide as seen in localStorage
    if (!hasSeenGuide) {
      localStorage.setItem('portfolio-guide-seen', 'true');
      setHasSeenGuide(true);
    }
  };

  // Handle opening the guide
  const handleOpenGuide = () => {
    setIsGuideVisible(true);
  };

  return (
    <>
      {/* Help Button */}
      <button
        className={`${styles.helpButton} ${!hasSeenGuide ? styles.pulse : ''}`}
        onClick={handleOpenGuide}
        aria-label="Open user guide"
        title="Press ? for help"
      >
        <span className={styles.questionMark}>?</span>
        {!hasSeenGuide && <span className={styles.newBadge}>NEW</span>}
      </button>

      {/* User Guide Modal */}
      <UserGuide
        isVisible={isGuideVisible}
        onClose={handleCloseGuide}
      />
    </>
  );
};

export default HelpButton;
