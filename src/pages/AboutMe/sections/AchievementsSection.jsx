import React from 'react';
import styles from './AchievementsSection.module.css';
import achievementData from "../../../data/achievementData.js"

const AchievementsSection = () => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.achievementsList}>
                {achievementData.map((achievement, index) => (
                    <div key={index} className={styles.achievementItem}>
                        <div className={styles.achievementIcon}>{achievement.icon}</div>
                        <div className={styles.achievementContent}>
                            <h4 className={styles.achievementTitle}>{achievement.title}</h4>
                            <p className={styles.achievementDesc}>{achievement.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsSection;
