import React from 'react';
import Input from '../../common/Input/Input';
import Textarea from '../../common/Textarea/Textarea';
import styles from './FormGroup.module.css';

const FormGroup = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    rows,
    className = '',
    ...props
}) => {
    const isTextarea = type === 'textarea';

    return (
        <div className={`${styles.formGroup} ${className}`}>
            {isTextarea ? (
                <Textarea
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    rows={rows}
                    {...props}
                />
            ) : (
                <Input
                    label={label}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    {...props}
                />
            )}
        </div>
    );
};

export default FormGroup;
