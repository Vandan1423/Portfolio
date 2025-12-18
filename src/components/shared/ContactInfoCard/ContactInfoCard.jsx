import React from 'react';
import InfoCard from '../../common/InfoCard/InfoCard';
import styles from './ContactInfoCard.module.css';

const ContactInfoCard = ({
    icon,
    label,
    value,
    href,
    className = '',
    ...props
}) => {
    const content = (
        <InfoCard
            icon={icon}
            title={label}
            value={value}
            className={`${styles.contactInfoCard} ${className}`}
            {...props}
        />
    );

    if (href) {
        return (
            <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
};

export default ContactInfoCard;
