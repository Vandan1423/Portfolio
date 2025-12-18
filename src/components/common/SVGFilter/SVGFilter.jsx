import React from 'react';

const SVGFilter = () => {
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="glow-strong">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="neon-glow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d9ff" />
                    <stop offset="50%" stopColor="#00b4d8" />
                    <stop offset="100%" stopColor="#0077b6" />
                </linearGradient>

                <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff00ff" />
                    <stop offset="100%" stopColor="#00d9ff" />
                </linearGradient>

                <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff88" />
                    <stop offset="100%" stopColor="#00ff66" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default SVGFilter;
