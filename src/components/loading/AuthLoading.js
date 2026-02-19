import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Modal, Dimensions, Text, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../services/ThemeContext";

const { width } = Dimensions.get('window');

const AuthLoading = ({ visible = false }) => {
    const { colors } = useTheme();
    const [message, setMessage] = useState("Securing access...");

    // Animation Values
    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);
    const progress = useSharedValue(0);
    const cardTranslateY = useSharedValue(20);

    useEffect(() => {
        if (visible) {
            // Reset animations
            opacity.value = withTiming(1, { duration: 400 });
            cardTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) });

            // Pulse the logo
            scale.value = withRepeat(
                withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );

            // Progress bar animation
            progress.value = withTiming(1, { duration: 2000 });

            // Message sequence
            const t1 = setTimeout(() => setMessage("Verifying identity..."), 600);
            const t2 = setTimeout(() => setMessage("Welcome!"), 1400);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            opacity.value = withTiming(0, { duration: 300 });
            progress.value = 0;
            scale.value = 0.9;
        }
    }, [visible]);

    const animatedCardStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: cardTranslateY.value }]
    }));

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.container}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <LinearGradient
                    colors={['rgba(255, 209, 102, 0.4)', 'rgba(255, 249, 251, 0.8)']}
                    style={StyleSheet.absoluteFill}
                />

                <Animated.View style={[styles.glassCard, animatedCardStyle, { shadowColor: colors.primary }]}>
                    <Animated.View style={[styles.logoContainer, animatedLogoStyle, { shadowColor: colors.primary }]}>
                        <Image
                            source={require("../../../assets/images/heritej-pulse-logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    <Text style={[styles.loadingText, { color: colors.primary }]}>{message}</Text>

                    <View style={[styles.progressBarWrapper, { backgroundColor: `${colors.primary}20` }]}>
                        <Animated.View style={[styles.progressBar, animatedProgressStyle, { backgroundColor: colors.primary }]} />
                    </View>

                    <View style={styles.iconRow}>
                        <Ionicons name="lock-closed" size={14} color={colors.primary} />
                        <Text style={[styles.secureLink, { color: colors.text }]}>End-to-end encrypted</Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    glassCard: {
        width: width * 0.85,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#FFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    logo: {
        width: 65,
        height: 65,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 0.2,
    },
    progressBarWrapper: {
        width: '100%',
        height: 6,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        borderRadius: 10,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        opacity: 0.5,
    },
    secureLink: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default AuthLoading;
