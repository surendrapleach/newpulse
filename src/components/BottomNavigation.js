import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../services/NavigationContext';
import { COLORS } from '../utils/theme';
import { useLanguage } from '../services/LanguageContext';

const TabItem = ({ icon, label, screenName, active, onPress }) => (
    <TouchableOpacity style={styles.tabItem} onPress={() => onPress(screenName)} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
            {active && <View style={styles.activeIndicator} />}
            <Ionicons
                name={active ? icon : `${icon}-outline`}
                size={24}
                color={active ? COLORS.primary : COLORS.secondaryText}
            />
        </View>
        <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const BottomNavigation = () => {
    const { currentScreen, navigate } = useNavigation();
    const { t } = useLanguage();

    // Don't show bottom nav on Splash
    if (currentScreen === SCREENS.SPLASH) return null;

    // Helper to check active state (detail page keeps Home active if we want, or its own)
    const getActive = (screen) => currentScreen === screen;

    return (
        <View style={styles.container}>
            <TabItem
                icon="home"
                label={t("tab_home")}
                screenName={SCREENS.HOME}
                active={getActive(SCREENS.HOME) || getActive(SCREENS.DETAIL)}
                onPress={navigate}
            />
            <TabItem
                icon="compass"
                label={t("tab_explore")}
                screenName={SCREENS.EXPLORE}
                active={getActive(SCREENS.EXPLORE)}
                onPress={navigate}
            />
            <TabItem
                icon="bookmark"
                label={t("tab_saved")}
                screenName={SCREENS.SAVED}
                active={getActive(SCREENS.SAVED)}
                onPress={navigate}
            />
            <TabItem
                icon="person"
                label={t("tab_profile")}
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
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12, // Safe area handling
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 8,
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 4,
    },
    activeIndicator: {
        position: 'absolute',
        top: -10, // Line at top of tab
        width: 20,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    tabLabel: {
        fontSize: 10,
        color: COLORS.secondaryText,
        fontWeight: '500',
    },
    activeTabLabel: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});

export default BottomNavigation;
