import React from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import styles from './CertificationsSection.module.css';

const CertificationsSection = () => {
    const { onNavigate } = useNavigation();
    return (
        <div className={styles.infoBox}>
            <p className={styles.certificationsIntro}>
                Professional certifications and completed courses demonstrating
                continuous learning and skill development
            </p>
            <div className={styles.certificationsList}>
                <div className={styles.certificationItem}>
                    <div className={styles.certificationHeader}>
                        <div className={styles.certIcon}>📜</div>
                        <div className={styles.certTitleSection}>
                            <h4 className={styles.certTitle}>Web Development - Delta Batch</h4>
                            <p className={styles.certOrg}>Apna College • 2024</p>
                        </div>
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
                        <div className={styles.certActions}>
                            <a
                                href="/certificate/DeltaBatchCertificate.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.certViewBtn}
                                onClick={(e) => e.stopPropagation()}
                            >
                                👁️ View Certificate
                            </a>
                            <button
                                className={styles.certDetailsBtn}
                                onClick={() => {
                                    sessionStorage.setItem('highlightExperience', 'exp-05');
                                    onNavigate('experience', 'exp-05');
                                }}
                            >
                                View Details →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.certificationsNote}>
                <span className={styles.noteIcon}>💡</span>
                <p>View certificate or click 'View Details' to see full information on the Experience page</p>
            </div>
        </div>
    );
};

export default CertificationsSection;
