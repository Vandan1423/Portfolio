import React, { useEffect } from 'react';
import styles from './AchievementTimeline.module.css';

const achievementData = [
    {
        title: "Academic Excellence",
        description: "Maintained 8.58 CGPA at IIT Indore in Space Science & Engineering"
    },
    {
        title: "Full-Stack Development",
        description: "Built scalable web applications using React, Node.js, and MongoDB"
    },
    {
        title: "Space Science Engineering",
        description: "Specialized knowledge in aerospace and space technology domains"
    },
    {
        title: "Problem Solving",
        description: "Strong foundation in DSA and competitive programming skills"
    }
];

const AchievementTimeline = () => {
    useEffect(() => {
        const starNodes = document.querySelectorAll(`.${styles.starNode}`);
        const tooltip = document.getElementById('achievement-tooltip');

        if (!tooltip) return;

        const starPositions = [
            { y: 80 },
            { y: 190 },
            { y: 310 },
            { y: 430 }
        ];

        starNodes.forEach((node, index) => {
            const handleMouseEnter = () => {
                const data = achievementData[index];
                const titleEl = tooltip.querySelector(`.${styles.tooltipTitle}`);
                const descEl = tooltip.querySelector(`.${styles.tooltipDesc}`);

                if (titleEl && descEl) {
                    titleEl.textContent = data.title;
                    descEl.textContent = data.description;

                    const position = starPositions[index];
                    const percentage = (position.y / 550) * 100;

                    tooltip.style.top = `${percentage}%`;
                    tooltip.style.left = '65%';
                    tooltip.style.transform = 'translateY(-50%)';

                    tooltip.classList.add(styles.active);
                }
            };

            const handleMouseLeave = () => {
                tooltip.classList.remove(styles.active);
            };

            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            starNodes.forEach((node) => {
                node.removeEventListener('mouseenter', () => {});
                node.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    return (
        <div className={styles.achievementVisualization}>
            <div className={styles.constellationTimeline}>
                <svg className={styles.timelineSvg} viewBox="0 0 300 550">
                    <defs>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="lineGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
                        </linearGradient>
                        <radialGradient id="starGradient">
                            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
                        </radialGradient>
                        <filter id="starGlow">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Connecting Lines */}
                    <path
                        d="M150,80 L150,190"
                        stroke="url(#lineGradient1)"
                        strokeWidth="2"
                        fill="none"
                        className={styles.timelinePath}
                        strokeDasharray="120"
                        strokeDashoffset="120"
                    />
                    <path
                        d="M150,190 L150,310"
                        stroke="url(#lineGradient2)"
                        strokeWidth="2"
                        fill="none"
                        className={styles.timelinePath}
                        strokeDasharray="120"
                        strokeDashoffset="120"
                        style={{ animationDelay: '0.3s' }}
                    />
                    <path
                        d="M150,310 L150,430"
                        stroke="url(#lineGradient3)"
                        strokeWidth="2"
                        fill="none"
                        className={styles.timelinePath}
                        strokeDasharray="120"
                        strokeDashoffset="120"
                        style={{ animationDelay: '0.6s' }}
                    />

                    {/* Star Nodes */}
                    {[
                        { cy: 80, emoji: '🏆', stroke: '#4F46E5' },
                        { cy: 190, emoji: '💻', stroke: '#818CF8' },
                        { cy: 310, emoji: '🚀', stroke: '#60A5FA' },
                        { cy: 430, emoji: '🎯', stroke: '#F59E0B' }
                    ].map((node, index) => (
                        <g key={index} className={styles.starNode} data-node={index}>
                            <circle
                                cx="150"
                                cy={node.cy}
                                r="30"
                                fill="url(#starGradient)"
                                filter="url(#starGlow)"
                                className={styles.starCircle}
                            />
                            <circle
                                cx="150"
                                cy={node.cy}
                                r="38"
                                fill="none"
                                stroke={node.stroke}
                                strokeWidth="2"
                                opacity="0.3"
                                className={styles.starRing}
                            />
                            <text
                                x="150"
                                y={node.cy + 13}
                                fontSize="28"
                                textAnchor="middle"
                                fill="#1A1A2E"
                            >
                                {node.emoji}
                            </text>
                            {index < 3 && (
                                <circle cx="150" cy={node.cy + 30} r="3" fill={node.stroke} className={styles.flowParticle}>
                                    <animateMotion
                                        dur="3s"
                                        repeatCount="indefinite"
                                        begin={`${index * 0.3}s`}
                                        path={`M0,0 L0,${index === 0 ? 80 : index === 1 ? 90 : 90}`}
                                    />
                                </circle>
                            )}
                        </g>
                    ))}
                </svg>

                {/* Achievement Tooltip */}
                <div className={styles.achievementTooltip} id="achievement-tooltip">
                    <div className={styles.tooltipContent}>
                        <h4 className={styles.tooltipTitle}>Achievement</h4>
                        <p className={styles.tooltipDesc}>Hover over stars to see details</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementTimeline;
