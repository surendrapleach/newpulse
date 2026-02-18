import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { COLORS } from '../../utils/theme';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const { navigate } = useNavigation();

    // Animation shared values
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(20);

    useEffect(() => {
        // Start animations sequence
        logoOpacity.value = withTiming(1, { duration: 1000 });
        logoScale.value = withTiming(1, {
            duration: 1200,
            easing: Easing.out(Easing.back(1.5))
        });

        textOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
        textTranslateY.value = withDelay(800, withTiming(0, { duration: 800 }));

        // Navigate after sequence
        const timeout = setTimeout(() => {
            navigate(SCREENS.HOME);
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.splashGradientStart, COLORS.splashGradientEnd]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
                    <Image
                        source={require('../../../assets/images/heritej-pulse-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.View style={[styles.textContainer, animatedTextStyle]}>
                    <Text style={styles.title}>Heritej Pulse</Text>
                    <Text style={styles.subtitle}>Capturing the heartbeat of Indian Heritage</Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    logo: {
        width: width * 0.45,
        height: width * 0.45,
    },
    textContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 1.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        marginTop: 10,
        opacity: 0.8,
        textAlign: 'center',
    },
});

export default SplashScreen;
