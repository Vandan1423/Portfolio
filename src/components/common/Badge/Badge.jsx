import React from 'react';
import styles from './Badge.module.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'medium',
    className = '',
    ...props
}) => {
    return (
        <span
            className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
