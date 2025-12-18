import React, { forwardRef } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './TwoColumnSection.module.css';

const TwoColumnSection = forwardRef(({
    id,
    sectionNumber,
    sectionTitle,
    sectionSubtitle,
    leftContent,
    rightContent,
    reverseOnMobile = false,
    className = '',
    ...props
}, ref) => {
    return (
        <section
            ref={ref}
            id={id}
            className={`${styles.section} ${className}`}
            {...props}
        >
            {sectionNumber && sectionTitle && (
                <SectionHeader
                    number={sectionNumber}
                    title={sectionTitle}
                    subtitle={sectionSubtitle}
                />
            )}
            <div className={`${styles.twoColumn} ${reverseOnMobile ? styles.reverseOnMobile : ''}`}>
                <div className={styles.leftContent}>
                    {leftContent}
                </div>
                <div className={styles.rightContent}>
                    {rightContent}
                </div>
            </div>
        </section>
    );
});

TwoColumnSection.displayName = 'TwoColumnSection';

export default TwoColumnSection;
