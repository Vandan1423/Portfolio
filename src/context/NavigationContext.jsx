import React, { createContext, useContext, useState, useCallback } from 'react';

const NavigationContext = createContext(undefined);

export const NavigationProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('3d-portfolio');

    const [scrollTarget, setScrollTarget] = useState(null);

    const handleNavigate = useCallback((page, section = null) => {
        setCurrentPage(page);
        // Always set scrollTarget - null will reset it, section value will set it
        setScrollTarget(section);
    }, []);

    const handleBack = useCallback(() => {
        setCurrentPage('3d-portfolio');
        setScrollTarget(null);
    }, []);

    const handleScrollComplete = useCallback(() => {
        setScrollTarget(null);
    }, []);

    const value = {
        currentPage,
        scrollTarget,
        onNavigate: handleNavigate,
        onBack: handleBack,
        onScrollComplete: handleScrollComplete,
        setCurrentPage,
        setScrollTarget,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

export default NavigationContext;
