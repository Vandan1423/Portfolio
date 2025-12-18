import React from 'react';
import styles from './CertificationsSection.module.css';

const CertificationsSection = () => {
    return (
        <div className={styles.infoBox}>
            <p className={styles.certificationsIntro}>
                Professional certifications and completed courses demonstrating
                continuous learning and skill development
            </p>
            <div className={styles.certificationsList}>
                <div
                    className={styles.certificationItem}
                    onClick={() => {
                        sessionStorage.setItem('highlightExperience', 'exp-05');
                        window.location.href = '/experience#exp-05';
                    }}
                >
                    <div className={styles.certificationHeader}>
                        <div className={styles.certIcon}>📜</div>
                        <div className={styles.certTitleSection}>
                            <h4 className={styles.certTitle}>Web Development - Delta Batch</h4>
                            <p className={styles.certOrg}>Apna College • 2024</p>
                        </div>
                        <div className={styles.certArrow}>→</div>
                    </div>
                    <div className={styles.certDescription}>
                        <p>Comprehensive full-stack web development certification covering modern technologies</p>
                        <div className={styles.certTechHighlights}>
                            <span className={styles.certTech}>React</span>
                            <span className={styles.certTech}>Node.js</span>
                            <span className={styles.certTech}>MongoDB</span>
                            <span className={styles.certTech}>+10 more</span>
                        </div>
                    </div>
                    <div className={styles.certFooter}>
                        <span className={styles.certStatus}>✅ Completed</span>
                        <span className={styles.certAction}>View Details</span>
                    </div>
                </div>
            </div>
            <div className={styles.certificationsNote}>
                <span className={styles.noteIcon}>💡</span>
                <p>Click on any certification to view full details on the Experience page</p>
            </div>
        </div>
    );
};

export default CertificationsSection;
