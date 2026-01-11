import { useEffect, useState, useCallback } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import styles from './AchievementNotification.module.css';

/**
 * AchievementNotification Component
 *
 * Displays achievement unlock notifications with animations
 * Features:
 * - Slide in from right
 * - Shake animation
 * - Glow effect
 * - Auto-dismiss after 4 seconds
 */

const AchievementNotification = ({ achievement }) => {
  const { acknowledgeAchievement } = useTutorial();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      acknowledgeAchievement();
    }, 300);
  }, [acknowledgeAchievement]);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-dismiss after 3.5 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 3500);

    return () => {
      clearTimeout(dismissTimer);
    };
  }, [achievement, handleDismiss]);

  if (!achievement) {
    return null;
  }

  return (
    <div
      className={`${styles.notification} ${isVisible ? styles.visible : ''} ${isExiting ? styles.exiting : ''}`}
      onClick={handleDismiss}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{achievement.icon}</span>
        <span className={styles.title}>ACHIEVEMENT UNLOCKED!</span>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Achievement content */}
      <div className={styles.content}>
        <div className={styles.name}>{achievement.name}</div>
        <div className={styles.description}>{achievement.description}</div>
      </div>

      {/* Glow effect */}
      <div className={styles.glow}></div>

      {/* Corner decorations */}
      <div className={styles.cornerTL}></div>
      <div className={styles.cornerTR}></div>
      <div className={styles.cornerBL}></div>
      <div className={styles.cornerBR}></div>
    </div>
  );
};

export default AchievementNotification;
