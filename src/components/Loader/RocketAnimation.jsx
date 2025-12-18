/**
 * RocketAnimation Component
 *
 * Displays an animated rocket that moves upward based on loading progress.
 * Features exhaust effects, speed lines, and a final blast-off animation.
 *
 * Animation is pure CSS for 60fps performance without JavaScript overhead.
 */

import { useMemo } from 'react';
import styles from './RocketLoader.module.css';

const RocketAnimation = ({ progress, isBlastingOff = false }) => {
    // Calculate rocket position (90% from top at 0%, 5% from top at 100%)
    const rocketY = useMemo(() => {
        return 90 - (progress * 0.85);
    }, [progress]);

    // Calculate rocket tilt based on speed (0deg to 15deg)
    const tiltAngle = useMemo(() => {
        return Math.min(progress * 0.15, 15);
    }, [progress]);

    // Calculate exhaust intensity (scales with progress)
    const exhaustScale = useMemo(() => {
        return 0.5 + (progress / 100) * 1.5; // 0.5x to 2x scale
    }, [progress]);

    // Show speed lines when progress > 70%
    const showSpeedLines = progress > 70;

    // Generate random positions for speed lines
    const speedLines = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            height: `${40 + Math.random() * 40}px`
        }));
    }, []);

    return (
        <div className={styles.rocketContainer}>
            {/* Rocket with dynamic positioning */}
            <div
                className={`${styles.rocket} ${isBlastingOff ? styles.rocketBlastOff : ''}`}
                style={{
                    top: `${rocketY}%`,
                    transform: `translateX(-50%) rotate(${tiltAngle}deg)`
                }}
            >
                {/* Rocket SVG */}
                <svg
                    width="60"
                    height="120"
                    viewBox="0 0 60 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.rocketSvg}
                >
                    {/* Rocket body */}
                    <defs>
                        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#e0e7ff" />
                            <stop offset="50%" stopColor="#c7d2fe" />
                            <stop offset="100%" stopColor="#a5b4fc" />
                        </linearGradient>
                        <linearGradient id="rocketWindow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="rocketFin" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>

                    {/* Rocket nose cone */}
                    <path
                        d="M30 0 L45 25 L15 25 Z"
                        fill="url(#rocketBody)"
                        stroke="#818cf8"
                        strokeWidth="1"
                    />

                    {/* Main body */}
                    <rect
                        x="15"
                        y="25"
                        width="30"
                        height="55"
                        fill="url(#rocketBody)"
                        stroke="#818cf8"
                        strokeWidth="1"
                        rx="2"
                    />

                    {/* Window */}
                    <circle
                        cx="30"
                        cy="40"
                        r="8"
                        fill="url(#rocketWindow)"
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                    />

                    {/* Left fin */}
                    <path
                        d="M15 70 L0 90 L15 85 Z"
                        fill="url(#rocketFin)"
                        stroke="#6366f1"
                        strokeWidth="1"
                    />

                    {/* Right fin */}
                    <path
                        d="M45 70 L60 90 L45 85 Z"
                        fill="url(#rocketFin)"
                        stroke="#6366f1"
                        strokeWidth="1"
                    />

                    {/* Exhaust nozzle */}
                    <rect
                        x="20"
                        y="80"
                        width="20"
                        height="12"
                        fill="#4f46e5"
                        stroke="#6366f1"
                        strokeWidth="1"
                    />

                    {/* Accent stripes */}
                    <line x1="15" y1="50" x2="45" y2="50" stroke="#6366f1" strokeWidth="2" />
                    <line x1="15" y1="60" x2="45" y2="60" stroke="#6366f1" strokeWidth="2" />
                </svg>

                {/* Exhaust trail */}
                <div
                    className={styles.exhaustTrail}
                    style={{ transform: `scaleY(${exhaustScale})` }}
                >
                    <div className={styles.exhaustParticle} style={{ left: '-5px' }} />
                    <div className={styles.exhaustParticle} style={{ left: '0px', animationDelay: '0.2s' }} />
                    <div className={styles.exhaustParticle} style={{ left: '5px', animationDelay: '0.4s' }} />
                </div>
            </div>

            {/* Speed lines (appear when progress > 70%) */}
            {showSpeedLines && (
                <div className={styles.speedLines}>
                    {speedLines.map((line, i) => (
                        <div
                            key={i}
                            className={styles.speedLine}
                            style={{
                                left: line.left,
                                animationDelay: line.animationDelay,
                                height: line.height
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RocketAnimation;
