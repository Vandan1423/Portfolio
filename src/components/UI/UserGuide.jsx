import { useState, useEffect } from 'react';
import styles from './UserGuide.module.css';

/**
 * UserGuide Component
 *
 * Interactive tutorial/guide for new users to understand navigation and controls
 * - Multi-page guide with step-by-step instructions
 * - Keyboard shortcuts reference
 * - Visual indicators and icons
 * - Can be dismissed or toggled
 * - Shows on first visit (localStorage check)
 */
const UserGuide = ({ onClose, isVisible }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Guide pages with structured content
  const guidePages = [
    {
      title: 'WELCOME ABOARD',
      icon: '🚀',
      content: [
        {
          heading: 'Your Mission',
          text: 'Navigate through different star systems to explore my portfolio. Each planet contains unique information about my work and skills.'
        },
        {
          heading: 'Getting Started',
          text: 'You are currently in the COCKPIT VIEW. Use the holographic terminal below or press N to open the navigation dashboard.'
        },
        {
          heading: 'Navigation Tip',
          text: 'This guide can be reopened anytime by pressing the ? key or clicking the help button.'
        }
      ]
    },
    {
      title: 'KEYBOARD CONTROLS',
      icon: '⌨️',
      content: [
        {
          heading: 'Essential Shortcuts',
          shortcuts: [
            { key: 'N', action: 'Open/Close Navigation Dashboard' },
            { key: 'ESC', action: 'Close panels or exit views' },
            { key: 'D', action: 'Initiate docking at planet' },
            { key: 'X', action: 'Cancel docking sequence' },
            { key: '?', action: 'Toggle this help guide' }
          ]
        },
        {
          heading: 'Terminal Commands',
          shortcuts: [
            { key: 'launch', action: 'Start launch sequence' },
            { key: 'navigate', action: 'Open navigation menu' },
            { key: 'status', action: 'View system status' },
            { key: 'help', action: 'Show terminal commands' }
          ]
        }
      ]
    },
    {
      title: 'NAVIGATION DASHBOARD',
      icon: '🗺️',
      content: [
        {
          heading: 'Press N to Access',
          text: 'The navigation dashboard has three main sections:'
        },
        {
          heading: 'A1: LOCAL SECTOR',
          text: 'View all planets in your current star system. Click any planet to enter its orbit and view detailed information.'
        },
        {
          heading: 'A2: TACTICAL MAP',
          text: 'Visual overview of the star system showing planetary orbits. Click planets directly from the map.'
        },
        {
          heading: 'A3: WARP DRIVE',
          text: 'Travel between different star systems. Each system represents a different page of the portfolio.'
        }
      ]
    },
    {
      title: 'EXPLORATION MODE',
      icon: '🌌',
      content: [
        {
          heading: 'Camera Controls',
          text: 'Once in EXPLORATION MODE, you can freely control the camera:'
        },
        {
          heading: 'Mouse Controls',
          shortcuts: [
            { key: 'Left Click + Drag', action: 'Rotate around star system' },
            { key: 'Scroll Wheel', action: 'Zoom in/out (50-300 units)' },
            { key: 'Right Click + Drag', action: 'Pan camera view' }
          ]
        },
        {
          heading: 'Movement Tips',
          text: 'The camera will smoothly transition between views. You can always press ESC to return to the main system view.'
        }
      ]
    },
    {
      title: 'PLANET DOCKING',
      icon: '🛸',
      content: [
        {
          heading: 'How to Dock',
          text: 'Select a planet from the navigation dashboard or tactical map. Once in planet view, press D to initiate docking.'
        },
        {
          heading: 'Docking Sequence',
          text: 'Watch your spacecraft approach the planet. Upon successful docking, you\'ll be taken to the detailed content page.'
        },
        {
          heading: 'Viewing Content',
          text: 'Each planet contains different sections. The page will automatically scroll to the relevant section after docking.'
        }
      ]
    },
    {
      title: 'STAR SYSTEMS',
      icon: '⭐',
      content: [
        {
          heading: 'Six Star Systems',
          text: 'Navigate between systems using the WARP DRIVE (A3) in the navigation dashboard:'
        },
        {
          heading: 'Available Systems',
          shortcuts: [
            { key: 'ALPHA CENTAURI', action: 'About Me & Personal Info' },
            { key: 'SIRIUS', action: 'Projects & Portfolio' },
            { key: 'VEGA', action: 'Work Experience' },
            { key: 'BETELGEUSE', action: 'Contact Information' },
            { key: 'POLARIS', action: 'Professional Journey' },
            { key: 'RIGEL', action: 'Technologies & Skills' }
          ]
        }
      ]
    },
    {
      title: 'QUICK NAVIGATION',
      icon: '⚡',
      content: [
        {
          heading: 'Sidebar Navigation',
          text: 'Desktop: Use the sidebar (left edge) to quickly jump between sections without going through the 3D interface.'
        },
        {
          heading: 'Mobile Navigation',
          text: 'Mobile: Tap the hamburger menu (top-right) to access the navigation drawer.'
        },
        {
          heading: 'Back Button',
          text: 'On any content page, use the BACK button (top-left) to return to 3D exploration mode.'
        },
        {
          heading: 'Direct Access',
          text: 'You can navigate directly to any section using the sidebar (SYS-01 through SYS-06) without docking.'
        }
      ]
    }
  ];

  const totalPages = guidePages.length;
  const currentGuide = guidePages[currentPage];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVisible || isMinimized) return;

      if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, isMinimized, currentPage, totalPages, onClose]);

  // Handle next/previous page
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div className={styles.minimizedContainer}>
        <button
          className={styles.minimizedButton}
          onClick={handleMinimize}
          aria-label="Expand user guide"
        >
          <span className={styles.helpIcon}>?</span>
          <span className={styles.minimizedText}>USER GUIDE</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.guideContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>{currentGuide.icon}</span>
            <h2 className={styles.title}>{currentGuide.title}</h2>
          </div>
          <div className={styles.headerRight}>
            <button
              className={styles.minimizeBtn}
              onClick={handleMinimize}
              aria-label="Minimize guide"
            >
              <span>−</span>
            </button>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close guide"
            >
              <span>×</span>
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {currentPage + 1} / {totalPages}
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {currentGuide.content.map((section, index) => (
            <div key={index} className={styles.section}>
              <h3 className={styles.sectionHeading}>{section.heading}</h3>

              {section.text && (
                <p className={styles.sectionText}>{section.text}</p>
              )}

              {section.shortcuts && (
                <div className={styles.shortcutsList}>
                  {section.shortcuts.map((shortcut, i) => (
                    <div key={i} className={styles.shortcutItem}>
                      <span className={styles.shortcutKey}>{shortcut.key}</span>
                      <span className={styles.shortcutSeparator}>→</span>
                      <span className={styles.shortcutAction}>{shortcut.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Footer */}
        <div className={styles.footer}>
          <button
            className={`${styles.navBtn} ${currentPage === 0 ? styles.disabled : ''}`}
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            <span className={styles.navArrow}>←</span>
            PREVIOUS
          </button>

          {/* Page Dots */}
          <div className={styles.pageDots}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`${styles.pageDot} ${index === currentPage ? styles.activeDot : ''}`}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {currentPage === totalPages - 1 ? (
            <button
              className={`${styles.navBtn} ${styles.finishBtn}`}
              onClick={onClose}
            >
              START EXPLORING
              <span className={styles.navArrow}>→</span>
            </button>
          ) : (
            <button
              className={styles.navBtn}
              onClick={handleNext}
            >
              NEXT
              <span className={styles.navArrow}>→</span>
            </button>
          )}
        </div>

        {/* Decorative Elements */}
        <div className={styles.scanLine} />
        <div className={styles.cornerTopLeft} />
        <div className={styles.cornerTopRight} />
        <div className={styles.cornerBottomLeft} />
        <div className={styles.cornerBottomRight} />
      </div>
    </div>
  );
};

export default UserGuide;
