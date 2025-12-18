import React from 'react';
import styles from './ResumeVisualization.module.css';

const ResumeVisualization = () => {
    return (
        <div className={styles.resumeVisualization}>
            <div className={styles.documentPreview}>
                <div className={styles.documentHeader}>
                    <div className={styles.headerLines}>
                        <div className={styles.line} style={{ width: '60%' }}></div>
                        <div className={styles.line} style={{ width: '40%' }}></div>
                    </div>
                </div>
                <div className={styles.documentBody}>
                    {[...Array(5)].map((_, sectionIndex) => (
                        <div key={sectionIndex} className={styles.section}>
                            <div className={styles.sectionTitle}></div>
                            <div className={styles.sectionContent}>
                                {[...Array(3)].map((_, lineIndex) => (
                                    <div
                                        key={lineIndex}
                                        className={styles.contentLine}
                                        style={{
                                            width: `${Math.random() * 30 + 60}%`,
                                            animationDelay: `${(sectionIndex * 3 + lineIndex) * 0.1}s`
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.floatingIcons}>
                    <div className={styles.floatingIcon} style={{ '--float-delay': '0s' }}>
                        📄
                    </div>
                    <div className={styles.floatingIcon} style={{ '--float-delay': '0.5s' }}>
                        ✨
                    </div>
                    <div className={styles.floatingIcon} style={{ '--float-delay': '1s' }}>
                        🎯
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeVisualization;
