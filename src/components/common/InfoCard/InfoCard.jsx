import React from 'react';
import styles from './InfoCard.module.css';

const InfoCard = ({
    icon,
    title,
    value,
    subtitle,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.infoCard} ${className}`} {...props}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <div className={styles.content}>
                {title && <h4 className={styles.title}>{title}</h4>}
                {value && <p className={styles.value}>{value}</p>}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
};

export default InfoCard;
