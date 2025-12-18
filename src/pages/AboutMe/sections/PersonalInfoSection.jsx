import React from 'react';
import styles from './PersonalInfoSection.module.css';

const PersonalInfoSection = () => {
    return (
        <div className={styles.infoBox}>
            <h1 className={styles.name}>VANDAN NAGORI</h1>
            <p className={styles.tagline}>Full-Stack Developer</p>
            <p className={styles.description}>
                Building scalable web applications with modern technologies
            </p>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Location</span>
                    <span className={styles.value}>IIT Indore</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Email</span>
                    <a
                        href="mailto:nagori.vandan04@gmail.com"
                        className={styles.value}
                    >
                        nagori.vandan04@gmail.com
                    </a>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>Phone</span>
                    <a
                        href="tel:+917372972514"
                        className={styles.value}
                    >
                        +91-7372972514
                    </a>
                </div>
            </div>
            <div className={styles.socialLinks}>
                <a
                    href="https://github.com/Vandan1423"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                >
                    <span className={styles.icon}>💻</span> GitHub
                </a>
                <a
                    href="https://linkedin.com/in/vandan-nagori-140a132b2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                >
                    <span className={styles.icon}>🔗</span> LinkedIn
                </a>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
