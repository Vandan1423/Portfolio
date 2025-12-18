import React from 'react';
import styles from '../Technologies.module.css';

/**
 * TechnologiesHero Component
 * Displays the hero section with animated title, subtitle, and scroll indicator
 */
const TechnologiesHero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.heroTitle}>
                    <h1 className={styles.mainTitle}>Technology Tree</h1>
                    <div className={styles.titleUnderline}></div>
                </div>
                <p className={styles.heroSubtitle}>
                    Explore my technical ecosystem: skills, proficiencies, and connections
                </p>
                <div className={styles.heroStars}>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.heroStar}
                            style={{ '--star-delay': `${i * 0.3}s` }}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollArrow}></div>
                <span className={styles.scrollText}>Scroll to explore</span>
            </div>
        </section>
    );
};

export default TechnologiesHero;
