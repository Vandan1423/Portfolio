import React from 'react';
import styles from './ProficiencyBar.module.css';

const ProficiencyBar = ({
    label,
    percentage,
    color = '#00d9ff',
    showPercentage = true,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.proficiencyBar} ${className}`} {...props}>
            <div className={styles.labelRow}>
                <span className={styles.label}>{label}</span>
                {showPercentage && <span className={styles.percentage}>{percentage}%</span>}
            </div>
            <div className={styles.barContainer}>
                <div
                    className={styles.barFill}
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${color}88, ${color})`
                    }}
                />
            </div>
        </div>
    );
};

export default ProficiencyBar;
