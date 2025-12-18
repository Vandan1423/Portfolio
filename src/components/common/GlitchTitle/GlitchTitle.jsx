import React from 'react';
import styles from './GlitchTitle.module.css';

const GlitchTitle = ({
    text,
    className = '',
    ...props
}) => {
    return (
        <h2
            className={`${styles.glitchTitle} ${className}`}
            data-text={text}
            {...props}
        >
            {text}
        </h2>
    );
};

export default GlitchTitle;
