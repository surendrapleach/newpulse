import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../services/NavigationContext';
import { COLORS } from '../utils/theme';
import { useLanguage } from '../services/LanguageContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabItem = ({ icon, screenName, active, onPress }) => (
    <TouchableOpacity style={styles.tabItem} onPress={() => onPress(screenName)} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
            {active && <View style={styles.activeIndicator} />}
            <Ionicons
                name={active ? icon : `${icon}-outline`}
                size={26}
                color={active ? COLORS.primary : COLORS.secondaryText}
            />
        </View>
    </TouchableOpacity>
);

const BottomNavigation = () => {
    const { currentScreen, navigate } = useNavigation();
    const insets = useSafeAreaInsets();

    // Don't show bottom nav on Splash
    if (currentScreen === SCREENS.SPLASH) return null;

    // Helper to check active state
    const getActive = (screen) => currentScreen === screen;

    return (
        <View style={[
            styles.container,
            {
                paddingBottom: insets.bottom > 0 ? insets.bottom : 4,
                height: 42 + (insets.bottom > 0 ? insets.bottom : 0)
            }
        ]}>
            <TabItem
                icon="compass"
                screenName={SCREENS.EXPLORE}
                active={getActive(SCREENS.EXPLORE) || getActive(SCREENS.EXPLORE_SECTION_GRID)}
                onPress={navigate}
            />
            <TabItem
                icon="home"
                screenName={SCREENS.HOME}
                active={getActive(SCREENS.HOME) || getActive(SCREENS.DETAIL)}
                onPress={navigate}
            />
            <TabItem
                icon="person-circle"
                screenName={SCREENS.PROFILE}
                active={getActive(SCREENS.PROFILE)}
                onPress={navigate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingTop: 2,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
            }
        }),
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        alignItems: 'center',
    },
    activeIndicator: {
        position: 'absolute',
        top: -2,
        width: 18,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
});

export default BottomNavigation;
