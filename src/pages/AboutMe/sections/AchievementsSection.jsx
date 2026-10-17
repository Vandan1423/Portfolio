import React from 'react';
import { achievements } from '../../../data/profile';
import styles from './AchievementsSection.module.css';

const AchievementsSection = () => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.achievementsList}>
                {achievements.map((achievement) => (
                    <div key={achievement.title} className={styles.achievementItem}>
                        <h4 className={styles.achievementTitle}>{achievement.title}</h4>
                        <p className={styles.achievementDesc}>{achievement.detail}</p>
                        {achievement.link && (
                            <a
                                href={achievement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.achievementLink}
                            >
                                View certificate
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsSection;
