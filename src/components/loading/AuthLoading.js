import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Modal, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../utils/theme";

const { width } = Dimensions.get('window');

const AuthLoading = ({ visible = false }) => {
    const [message, setMessage] = useState("Verifying credentials...");

    // Animation Values
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            // Reset animations
            scale.value = 0;
            opacity.value = 0;
            textOpacity.value = 0;
            setMessage("Verifying credentials...");

            // Start animations
            opacity.value = withTiming(1, { duration: 500 });
            scale.value = withSpring(1, { damping: 12 });
            textOpacity.value = withTiming(1, { duration: 800 });

            // Sequence of messages
            const t1 = setTimeout(() => {
                textOpacity.value = 0;
                setTimeout(() => {
                    setMessage("Securing connection...");
                    textOpacity.value = withTiming(1, { duration: 500 });
                }, 300);
            }, 1200);

            const t2 = setTimeout(() => {
                textOpacity.value = 0;
                setTimeout(() => {
                    setMessage("Successfully Authenticated!");
                    textOpacity.value = withTiming(1, { duration: 500 });
                }, 300);
            }, 2400);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [visible]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: textOpacity.value,
        };
    });

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                {/* Background Image */}
                <Image
                    source={require("../../../assets/images/success-loading.gif")}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />

                {/* Blur Overlay */}
                <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                    <View style={styles.content}>
                        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                            <Ionicons name="shield-checkmark" size={60} color={COLORS.success || '#4CAF50'} />
                        </Animated.View>

                        <Animated.Text style={[styles.loadingText, animatedTextStyle]}>
                            {message}
                        </Animated.Text>

                        {/* Simple loading indicator bar */}
                        <View style={styles.loadingBarContainer}>
                            <Animated.View
                                style={[
                                    styles.loadingBar,
                                    {
                                        width: withTiming(visible ? '100%' : '0%', { duration: 3000 })
                                    }
                                ]}
                            />
                        </View>
                    </View>
                </BlurView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        width: width * 0.8,
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 50,
        padding: 15,
        elevation: 10,
        shadowColor: COLORS.success || '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 0.5,
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    loadingBar: {
        height: '100%',
        backgroundColor: COLORS.success || '#4CAF50',
        borderRadius: 3,
    },
});

export default AuthLoading;
