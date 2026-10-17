import { useRef, useEffect, useCallback } from 'react';

// Space left between the sticky header and the section it scrolls to
const HEADER_GAP = 16;

/**
 * Custom hook to handle scroll-to-section functionality
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
                        const header = document.querySelector('[data-site-header]');
                        const offset = (header?.offsetHeight ?? 0) + HEADER_GAP;
                        const top = element.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });

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
