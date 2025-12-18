import React from 'react';
import SectionNumber from '../../common/SectionNumber/SectionNumber';
import GlitchTitle from '../../common/GlitchTitle/GlitchTitle';
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
            <SectionNumber number={number} />
            <GlitchTitle text={title} className={styles.title} />
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
