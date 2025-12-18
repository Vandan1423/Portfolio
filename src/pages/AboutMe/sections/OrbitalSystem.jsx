import React from 'react';
import styles from './OrbitalSystem.module.css';

const OrbitalSystem = () => {
    return (
        <svg className={styles.orbitalSystem} viewBox="0 0 400 400">
            <defs>
                {/* Gradient definitions */}
                <linearGradient id="ringGradient1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="ringGradient2" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="ringGradient3" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="planetGradient">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#4F46E5" />
                </radialGradient>
                <linearGradient id="cometTrail1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="cometTrail2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="cometTrail3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Central Planet */}
            <circle
                cx="200"
                cy="200"
                r="40"
                fill="url(#planetGradient)"
                filter="url(#glow)"
                className={styles.centralPlanet}
            />

            {/* Orbit Ring 1 */}
            <circle
                cx="200"
                cy="200"
                r="100"
                fill="none"
                stroke="url(#ringGradient1)"
                strokeWidth="2"
                className={styles.orbitRing}
            />

            {/* Satellite 1 with comet trail */}
            <g className={styles.satelliteGroup1}>
                <path
                    d="M200,100 Q180,100 170,105"
                    fill="none"
                    stroke="url(#cometTrail1)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={styles.cometTrail}
                />
                <circle
                    cx="200"
                    cy="100"
                    r="8"
                    fill="#818CF8"
                    filter="url(#glow)"
                    className={styles.satellite}
                />
            </g>

            {/* Orbit Ring 2 */}
            <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="url(#ringGradient2)"
                strokeWidth="2"
                className={styles.orbitRing}
            />

            {/* Satellite 2 with comet trail */}
            <g className={styles.satelliteGroup2}>
                <path
                    d="M200,60 Q180,60 170,65"
                    fill="none"
                    stroke="url(#cometTrail2)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={styles.cometTrail}
                />
                <circle
                    cx="200"
                    cy="60"
                    r="8"
                    fill="#60A5FA"
                    filter="url(#glow)"
                    className={styles.satellite}
                />
            </g>

            {/* Orbit Ring 3 */}
            <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="url(#ringGradient3)"
                strokeWidth="2"
                className={styles.orbitRing}
            />

            {/* Satellite 3 with comet trail */}
            <g className={styles.satelliteGroup3}>
                <path
                    d="M200,20 Q180,20 170,25"
                    fill="none"
                    stroke="url(#cometTrail3)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={styles.cometTrail}
                />
                <circle
                    cx="200"
                    cy="20"
                    r="8"
                    fill="#F59E0B"
                    filter="url(#glow)"
                    className={styles.satellite}
                />
            </g>
        </svg>
    );
};

export default OrbitalSystem;
