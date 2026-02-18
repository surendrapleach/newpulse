import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../services/ThemeContext';

const Toast = ({ visible, message, onHide, duration = 2000 }) => {
    const { colors, isDarkMode } = useTheme();
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(duration),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onHide) onHide();
            });
        }
    }, [visible, duration, opacity, onHide]);

    if (!visible) return null;

    return (
        <Animated.View style={[
            styles.container,
            { opacity }
        ]} pointerEvents="none">
            <View style={[
                styles.content,
                {
                    backgroundColor: isDarkMode ? '#333' : 'rgba(0, 0, 0, 0.85)',
                    shadowColor: colors.text
                }
            ]}>
                <Text style={[styles.message, { color: '#FFF' }]}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 9999,
        // pointerEvents handled in prop for clarity
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Toast;
