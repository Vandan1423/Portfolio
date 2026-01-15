import React, { useEffect } from 'react';
import { useNavigation } from '../../../context/NavigationContext';
import { useAI } from '../../../context/AIContext';
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
    const { openTerminal } = useAI();

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

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
            {showBackButton && onBack && !isTouchDevice && (
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
