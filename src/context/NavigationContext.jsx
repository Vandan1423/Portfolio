/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NavigationContext = createContext(undefined);

// Utility function to detect mobile/tablet devices
const isMobileOrTablet = () => {
    return window.innerWidth <= 1024; // Cover mobile phones and iPads
};

export function NavigationProvider({ children }) {
    // Set initial page based on device type
    const getInitialPage = () => {
        return isMobileOrTablet() ? 'about-me' : '3d-portfolio';
    };

    const [currentPage, setCurrentPage] = useState(getInitialPage());
    const [scrollTarget, setScrollTarget] = useState(null);
    const [isMobile, setIsMobile] = useState(isMobileOrTablet());

    // Listen for window resize to update mobile state
    useEffect(() => {
        const handleResize = () => {
            const mobile = isMobileOrTablet();
            setIsMobile(mobile);

            // If currently on 3d-portfolio and resized to mobile, redirect to about-me
            if (mobile && currentPage === '3d-portfolio') {
                setCurrentPage('about-me');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentPage]);

    const handleNavigate = useCallback((page, section = null) => {
        setCurrentPage(page);
        setScrollTarget(section);
    }, []);

    const handleBack = useCallback(() => {
        // On mobile/tablet, go to about-me instead of 3d-portfolio
        const backPage = isMobileOrTablet() ? 'about-me' : '3d-portfolio';
        setCurrentPage(backPage);
        setScrollTarget(null);
    }, []);

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
