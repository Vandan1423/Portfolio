import React from 'react';
import styles from './SectionHeader.module.css';

const SectionHeader = ({
    number,
    title,
    subtitle,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.sectionHeader} ${className}`} {...props}>
            {number && <span className={styles.number}>{String(number).padStart(2, '0')}</span>}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
