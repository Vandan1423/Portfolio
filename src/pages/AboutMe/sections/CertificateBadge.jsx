import React, { useState } from 'react';
import styles from './CertificateBadge.module.css';

const CertificateBadge = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeSkill, setActiveSkill] = useState(null);
    const [rotationPaused, setRotationPaused] = useState(false);

    const achievements = [
        { label: 'Projects', value: '10+', icon: '🚀' },
        { label: 'Technologies', value: '15+', icon: '⚡' },
        { label: 'Hours', value: '500+', icon: '⏱️' }
    ];

    return (
        <div className={styles.certificateVisualization}>
            {/* Floating Particles */}
            <div className={styles.particlesContainer}>
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{
                            '--delay': `${i * 0.5}s`,
                            '--x': `${Math.random() * 100}%`,
                            '--duration': `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Certificate Badge */}
            <div
                className={`${styles.certificateBadge} ${isHovered ? styles.hovered : ''} ${rotationPaused ? styles.paused : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setActiveSkill(null);
                }}
                onClick={() => setRotationPaused(!rotationPaused)}
            >
                {/* Glow Effect */}
                <div className={styles.badgeGlow} />

                {/* Outer Ring */}
                <div className={styles.badgeOuter}>
                    {/* Achievement Stats Ring */}
                    <div className={styles.statsRing}>
                        {achievements.map((stat, index) => (
                            <div
                                key={index}
                                className={styles.statItem}
                                style={{ '--stat-index': index }}
                            >
                                <span className={styles.statIcon}>{stat.icon}</span>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Middle Ring */}
                    <div className={styles.badgeMiddle}>
                        {/* Inner Badge */}
                        <div className={styles.badgeInner}>
                            <div className={styles.badgeContent}>
                                <div className={styles.badgeIcon}>
                                    {activeSkill ? activeSkill.icon : '🏆'}
                                </div>
                                <div className={styles.badgeText}>
                                    {activeSkill ? activeSkill.name : 'Certified'}
                                </div>
                                <div className={styles.badgeSubtext}>
                                    {activeSkill ? activeSkill.description : 'Full Stack Developer'}
                                </div>
                            </div>
                            {/* Pulse Effect */}
                            <div className={styles.pulseRing} />
                            <div className={styles.pulseRing} style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Interactive Hint */}
            <div className={styles.interactiveHint}>
                <span className={styles.hintIcon}>🏆</span>
                <span className={styles.hintText}>
                    Full Stack Development Certification • 100% Complete
                </span>
            </div>

            {/* Completion Bar */}
            <div className={styles.completionBar}>
                <div className={styles.completionLabel}>Course Completion</div>
                <div className={styles.completionTrack}>
                    <div className={styles.completionFill} style={{ '--progress': '100%' }}>
                        <div className={styles.completionGlow} />
                    </div>
                </div>
                <div className={styles.completionValue}>100%</div>
            </div>
        </div>
    );
};

export default CertificateBadge;
