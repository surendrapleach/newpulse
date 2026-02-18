import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../utils/theme';
import { useNavigation, SCREENS } from '../../services/NavigationContext';

const { width, height } = Dimensions.get('window');

const Register = () => {
    const { navigate } = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Background Gradient - Subtle and Premium */}
            <LinearGradient
                colors={[COLORS.background, '#FFF8F0', '#FFE4C4']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.content}>

                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../../assets/images/heritej-pulse-logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Text Section */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Heritej Pulse</Text>
                    <Text style={styles.tagline}>
                        Capturing the heartbeat of{'\n'}Indian Heritage & Traditions
                    </Text>
                </View>

                {/* Buttons Section */}
                <View style={styles.buttonContainer}>
                    {/* Login Button - Gradient */}
                    <TouchableOpacity
                        onPress={() => navigate(SCREENS.LOGIN)}
                        activeOpacity={0.8}
                        style={styles.buttonShadow}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryButton}
                        >
                            <Ionicons name="log-in-outline" size={24} color={COLORS.white} style={styles.icon} />
                            <Text style={styles.buttonTextPrimary}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign Up Button - Clean Outline */}
                    <TouchableOpacity
                        onPress={() => navigate(SCREENS.SIGNUP)}
                        activeOpacity={0.7}
                        style={styles.secondaryButtonWrapper}
                    >
                        <View style={styles.secondaryButton}>
                            <Ionicons name="person-add-outline" size={24} color={COLORS.primary} style={styles.iconSecondary} />
                            <Text style={styles.buttonTextSecondary}>Create Account</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>v1.0.0</Text>
                </View>

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
        justifyContent: "space-between", // Distribute space evenly
        alignItems: "center",
        paddingHorizontal: width * 0.08,
        paddingTop: height * 0.12, // More top padding for balance
        paddingBottom: height * 0.08,
    },
    logoContainer: {
        alignItems: 'center',
        // Subtle glow for logo
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    logo: {
        width: width * 0.55,
        height: width * 0.55,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: -30,
    },
    title: {
        fontSize: width * 0.095,
        fontWeight: '800', // Extra bold
        textAlign: 'center',
        marginBottom: 12,
        color: COLORS.primary,
        letterSpacing: 0.5,
        // Premium text shadow
        textShadowColor: 'rgba(235, 106, 0, 0.15)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    tagline: {
        fontSize: width * 0.042,
        fontWeight: '500',
        textAlign: 'center',
        color: COLORS.text,
        letterSpacing: 0.3,
        lineHeight: 26,
        opacity: 0.85,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
        alignItems: 'center',
    },
    buttonShadow: {
        width: '100%',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 25, // Pill shape
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16, // Modern rounded rect
        width: '100%',
    },
    secondaryButtonWrapper: {
        width: '100%',
        borderRadius: 16,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16, // Slightly smaller than primary
        borderRadius: 16,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    buttonTextPrimary: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.8,
    },
    buttonTextSecondary: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.8,
    },
    icon: {
        marginRight: 10,
    },
    iconSecondary: {
        marginRight: 10,
    },
    versionText: {
        marginTop: 16,
        color: COLORS.secondaryText,
        fontSize: 12,
        opacity: 0.5,
        fontWeight: '500',
    }
});

export default Register;