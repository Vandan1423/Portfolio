import React from 'react';
import Button from '../../common/Button/Button';
import styles from './ExpandableCard.module.css';

const ExpandableCard = ({
    title,
    children,
    isExpanded,
    onToggle,
    previewContent,
    expandText = 'Read More',
    collapseText = 'Show Less',
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.expandableCard} ${className}`} {...props}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.content}>
                {isExpanded ? children : previewContent}
            </div>
            {onToggle && (
                <Button
                    variant="ghost"
                    onClick={onToggle}
                    className={styles.toggleButton}
                >
                    {isExpanded ? collapseText : expandText}
                </Button>
            )}
        </div>
    );
};

export default ExpandableCard;
