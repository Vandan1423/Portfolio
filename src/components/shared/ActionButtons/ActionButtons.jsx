import React from 'react';
import Button from '../../common/Button/Button';
import styles from './ActionButtons.module.css';

const ActionButtons = ({
    buttons,
    alignment = 'left',
    className = '',
    ...props
}) => {
    if (!buttons || buttons.length === 0) {
        return null;
    }

    return (
        <div
            className={`${styles.actionButtons} ${styles[alignment]} ${className}`}
            {...props}
        >
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    variant={button.variant || 'primary'}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    {...button.props}
                >
                    {button.icon && <span className={styles.icon}>{button.icon}</span>}
                    {button.label}
                </Button>
            ))}
        </div>
    );
};

export default ActionButtons;
