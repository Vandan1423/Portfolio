import React from 'react';
import styles from './SocialLinks.module.css';

const SocialLinks = ({
    links,
    className = '',
    ...props
}) => {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.socialLinks} ${className}`} {...props}>
            {links.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={link.name}
                >
                    {link.icon && <span className={styles.icon}>{link.icon}</span>}
                    {link.name}
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;
