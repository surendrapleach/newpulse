/**
 * ReadingProgressBar.js
 * Shows reading progress as a horizontal bar at the top of the screen
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

const PROGRESS_HEIGHT = 3;

export default function ReadingProgressBar({ scrollY, contentHeight, scrollViewHeight }) {
    // Calculate progress percentage
    const progressStyle = useAnimatedStyle(() => {
        const maxScroll = Math.max(0, contentHeight - scrollViewHeight);
        const progress = maxScroll > 0 ? scrollY.value / maxScroll : 0;

        const width = interpolate(
            progress,
            [0, 1],
            [0, 100],
            Extrapolate.CLAMP
        );

        // Hide when at top, show when scrolling
        const opacity = interpolate(
            scrollY.value,
            [0, 20],
            [0, 1],
            Extrapolate.CLAMP
        );

        return {
            width: `${width}%`,
            opacity,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressTrack, progressStyle]}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 0 : 44, // Below status bar
        left: 0,
        right: 0,
        height: PROGRESS_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.05)',
        zIndex: 999,
    },
    progressTrack: {
        height: PROGRESS_HEIGHT,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
});
