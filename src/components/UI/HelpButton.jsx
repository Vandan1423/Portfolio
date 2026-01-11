import { useState, useEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import { useNavigation } from '../../context/NavigationContext';
import UserGuide from './UserGuide';
import styles from './HelpButton.module.css';

/**
 * HelpButton Component
 *
 * Floating help button that triggers the UserGuide or Tutorial replay
 * - Can be triggered by clicking the button or pressing '?' key
 * - Shows menu with options: Replay Tutorial, View User Guide
 * - Uses localStorage to track if user has seen the guide
 * - Pulses to attract attention for new visitors who haven't opened it
 */
const HelpButton = () => {
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(true);
  const { completed: tutorialCompleted, replayTutorial } = useTutorial();
  const { onNavigate } = useNavigation();

  // Check if the user has seen the guide before
  useEffect(() => {
    const hasVisited = localStorage.getItem('portfolio-guide-seen');

    if (!hasVisited) {
      // First time visitor - button will pulse but guide won't auto-show
      setHasSeenGuide(false);
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
    setIsMenuVisible(false);
  };

  // Handle replay tutorial
  const handleReplayTutorial = () => {
    setIsMenuVisible(false);
    // Navigate to 3D portfolio first, then start tutorial
    onNavigate('3d-portfolio');
    // Small delay to ensure navigation completes
    setTimeout(() => {
      replayTutorial();
    }, 100);
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      {/* Help Button */}
      <button
        className={`${styles.helpButton} ${!hasSeenGuide ? styles.pulse : ''}`}
        onClick={toggleMenu}
        aria-label="Open help menu"
        title="Press ? for help"
      >
        <span className={styles.questionMark}>?</span>
        {!hasSeenGuide && <span className={styles.newBadge}>NEW</span>}
      </button>

      {/* Help Menu */}
      {isMenuVisible && (
        <div className={styles.helpMenu}>
          {tutorialCompleted && (
            <button className={styles.menuItem} onClick={handleReplayTutorial}>
              <span className={styles.menuIcon}>🔄</span>
              Replay Tutorial
            </button>
          )}
          <button className={styles.menuItem} onClick={handleOpenGuide}>
            <span className={styles.menuIcon}>📖</span>
            User Guide
          </button>
        </div>
      )}

      {/* User Guide Modal */}
      <UserGuide
        isVisible={isGuideVisible}
        onClose={handleCloseGuide}
      />
    </>
  );
};

export default HelpButton;
