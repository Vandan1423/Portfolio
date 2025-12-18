/**
 * RocketLoader Component
 *
 * Main loader component that orchestrates the entire loading experience.
 * Handles:
 * - First-visit detection via localStorage
 * - Asset preloading with progress tracking
 * - Rocket launch animation
 * - Transition to main application
 *
 * Only shows on first visit to optimize returning user experience.
 */

import { useState, useEffect, useRef } from 'react';
import LoaderBackground from './LoaderBackground';
import RocketAnimation from './RocketAnimation';
import ProgressDisplay from './ProgressDisplay';
import useAssetPreloader from './useAssetPreloader';
import styles from './RocketLoader.module.css';

// localStorage key for tracking first visit
const FIRST_VISIT_KEY = 'portfolio-first-visit';

/**
 * Check if this is the user's first visit
 * @returns {boolean} true if first visit, false otherwise
 */
const checkFirstVisit = () => {
    try {
        const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
        return hasVisited !== 'true';
    } catch (error) {
        console.warn('localStorage unavailable, showing loader:', error);
        return true; // Default to showing loader if localStorage is blocked
    }
};

/**
 * Mark that the user has visited
 */
const setVisited = () => {
    try {
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
        console.log('✅ First visit marked in localStorage');
    } catch (error) {
        console.warn('Could not save visit data to localStorage:', error);
    }
};

const RocketLoader = ({ children }) => {
    // Check localStorage synchronously before first render to avoid flash
    const initialFirstVisit = checkFirstVisit();

    const [isFirstVisit] = useState(initialFirstVisit);
    const [transitionPhase, setTransitionPhase] = useState(
        initialFirstVisit ? 'loading' : 'complete'
    );
    const [smoothProgress, setSmoothProgress] = useState(0);

    // Log visit status on mount
    useEffect(() => {
        if (isFirstVisit) {
            console.log('👋 First-time visitor - showing loader');
        } else {
            console.log('🚀 Returning visitor detected - skipping loader');
        }
    }, [isFirstVisit]);

    // Asset preloading with progress tracking
    const { progress, currentAsset, loadedCount, totalAssets, isComplete } = useAssetPreloader(
        (loaded, total, assetName) => {
            // Progress callback
            console.log(`📦 Loaded ${loaded}/${total}: ${assetName}`);
        },
        () => {
            // Complete callback
            console.log('✨ Asset preloading complete!');
            handleLoadComplete();
        }
    );

    // Smooth progress animation (lerp for smoother visual)
    useEffect(() => {
        const interval = setInterval(() => {
            setSmoothProgress(prev => {
                const diff = progress - prev;
                if (Math.abs(diff) < 0.1) return progress;
                return prev + diff * 0.15; // Smooth interpolation
            });
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [progress]);

    // Handle loading completion
    const handleLoadComplete = () => {
        console.log('🎯 Starting transition sequence...');

        // Hold at 100% for a moment to let user see completion
        setTimeout(() => {
            // Phase 1: Fade to white (smooth transition)
            setTransitionPhase('fading-out');

            setTimeout(() => {
                // Phase 2: Mark visit and complete
                setVisited();
                setTransitionPhase('complete');
                console.log('🚀 Transition complete - App ready!');
            }, 1500);
        }, 1000); // Hold at 100% for 1 second
    };

    // Skip loader if not first visit
    if (!isFirstVisit || transitionPhase === 'complete') {
        return <>{children}</>;
    }

    // Show loader
    return (
        <div className={styles.loaderWrapper}>
            {/* Starfield background */}
            <LoaderBackground />

            {/* Rocket animation - hide during fade out */}
            {transitionPhase !== 'fading-out' && (
                <RocketAnimation
                    progress={smoothProgress}
                    isBlastingOff={false}
                />
            )}

            {/* Progress display */}
            <ProgressDisplay
                progress={smoothProgress}
                currentAsset={currentAsset}
                loadedAssets={loadedCount}
                totalAssets={totalAssets}
            />

            {/* Fade-out overlay during transition */}
            {transitionPhase === 'fading-out' && (
                <div className={styles.fadeOverlay} />
            )}
        </div>
    );
};

export default RocketLoader;
