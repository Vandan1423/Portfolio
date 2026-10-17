import React from 'react';
import SiteHeader from '../SiteHeader/SiteHeader';
import SiteFooter from '../SiteFooter/SiteFooter';
import styles from './PageTemplate.module.css';

const PageTemplate = ({
    title,
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.container} ${className}`} {...props}>
            <SiteHeader />

            <main className={styles.content}>
                {title && (
                    <header className={styles.pageHeader}>
                        <h1 className={styles.title}>{title}</h1>
                    </header>
                )}
                {children}
            </main>

            <SiteFooter />
        </div>
    );
};

export default PageTemplate;
