import React from 'react';
import styles from './Icon.module.css';

const Icon = ({
    children,
    size = 'medium',
    color,
    className = '',
    ...props
}) => {
    return (
        <span
            className={`${styles.icon} ${styles[size]} ${className}`}
            style={{ color }}
            {...props}
        >
            {children}
        </span>
    );
};

export default Icon;
