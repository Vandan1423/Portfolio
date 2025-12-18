import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle scroll-to-section functionality
 * Replaces duplicated scroll logic across all pages (saves ~240 lines)
 *
 * @param {string|null} scrollTarget - The section ID to scroll to
 * @param {function} onScrollComplete - Callback function called after scroll completes
 * @returns {Object} { registerRef } - Function to register section refs
 */
const useScrollToSection = (scrollTarget, onScrollComplete) => {
    const sectionRefs = useRef({});

    // Function to register a ref for a section
    const registerRef = useCallback((sectionId) => (el) => {
        sectionRefs.current[sectionId] = el;
    }, []);

    useEffect(() => {
        if (scrollTarget && sectionRefs.current[scrollTarget]) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    const element = sectionRefs.current[scrollTarget];
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        if (onScrollComplete) {
                            onScrollComplete();
                        }
                    }
                }, 100);
            });
        }
    }, [scrollTarget, onScrollComplete]);

    return { registerRef };
};

export default useScrollToSection;
