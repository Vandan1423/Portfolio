/**
 * SagittariusAvatar Component
 *
 * Interactive astronaut avatar that serves as a button to access Sagittarius AI.
 * Features:
 * - Mouse-following head/visor rotation
 * - Jump animation on click
 * - Opens Sagittarius terminal on interaction
 * - Floating idle animation
 * - Pulse ring effects
 * - Optional message cloud for hints
 * - Tutorial messages integration
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAI } from '../../context/AIContext';
import { useTutorial } from '../../context/TutorialContext';
import styles from './SagittariusAvatar.module.css';

const SagittariusAvatar = ({
    positionVariant = null, // 'planetDetail' or 'navOpen' or null for default
    showMessageCloud = false,
    messageText = "Hey! I'm Sagittarius, your AI assistant. Click me to chat!",
}) => {
    const { openTerminal, isTerminalOpen } = useAI();
    const { 
        showTutorial, 
        showWelcomeMessage,
        welcomeMessage,
        currentTutorialMessage
    } = useTutorial();

    // State for animations and interactions
    const [isJumping, setIsJumping] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
    const [visorPosition, setVisorPosition] = useState({ cx: 35, cy: 28 });
    const [showMessage, setShowMessage] = useState(showMessageCloud);

    // Refs
    const avatarRef = useRef(null);

    // Calculate head rotation based on mouse position
    const handleMouseMove = useCallback((e) => {
        if (!avatarRef.current || isJumping) return;

        const rect = avatarRef.current.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width / 2;
        const avatarCenterY = rect.top + rect.height / 2;

        // Calculate angle from avatar center to mouse
        const deltaX = e.clientX - avatarCenterX;
        const deltaY = e.clientY - avatarCenterY;

        // Clamp rotation values for natural movement (-20 to 20 degrees)
        const maxRotation = 20;
        const rotationX = Math.max(-maxRotation, Math.min(maxRotation, deltaY * 0.05));
        const rotationY = Math.max(-maxRotation, Math.min(maxRotation, deltaX * 0.05));

        setHeadRotation({ x: rotationX, y: rotationY });

        // Move visor reflection based on mouse position
        // Base position is (35, 28), allow ±5 units of movement
        const visorOffsetX = Math.max(-5, Math.min(5, deltaX * 0.02));
        const visorOffsetY = Math.max(-3, Math.min(3, deltaY * 0.02));
        setVisorPosition({
            cx: 35 + visorOffsetX,
            cy: 28 + visorOffsetY
        });
    }, [isJumping]);

    // Add mouse move listener
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    // Wave animation on every hover - triggered via event handler
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        if (!isJumping && !isWaving) {
            setIsWaving(true);
            setTimeout(() => setIsWaving(false), 1600); // Raise + wave animation duration
        }
    }, [isJumping, isWaving]);

    // Handle click - jump then open terminal
    const handleClick = useCallback(() => {
        if (isJumping || isTerminalOpen) return;

        setIsJumping(true);

        // Open terminal after jump animation (600ms)
        setTimeout(() => {
            openTerminal();
            setIsJumping(false);
            setShowMessage(false);
        }, 600);
    }, [isJumping, isTerminalOpen, openTerminal]);

    // Determine which message to show - priority: welcome > tutorial > custom
    let displayMessage = messageText;
    let shouldShowMessage = showMessage;
    let isTutorialMessage = false;
    let isWelcomeMessage = false;
    
    if (showWelcomeMessage) {
        displayMessage = welcomeMessage;
        shouldShowMessage = true;
        isWelcomeMessage = true;
    } else if (showTutorial && currentTutorialMessage) {
        // For docking hint (step 1), only show when on planet detail scene
        const isDockingHint = currentTutorialMessage.id === 'dock-hint';
        const isOnPlanetDetail = positionVariant === 'planetDetail';
        
        if (!isDockingHint || (isDockingHint && isOnPlanetDetail)) {
            displayMessage = currentTutorialMessage.message;
            shouldShowMessage = true;
            isTutorialMessage = true;
        }
    }

    // Build container class names
    const containerClasses = [
        styles.sagittariusAvatarContainer,
        positionVariant === 'planetDetail' && styles.planetDetail,
        positionVariant === 'navOpen' && styles.navOpen,
    ].filter(Boolean).join(' ');

    // Build astronaut class names
    const astronautClasses = [
        styles.astronaut,
        styles.floating,
        isJumping && styles.jumping,
        isWaving && styles.waving,
    ].filter(Boolean).join(' ');

    // Don't render if terminal is open
    if (isTerminalOpen) return null;

    return (
        <div className={containerClasses}>
            {/* Message Cloud - shows welcome, tutorial, or custom messages */}
            {shouldShowMessage && (
                <div className={`${styles.messageCloud} ${isTutorialMessage ? styles.tutorialCloud : ''} ${isWelcomeMessage ? styles.welcomeCloud : ''}`}>
                    <p className={styles.messageText}>{displayMessage}</p>
                    {!isTutorialMessage && !isWelcomeMessage && <p className={styles.messageHint}>Click to chat →</p>}
                </div>
            )}

            {/* Astronaut Avatar */}
            <div
                ref={avatarRef}
                className={astronautClasses}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                aria-label="Open Sagittarius AI Terminal"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                {/* Ambient glow */}
                <div className={styles.ambientGlow} />

                {/* Twinkling sparkles */}
                <div className={styles.sparkleContainer}>
                    <div className={styles.sparkle} />
                    <div className={styles.sparkle} />
                    <div className={styles.sparkle} />
                    <div className={styles.sparkle} />
                    <div className={styles.sparkle} />
                </div>

                {/* Astronaut SVG - Detailed Design */}
                <svg
                    className={styles.astronautSvg}
                    viewBox="0 0 80 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Visor gradient - dark teal like reference */}
                        <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1a3a4a" />
                            <stop offset="30%" stopColor="#0d2836" />
                            <stop offset="70%" stopColor="#0a1f2a" />
                            <stop offset="100%" stopColor="#1a3a4a" />
                        </linearGradient>
                        {/* Suit gradient - white with subtle gray */}
                        <linearGradient id="suitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="50%" stopColor="#f0f0f0" />
                            <stop offset="100%" stopColor="#e8e8e8" />
                        </linearGradient>
                        {/* Helmet gradient */}
                        <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#d0d0d0" />
                        </linearGradient>
                        {/* Screen gradient */}
                        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1a4a5a" />
                            <stop offset="100%" stopColor="#0d3040" />
                        </linearGradient>
                        {/* Glow effect */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* === LEGS === */}
                    {/* Left Leg */}
                    <path
                        d="M28 62 Q26 70 26 80 Q26 88 28 92 L36 92 Q38 88 38 80 Q38 70 36 62 Z"
                        fill="url(#suitGradient)"
                        stroke="#c0c0c0"
                        strokeWidth="0.5"
                    />
                    {/* Left leg orange stripe */}
                    <rect x="26" y="68" width="12" height="3" rx="1" fill="#e85d04" />
                    {/* Left knee pad */}
                    <ellipse cx="31" cy="76" rx="4" ry="3" fill="#d0d0d0" stroke="#b0b0b0" strokeWidth="0.5" />
                    {/* Left leg lower stripe */}
                    <rect x="26" y="84" width="12" height="3" rx="1" fill="#e85d04" />

                    {/* Right Leg */}
                    <path
                        d="M44 62 Q42 70 42 80 Q42 88 44 92 L52 92 Q54 88 54 80 Q54 70 52 62 Z"
                        fill="url(#suitGradient)"
                        stroke="#c0c0c0"
                        strokeWidth="0.5"
                    />
                    {/* Right leg orange stripe */}
                    <rect x="42" y="68" width="12" height="3" rx="1" fill="#e85d04" />
                    {/* Right knee pad */}
                    <ellipse cx="49" cy="76" rx="4" ry="3" fill="#d0d0d0" stroke="#b0b0b0" strokeWidth="0.5" />
                    {/* Right leg lower stripe */}
                    <rect x="42" y="84" width="12" height="3" rx="1" fill="#e85d04" />

                    {/* === BOOTS === */}
                    {/* Left Boot */}
                    <path
                        d="M24 90 Q22 92 22 95 Q22 98 26 98 L36 98 Q40 98 40 95 Q40 92 38 90 Z"
                        fill="#a0a0a0"
                        stroke="#808080"
                        strokeWidth="0.5"
                    />
                    <ellipse cx="31" cy="95" rx="6" ry="2" fill="#b0b0b0" />

                    {/* Right Boot */}
                    <path
                        d="M42 90 Q40 92 40 95 Q40 98 44 98 L54 98 Q58 98 58 95 Q58 92 56 90 Z"
                        fill="#a0a0a0"
                        stroke="#808080"
                        strokeWidth="0.5"
                    />
                    <ellipse cx="49" cy="95" rx="6" ry="2" fill="#b0b0b0" />

                    {/* === BODY/TORSO === */}
                    <path
                        d="M24 38 Q20 42 20 52 Q20 62 28 64 L52 64 Q60 62 60 52 Q60 42 56 38 Z"
                        fill="url(#suitGradient)"
                        stroke="#c0c0c0"
                        strokeWidth="0.5"
                    />

                    {/* === ARMS === */}
                    {/* Left Arm */}
                    <g>
                        <path
                            d="M20 40 Q14 42 12 50 Q10 58 12 64 L18 66 Q22 60 22 52 Q22 44 20 40 Z"
                            fill="url(#suitGradient)"
                            stroke="#c0c0c0"
                            strokeWidth="0.5"
                        />
                        {/* Left arm orange stripe */}
                        <rect x="10" y="48" width="10" height="3" rx="1" fill="#e85d04" transform="rotate(-10 15 50)" />
                        {/* Left glove/hand */}
                        <ellipse cx="15" cy="68" rx="5" ry="4" fill="#e0e0e0" stroke="#c0c0c0" strokeWidth="0.5" />
                        {/* Fingers */}
                        <ellipse cx="12" cy="71" rx="1.5" ry="2" fill="#e0e0e0" />
                        <ellipse cx="15" cy="72" rx="1.5" ry="2.5" fill="#e0e0e0" />
                        <ellipse cx="18" cy="71" rx="1.5" ry="2" fill="#e0e0e0" />
                    </g>

                    {/* Right Arm (for waving animation) */}
                    <g className={styles.rightArm}>
                        <path
                            d="M60 40 Q66 42 68 50 Q70 58 68 64 L62 66 Q58 60 58 52 Q58 44 60 40 Z"
                            fill="url(#suitGradient)"
                            stroke="#c0c0c0"
                            strokeWidth="0.5"
                        />
                        {/* Right arm orange stripe */}
                        <rect x="60" y="48" width="10" height="3" rx="1" fill="#e85d04" transform="rotate(10 65 50)" />
                        {/* Right glove/hand */}
                        <ellipse cx="65" cy="68" rx="5" ry="4" fill="#e0e0e0" stroke="#c0c0c0" strokeWidth="0.5" />
                        {/* Fingers */}
                        <ellipse cx="62" cy="71" rx="1.5" ry="2" fill="#e0e0e0" />
                        <ellipse cx="65" cy="72" rx="1.5" ry="2.5" fill="#e0e0e0" />
                        <ellipse cx="68" cy="71" rx="1.5" ry="2" fill="#e0e0e0" />
                    </g>

                    {/* === CHEST PANEL === */}
                    <rect
                        x="28"
                        y="42"
                        width="24"
                        height="20"
                        rx="3"
                        fill="#f5f5f5"
                        stroke="#d0d0d0"
                        strokeWidth="1"
                    />
                    {/* Screen display */}
                    <rect
                        x="30"
                        y="44"
                        width="20"
                        height="8"
                        rx="1"
                        fill="url(#screenGradient)"
                        stroke="#0a3040"
                        strokeWidth="0.5"
                    />
                    {/* Screen reflection */}
                    <rect x="31" y="45" width="8" height="2" rx="0.5" fill="rgba(255,255,255,0.2)" />
                    
                    {/* Control buttons row */}
                    <circle cx="33" cy="55" r="1.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3" />
                    <circle cx="37" cy="55" r="1.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3" />
                    <circle cx="41" cy="55" r="1.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3" />
                    <circle cx="45" cy="55" r="1.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.3" />
                    
                    {/* Keypad grid */}
                    <rect x="30" y="57" width="8" height="4" rx="0.5" fill="#e0e0e0" stroke="#c0c0c0" strokeWidth="0.3" />
                    <line x1="32.5" y1="57" x2="32.5" y2="61" stroke="#c0c0c0" strokeWidth="0.3" />
                    <line x1="35" y1="57" x2="35" y2="61" stroke="#c0c0c0" strokeWidth="0.3" />
                    <line x1="30" y1="59" x2="38" y2="59" stroke="#c0c0c0" strokeWidth="0.3" />
                    
                    {/* Side buttons */}
                    <rect x="40" y="57" width="4" height="2" rx="0.5" fill="#e0e0e0" stroke="#c0c0c0" strokeWidth="0.3" />
                    <rect x="45" y="57" width="4" height="2" rx="0.5" fill="#e0e0e0" stroke="#c0c0c0" strokeWidth="0.3" />

                    {/* Status light */}
                    <circle
                        className={`${styles.statusLight} ${isJumping ? styles.pulsingFast : ''}`}
                        cx="47"
                        cy="55"
                        r="1.5"
                        fill="#00ff88"
                        filter="url(#glow)"
                    />

                    {/* === HEAD GROUP - rotates with mouse === */}
                    <g
                        style={{
                            transform: `rotate(${headRotation.y * 0.3}deg)`,
                            transformOrigin: '40px 22px',
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Helmet outer ring */}
                        <ellipse
                            cx="40"
                            cy="22"
                            rx="22"
                            ry="20"
                            fill="url(#helmetGradient)"
                            stroke="#b0b0b0"
                            strokeWidth="1"
                        />
                        
                        {/* Helmet inner ring */}
                        <ellipse
                            cx="40"
                            cy="22"
                            rx="18"
                            ry="16"
                            fill="#e8e8e8"
                            stroke="#c0c0c0"
                            strokeWidth="0.5"
                        />

                        {/* Visor - dark teal */}
                        <ellipse
                            cx="40"
                            cy="22"
                            rx="15"
                            ry="13"
                            fill="url(#visorGradient)"
                            stroke="#0a2030"
                            strokeWidth="1"
                        />

                        {/* Visor reflections - move with mouse */}
                        <ellipse
                            className={styles.visorReflection}
                            cx={visorPosition.cx + 5}
                            cy={visorPosition.cy - 6}
                            rx="6"
                            ry="4"
                            fill="rgba(100, 180, 200, 0.3)"
                        />
                        <ellipse
                            cx="48"
                            cy="16"
                            rx="3"
                            ry="2"
                            fill="rgba(255, 255, 255, 0.25)"
                        />

                        {/* Side bolts - left */}
                        <circle cx="20" cy="18" r="2.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.5" />
                        <circle cx="20" cy="18" r="1" fill="#808080" />
                        <circle cx="20" cy="26" r="2.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.5" />
                        <circle cx="20" cy="26" r="1" fill="#808080" />

                        {/* Side bolts - right */}
                        <circle cx="60" cy="18" r="2.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.5" />
                        <circle cx="60" cy="18" r="1" fill="#808080" />
                        <circle cx="60" cy="26" r="2.5" fill="#a0a0a0" stroke="#808080" strokeWidth="0.5" />
                        <circle cx="60" cy="26" r="1" fill="#808080" />

                        {/* Antenna */}
                        <rect
                            x="38"
                            y="0"
                            width="4"
                            height="6"
                            rx="1"
                            fill="#808080"
                        />
                        {/* Antenna light */}
                        <circle
                            className={`${styles.antennaLight} ${isHovered ? styles.blinking : ''}`}
                            cx="40"
                            cy="0"
                            r="3"
                            fill="#00d4ff"
                            filter="url(#glow)"
                        />
                    </g>
                </svg>
            </div>

            {/* Tooltip on hover */}
            <div className={`${styles.tooltip} ${isHovered ? styles.visible : ''}`}>
                <span className={styles.tooltipText}>Open Sagittarius AI</span>
            </div>
        </div>
    );
};

export default SagittariusAvatar;
