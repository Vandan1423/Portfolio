import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
