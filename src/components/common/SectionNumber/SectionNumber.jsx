import React from 'react';
import styles from './SectionNumber.module.css';

const SectionNumber = ({
    number,
    className = '',
    ...props
}) => {
    return (
        <span
            className={`${styles.sectionNumber} ${className}`}
            {...props}
        >
            {String(number).padStart(2, '0')}
        </span>
    );
};

export default SectionNumber;
