import React from 'react';
import styles from './InterestsSection.module.css';

const InterestsSection = () => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.interestsGrid}>
                <div className={styles.interestCard}>
                    <span className={styles.interestIcon}>🎹</span>
                    <h4>Piano</h4>
                    <p>Creating melodies and harmonies</p>
                </div>
                <div className={styles.interestCard}>
                    <span className={styles.interestIcon}>🏏</span>
                    <h4>Cricket</h4>
                    <p>Team spirit and strategy</p>
                </div>
                <div className={styles.interestCard}>
                    <span className={styles.interestIcon}>🎵</span>
                    <h4>Music</h4>
                    <p>Exploring diverse genres</p>
                </div>
                <div className={styles.interestCard}>
                    <span className={styles.interestIcon}>🎮</span>
                    <h4>E-Sports</h4>
                    <p>Competitive gaming passion</p>
                </div>
            </div>
            <div className={styles.funFact}>
                <span className={styles.funFactLabel}>
                    Fun Fact:
                </span>
                <p>"I see the universe in arrays and loops"</p>
            </div>
        </div>
    );
};

export default InterestsSection;
