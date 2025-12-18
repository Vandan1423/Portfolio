/**
 * LoaderBackground Component
 *
 * Creates an animated starfield background for the loader screen.
 * Features multiple parallax layers and a nebula glow effect to match
 * the portfolio's space theme.
 *
 * Performance: Pure CSS animations, no JavaScript calculations
 */

import styles from './RocketLoader.module.css';

const LoaderBackground = () => {
    return (
        <div className={styles.starfield}>
            {/* Deep space gradient background */}
            <div className={styles.spaceGradient} />

            {/* Multi-layer parallax stars */}
            <div className={styles.starsLayer1} />
            <div className={styles.starsLayer2} />
            <div className={styles.starsLayer3} />

            {/* Nebula glow overlay */}
            <div className={styles.nebula} />
        </div>
    );
};

export default LoaderBackground;
