import { useState, useEffect } from 'react';
import styles from './ExplorationControls.module.css';

/**
 * ExplorationControls Component
 * 
 * A small panel showing camera controls during star system exploration
 * - Auto-hides when navigation panel opens
 * - Only visible during exploration phase
 * - Compact, non-intrusive design
 */
const ExplorationControls = ({ isVisible, isNavigationOpen }) => {
  const [isHidden, setIsHidden] = useState(false);

  // Auto-hide when navigation opens
  useEffect(() => {
    if (isNavigationOpen) {
      setIsHidden(true);
    } else {
      // Show again when navigation closes (with small delay for smooth transition)
      const timer = setTimeout(() => {
        setIsHidden(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNavigationOpen]);

  if (!isVisible || isHidden) return null;

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.icon}>🎮</span>
          <span className={styles.title}>CONTROLS</span>
        </div>
        
        <div className={styles.controlsList}>
          <div className={styles.controlItem}>
            <span className={styles.key}>Left Click + Drag</span>
            <span className={styles.action}>Rotate</span>
          </div>
          
          <div className={styles.controlItem}>
            <span className={styles.key}>Right Click + Drag</span>
            <span className={styles.action}>Pan</span>
          </div>
          
          <div className={styles.controlItem}>
            <span className={styles.key}>Scroll</span>
            <span className={styles.action}>Zoom</span>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.controlItem}>
            <span className={styles.keyHighlight}>N</span>
            <span className={styles.action}>Navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationControls;
