import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { LIGHT_THEME, DARK_THEME } from '../utils/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to system preference or Light
    const systemScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Toggle function
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Active colors based on state
    const colors = isDarkMode ? DARK_THEME : LIGHT_THEME;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
