import React from 'react';
import styles from './Textarea.module.css';

const Textarea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    rows = 4,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.textareaWrapper} ${className}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`${styles.textarea} ${error ? styles.error : ''}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Textarea;
