import React from 'react';
import styles from './TechTreeNode.module.css';

const TechTreeNode = ({
    name,
    proficiency,
    isSelected,
    onClick,
    variant = 'default',
    className = '',
    ...props
}) => {
    return (
        <div
            className={`${styles.techNode} ${styles[variant]} ${isSelected ? styles.selected : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            <span className={styles.name}>{name}</span>
            {proficiency && (
                <span className={styles.proficiency}>{proficiency}%</span>
            )}
        </div>
    );
};

export default TechTreeNode;
