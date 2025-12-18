import React, { createContext, useContext } from 'react';

const ThemeContext = createContext(undefined);

const theme = {
    colors: {
        primary: '#00d9ff',
        secondary: '#ff00ff',
        accent: '#00ff88',
        warning: '#ffaa00',
        danger: '#ff3366',
        success: '#00ff66',
        background: '#0a0e27',
        surface: '#1a1f3a',
        text: '#e0e6ed',
        textMuted: '#8892b0',
    },

    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cyber: 'linear-gradient(135deg, #00d9ff 0%, #00b4d8 50%, #0077b6 100%)',
        neon: 'linear-gradient(135deg, #ff00ff 0%, #00d9ff 100%)',
        space: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
    },

    shadows: {
        glow: '0 0 20px rgba(0, 217, 255, 0.5)',
        glowStrong: '0 0 30px rgba(0, 217, 255, 0.8)',
        neonPink: '0 0 20px rgba(255, 0, 255, 0.5)',
        neonCyan: '0 0 20px rgba(0, 217, 255, 0.5)',
    },

    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        xxl: '4rem',
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },

    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '500ms ease-in-out',
    },
};

export const ThemeProvider = ({ children }) => {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
