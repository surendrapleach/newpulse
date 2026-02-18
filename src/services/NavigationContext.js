import React, { createContext, useState, useContext } from 'react';
/**
 * Navigation Context
 * 
 * A simple, lightweight router replacement.
 * Manages which screen is currently visible and handles history or parameters.
 */

const NavigationContext = createContext();

export const SCREENS = {
    SPLASH: 'SPLASH',
    HOME: 'HOME',
    EXPLORE: 'EXPLORE',
    EXPLORE_SECTION_LIST: 'EXPLORE_SECTION_LIST',
    EXPLORE_SECTION_GRID: 'EXPLORE_SECTION_GRID',
    SAVED: 'SAVED',
    PROFILE: 'PROFILE',
    DETAIL: 'DETAIL',
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
    SIGNUP: 'SIGNUP',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    NOTIFICATIONS: 'NOTIFICATIONS',
    PRIVACY: 'PRIVACY',
    LANGUAGE: 'LANGUAGE',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
    EDIT_PROFILE: 'EDIT_PROFILE',
};

export const NavigationProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState(SCREENS.SPLASH);
    const [previousScreen, setPreviousScreen] = useState(null);
    const [params, setParams] = useState({}); // To pass data like articleId
    const [isTabBarVisible, setIsTabBarVisible] = useState(true); // Global tab bar visibility

    const navigate = (screenName, newParams = {}) => {
        setPreviousScreen(currentScreen);
        setParams(newParams);
        setCurrentScreen(screenName);
        // Reset tab bar visibility on navigation (optional, but safer)
        setIsTabBarVisible(true);
    };

    const goBack = () => {
        if (previousScreen) {
            setCurrentScreen(previousScreen);
            setPreviousScreen(null);
            setIsTabBarVisible(true);
            return;
        }
        // Fallbacks if no previous screen is tracked
        if (currentScreen === SCREENS.DETAIL) {
            setCurrentScreen(SCREENS.HOME);
            setIsTabBarVisible(true);
        } else if (currentScreen === SCREENS.EXPLORE_SECTION_LIST || currentScreen === SCREENS.EXPLORE_SECTION_GRID) {
            setCurrentScreen(SCREENS.EXPLORE);
            setIsTabBarVisible(true);
        }
    };

    return (
        <NavigationContext.Provider value={{ currentScreen, params, navigate, goBack, isTabBarVisible, setIsTabBarVisible }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
