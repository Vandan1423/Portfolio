import React from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import HeroSection from '../../HeroSection/HeroSection';
import PageNavigation from '../../UI/PageNavigation';
import Button from '../../common/Button/Button';
import styles from './PageTemplate.module.css';

const PageTemplate = ({
    title,
    subtitle,
    showBackButton = true,
    showNavigation = true,
    showHero = true,
    children,
    className = '',
    ...props
}) => {
    const { onBack, currentPage, onNavigate } = useNavigation();

    return (
        <div className={`${styles.container} ${className}`} {...props}>
            {showBackButton && onBack && (
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className={styles.backButton}
                    aria-label="Return to system"
                >
                    ← Back
                </Button>
            )}

            {showNavigation && (
                <PageNavigation
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                />
            )}

            {showHero && title && (
                <HeroSection
                    mainTitle={title}
                    heroSubtitle={subtitle}
                />
            )}

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default PageTemplate;
