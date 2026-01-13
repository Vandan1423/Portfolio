import React, { Suspense, lazy, useEffect } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAI } from '../../../context/AIContext';
import HeroSection from '../../HeroSection/HeroSection';
import PageNavigation from '../../UI/PageNavigation';
import Button from '../../common/Button/Button';
import styles from './PageTemplate.module.css';

// Lazy load Sagittarius Terminal and Avatar
const SagittariusTerminal = lazy(() => import('../../AI/SagittariusTerminal'));
const SagittariusAvatar = lazy(() => import('../../UI/SagittariusAvatar'));

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
    const { openTerminal } = useAI();

    // Keyboard shortcut for opening Sagittarius Terminal (T key)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 't' || e.key === 'T') {
                // Ignore if user is typing in an input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                openTerminal();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [openTerminal]);

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

            {/* Sagittarius Avatar - Floating button to access AI */}
            <Suspense fallback={null}>
                <SagittariusAvatar />
            </Suspense>

            {/* Sagittarius Terminal - Opens with T key or Avatar click */}
            <Suspense fallback={null}>
                <SagittariusTerminal />
            </Suspense>
        </div>
    );
};

export default PageTemplate;
