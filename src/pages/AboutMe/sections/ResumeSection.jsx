import React from 'react';
import styles from './ResumeSection.module.css';

const ResumeSection = () => {
    return (
        <div className={styles.infoBox}>
            <p className={styles.resumeIntro}>
                Download my complete resume to learn more about my education,
                experience, and technical skills.
            </p>
            <div className={styles.resumeActions}>
                <a
                    href="/resume/CV_Tech.pdf"
                    download
                    className={styles.downloadBtn}
                >
                    <span className={styles.btnIcon}>📥</span>
                    <span className={styles.btnText}>Download Resume</span>
                </a>
                <a
                    href="/resume/CV_Tech.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                >
                    <span className={styles.btnIcon}>👁️</span>
                    <span className={styles.btnText}>View Online</span>
                </a>
            </div>
            <div className={styles.resumeHighlights}>
                <h4 className={styles.highlightsTitle}>Quick Highlights</h4>
                <ul className={styles.highlightsList}>
                    <li className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>🎓</span>
                        B.Tech in Space Science & Engineering, IIT Indore
                    </li>
                    <li className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>💼</span>
                        Full-Stack Developer with MERN expertise
                    </li>
                    <li className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>🏆</span>
                        8.83 CGPA | 93.2% in Senior Secondary
                    </li>
                    <li className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>🛠️</span>
                        Proficient in Python, JavaScript, C++, React, Node.js
                    </li>
                </ul>
            </div>
            <div className={styles.resumeNote}>
                <span className={styles.noteIcon}>💡</span>
                <p>Last updated: December 2024</p>
            </div>
        </div>
    );
};

export default ResumeSection;
