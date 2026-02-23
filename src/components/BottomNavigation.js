import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../services/NavigationContext';
import { useTheme } from '../services/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabItem = ({ icon, screenName, active, onPress }) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={styles.tabItem} onPress={() => onPress(screenName)} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={active ? icon : `${icon}-outline`}
                    size={26}
                    color={active ? colors.primary : colors.secondaryText}
                />
            </View>
        </TouchableOpacity>
    );
};

const BottomNavigation = () => {
    const { currentScreen, navigate } = useNavigation();
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // Don't show bottom nav on Splash
    if (currentScreen === SCREENS.SPLASH) return null;

    // Helper to check active state
    const getActive = (screen) => currentScreen === screen;

    return (
        <View style={[
            styles.container,
            {
                paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 4) : Math.max(insets.bottom * 0.3, 2),
                height: 52 + (Platform.OS === 'android' ? Math.max(insets.bottom, 0) : insets.bottom * 0.3),
                backgroundColor: colors.navBg,
                borderTopWidth: 0,
                elevation: isDark ? 0 : 8,
            }
        ]}>
            <TabItem
                icon="search"
                screenName={SCREENS.SEARCH}
                active={getActive(SCREENS.SEARCH)}
                onPress={navigate}
            />
            <TabItem
                icon="home"
                screenName={SCREENS.HOME}
                active={getActive(SCREENS.HOME)}
                onPress={navigate}
            />
            <TabItem
                icon="sparkles"
                screenName={SCREENS.AI}
                active={getActive(SCREENS.AI)}
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
        paddingTop: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
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
});

export default BottomNavigation;
