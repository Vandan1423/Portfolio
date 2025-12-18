import React from 'react';
import styles from './SocialLinksViz.module.css';

const socialLinks = [
    {
        icon: '💻',
        label: 'GitHub',
        href: 'https://github.com/Vandan1423',
        delay: '0s',
        angle: '0deg'
    },
    {
        icon: '🔗',
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vandan-nagori-140a132b2/',
        delay: '0.2s',
        angle: '90deg'
    },
    {
        icon: '📧',
        label: 'Email',
        href: 'mailto:nagori.vandan04@gmail.com',
        delay: '0.4s',
        angle: '180deg'
    },
    {
        icon: '📱',
        label: 'Phone',
        href: 'tel:+917372972514',
        delay: '0.6s',
        angle: '270deg'
    }
];

const SocialLinksViz = () => {
    return (
        <div className={styles.socialViz}>
            <div className={styles.socialOrb}>
                {socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={styles.socialLink}
                        style={{
                            '--link-delay': link.delay,
                            '--link-angle': link.angle
                        }}
                    >
                        <div className={styles.socialIcon}>{link.icon}</div>
                        <span className={styles.socialLabel}>{link.label}</span>
                    </a>
                ))}

                <div className={styles.centerOrb}>
                    <span className={styles.centerText}>Connect</span>
                </div>
            </div>
        </div>
    );
};

export default SocialLinksViz;
