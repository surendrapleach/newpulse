import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './light';
import { darkTheme } from './dark';

const ThemeContext = createContext({
    theme: lightTheme,
    mode: 'light',
    toggleTheme: () => { },
    setMode: () => { },
});

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState(systemScheme || 'light');

    // Update mode if system changes, but allow manual override
    useEffect(() => {
        if (systemScheme) {
            setMode(systemScheme);
        }
    }, [systemScheme]);

    const toggleTheme = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => {
        return mode === 'dark' ? darkTheme : lightTheme;
    }, [mode]);

    const value = useMemo(() => ({
        theme,
        mode,
        isDark: mode === 'dark',
        isDarkMode: mode === 'dark', // Alias for backward compatibility
        colors: theme.colors,
        toggleTheme,
        setMode
    }), [theme, mode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
