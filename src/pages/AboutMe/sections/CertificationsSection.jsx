import React from 'react';
import { certifications } from '../../../data/profile';
import styles from './CertificationsSection.module.css';

const CertificationsSection = () => {
    return (
        <div className={styles.infoBox}>
            <div className={styles.certificationsList}>
                {certifications.map((cert) => (
                    <div key={cert.name} className={styles.certificationItem}>
                        <div className={styles.certTitleSection}>
                            <h4 className={styles.certTitle}>{cert.name}</h4>
                            <p className={styles.certOrg}>
                                {[cert.issuer, cert.year].filter(Boolean).join(' · ')}
                            </p>
                        </div>
                        {cert.link && (
                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.certViewBtn}
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

export default CertificationsSection;
