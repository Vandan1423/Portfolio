/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NavigationContext = createContext(undefined);

// Utility function to detect mobile/tablet/touch devices
const isMobileOrTablet = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobileWidth = window.innerWidth <= 1024; // Cover mobile phones and iPads
    return hasTouch || hasCoarsePointer || isMobileWidth;
};

// Page id ↔ URL path. Page ids are what the rest of the app passes to onNavigate.
const PAGE_PATHS = {
    '3d-portfolio': '/',
    'about-me': '/about',
    projects: '/projects',
    experience: '/experience',
    journey: '/journey',
};

// Other names callers use for a page
const PAGE_ALIASES = {
    home: '3d-portfolio',
    about: 'about-me',
};

const PATH_PAGES = Object.fromEntries(
    Object.entries(PAGE_PATHS).map(([page, path]) => [path, page])
);
PATH_PAGES['/about-me'] = 'about-me';

const resolvePage = (page) => {
    const id = PAGE_ALIASES[page] || page;
    if (!PAGE_PATHS[id]) return 'about-me';
    // Touch devices and narrow windows never get the 3D view
    if (id === '3d-portfolio' && isMobileOrTablet()) return 'about-me';
    return id;
};

const sectionFromHash = () => decodeURIComponent(window.location.hash.slice(1)) || null;

// Reads the page from the address bar. Unknown paths fall back to About.
const readLocation = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return {
        page: resolvePage(PATH_PAGES[path] ?? 'about-me'),
        section: sectionFromHash(),
    };
};

const urlFor = (page, section) => PAGE_PATHS[page] + (section ? `#${encodeURIComponent(section)}` : '');

export const pathForPage = (page) => PAGE_PATHS[resolvePage(page)];

export function NavigationProvider({ children }) {
    const [initial] = useState(readLocation);
    const [currentPage, setCurrentPage] = useState(initial.page);
    const [scrollTarget, setScrollTarget] = useState(initial.section);
    const [isMobile, setIsMobile] = useState(isMobileOrTablet());

    // Correct the address bar once on load: unknown paths, /about-me, and / on a phone
    useEffect(() => {
        const url = urlFor(initial.page, initial.section);
        if (url !== window.location.pathname + window.location.hash) {
            window.history.replaceState(null, '', url);
        }
    }, [initial]);

    // Back and forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const { page, section } = readLocation();
            setCurrentPage(page);
            setScrollTarget(section);
            if (!section) window.scrollTo({ top: 0, behavior: 'instant' });
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Listen for window resize to update mobile state
    useEffect(() => {
        const handleResize = () => {
            const mobile = isMobileOrTablet();
            setIsMobile(mobile);

            // If currently on 3d-portfolio and resized to mobile, redirect to about-me
            if (mobile && currentPage === '3d-portfolio') {
                setCurrentPage('about-me');
                window.history.replaceState(null, '', urlFor('about-me'));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentPage]);

    const handleNavigate = useCallback((page, section = null) => {
        const target = resolvePage(page);
        const url = urlFor(target, section);

        if (url !== window.location.pathname + window.location.hash) {
            window.history.pushState(null, '', url);
        }
        setCurrentPage(target);
        setScrollTarget(section);
        if (!section) window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleBack = useCallback(() => {
        handleNavigate('3d-portfolio');
    }, [handleNavigate]);

    const handleScrollComplete = useCallback(() => {
        setScrollTarget(null);
    }, []);

    const value = {
        currentPage,
        scrollTarget,
        isMobile,
        onNavigate: handleNavigate,
        onBack: handleBack,
        onScrollComplete: handleScrollComplete,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}
