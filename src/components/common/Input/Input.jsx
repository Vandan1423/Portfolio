import React from 'react';
import styles from './Input.module.css';

const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.inputWrapper} ${className}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`${styles.input} ${error ? styles.error : ''}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Input;
