import React from 'react';
import ContactInfoCard from '../../../components/shared/ContactInfoCard/ContactInfoCard';
import styles from './ContactInfoSection.module.css';

const contactInfo = [
    {
        icon: '📧',
        label: 'Email',
        value: 'nagori.vandan04@gmail.com',
        href: 'mailto:nagori.vandan04@gmail.com'
    },
    {
        icon: '📱',
        label: 'Phone',
        value: '+91-7372972514',
        href: 'tel:+917372972514'
    },
    {
        icon: '📍',
        label: 'Location',
        value: 'IIT Indore, India'
    },
    {
        icon: '⏰',
        label: 'Availability',
        value: 'Open to opportunities'
    }
];

const ContactInfoSection = () => {
    return (
        <div className={styles.contactInfoGrid}>
            {contactInfo.map((info, index) => (
                <ContactInfoCard
                    key={index}
                    icon={info.icon}
                    label={info.label}
                    value={info.value}
                    href={info.href}
                />
            ))}
        </div>
    );
};

export default ContactInfoSection;
