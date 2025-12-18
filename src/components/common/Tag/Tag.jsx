import React from 'react';
import styles from './Tag.module.css';

const Tag = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    return (
        <span
            className={`${styles.tag} ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export default Tag;
