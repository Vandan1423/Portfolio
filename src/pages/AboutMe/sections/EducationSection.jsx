import React from 'react';
import styles from './EducationSection.module.css';

const EducationSection = () => {
    return (
        <div className={styles.infoBox}>
            <h3 className={styles.degreeTitle}>
                B.Tech Space Science & Engineering
            </h3>
            <p className={styles.institute}>
                Indian Institute of Technology, Indore
            </p>
            <div className={styles.educationStats}>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>CGPA</span>
                    <span className={styles.statValue}>8.58</span>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statLabel}>Year</span>
                    <span className={styles.statValue}>
                        2023 - Present
                    </span>
                </div>
            </div>
            <div className={styles.previousEducation}>
                <div className={styles.eduItem}>
                    <span>Senior Secondary (CBSE)</span>
                    <span className={styles.percentage}>93.2%</span>
                </div>
                <div className={styles.eduItem}>
                    <span>Secondary (CBSE)</span>
                    <span className={styles.percentage}>86.2%</span>
                </div>
            </div>
        </div>
    );
};

export default EducationSection;
