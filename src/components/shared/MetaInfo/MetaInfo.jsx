import React from 'react';
import styles from './MetaInfo.module.css';

const MetaInfo = ({
    items,
    className = '',
    ...props
}) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.metaInfo} ${className}`} {...props}>
            {items.map((item, index) => (
                <div key={index} className={styles.metaItem}>
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span className={styles.label}>{item.label}:</span>
                    <span className={styles.value}>{item.value}</span>
                </div>
            ))}
        </div>
    );
};

export default MetaInfo;
