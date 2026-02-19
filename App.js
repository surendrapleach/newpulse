import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar, Animated, Dimensions, Easing, Text, TextInput } from 'react-native';

// Disable font scaling globally to ensure consistent font sizes across Android and iOS
// And set default font family
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };

if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationProvider, useNavigation, SCREENS } from './src/services/NavigationContext';
import { LanguageProvider } from './src/services/LanguageContext';
import { ThemeProvider, useTheme } from './src/services/ThemeContext';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';

// Screens
import SplashScreen from './src/screens/splashScreen/SplashScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import Explore from './src/screens/explore/Explore';
import SavedScreen from './src/screens/saved/SavedScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import Register from './src/screens/register/Register';
import ForgotPassword from './src/screens/register/ForgotPassword';
import BottomNavigation from './src/components/BottomNavigation';
import Notifications from "./src/screens/profile/Notifications";
import PrivacyScreen from './src/screens/profile/PrivacyScreen';
import LanguageScreen from './src/screens/profile/LanguageScreen';

import Login from './src/screens/register/Login';
import Signup from './src/screens/register/Signup';
import AutoScrollingScreen from './src/screens/profile/AutoScrolling';
import ChangePasswordScreen from './src/screens/profile/ChangePassword';
import EditProfileScreen from './src/screens/profile/EditProfile';

const { width } = Dimensions.get('window');

const ScreenRenderer = () => {
  const { currentScreen } = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [prevScreen, setPrevScreen] = useState(SCREENS.SPLASH);

  const TAB_ORDER = {
    [SCREENS.HOME]: 0,
    [SCREENS.EXPLORE]: 1,
    [SCREENS.SAVED]: 2,
    [SCREENS.PROFILE]: 3,
  };

  useEffect(() => {
    let startValue = 0;

    const isTabSwitch =
      Object.values(TAB_ORDER).includes(TAB_ORDER[currentScreen]) &&
      Object.values(TAB_ORDER).includes(TAB_ORDER[prevScreen]);

    if (isTabSwitch) {
      const currentOrder = TAB_ORDER[currentScreen];
      const prevOrder = TAB_ORDER[prevScreen];

      if (currentOrder > prevOrder) {
        startValue = width;
      } else {
        startValue = -width;
      }
    }
    else if (prevScreen === SCREENS.LOGIN && currentScreen === SCREENS.SIGNUP) {
      startValue = width;
    } else if (prevScreen === SCREENS.SIGNUP && currentScreen === SCREENS.LOGIN) {
      startValue = -width;
    } else if (prevScreen === SCREENS.REGISTER && (currentScreen === SCREENS.LOGIN || currentScreen === SCREENS.SIGNUP)) {
      startValue = width;
    }
    else if (
      currentScreen === SCREENS.PRIVACY ||
      currentScreen === SCREENS.LANGUAGE ||
      currentScreen === SCREENS.NOTIFICATIONS
    ) {
      startValue = width;
    }
    else if (
      prevScreen === SCREENS.PRIVACY ||
      prevScreen === SCREENS.LANGUAGE ||
      prevScreen === SCREENS.NOTIFICATIONS
    ) {
      startValue = -width;
    }

    if (prevScreen !== currentScreen) {
      slideAnim.setValue(startValue);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();

      setPrevScreen(currentScreen);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.SPLASH:
        return <SplashScreen />;
      case SCREENS.HOME:
        return <HomeScreen />;
      case SCREENS.EXPLORE:
        return <Explore />;
      case SCREENS.SAVED:
        return <SavedScreen />;
      case SCREENS.PROFILE:
        return <ProfileScreen />;
      case SCREENS.REGISTER:
        return <Register />;
      case SCREENS.LOGIN:
        return <Login />;
      case SCREENS.SIGNUP:
        return <Signup />;
      case SCREENS.FORGOT_PASSWORD:
        return <ForgotPassword />;
      case SCREENS.NOTIFICATIONS:
        return <Notifications />;
      case SCREENS.PRIVACY:
        return <PrivacyScreen />;
      case SCREENS.LANGUAGE:
        return <LanguageScreen />;
      case SCREENS.AUTO_SCROLLING:
        return <AutoScrollingScreen />;
      case SCREENS.CHANGE_PASSWORD:
        return <ChangePasswordScreen />;
      case SCREENS.EDIT_PROFILE:
        return <EditProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: slideAnim }]
      }}
    >
      {renderScreen()}
    </Animated.View>
  );
};

const MainApp = () => { // Renamed from MainLayout to MainApp
  const { currentScreen, isTabBarVisible } = useNavigation();
  const { colors, isDark } = useTheme(); // Added useTheme hook

  // App.js (inside MainLayout)
  const shouldShowTabs = isTabBarVisible &&
    currentScreen !== SCREENS.SPLASH &&
    currentScreen !== SCREENS.REGISTER &&
    currentScreen !== SCREENS.LOGIN &&
    currentScreen !== SCREENS.SIGNUP &&
    currentScreen !== SCREENS.FORGOT_PASSWORD;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
      <ScreenRenderer />
      {shouldShowTabs && <BottomNavigation />}
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NavigationProvider>
              <MainApp />
            </NavigationProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
