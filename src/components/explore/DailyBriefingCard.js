import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as NativeText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../theme";
import { spacing } from "../../theme/tokens/spacing";
import { radius } from "../../theme/tokens/radius";

const AudioBars = () => (
    <View style={styles.audioBarsContainer}>
        {[16, 24, 12, 32, 20, 48, 28, 16, 36, 14, 24, 10].map((h, i) => (
            <View
                key={i}
                style={[
                    styles.audioBar,
                    { height: h, opacity: 0.3 + (i % 3) * 0.2 }
                ]}
            />
        ))}
    </View>
);

const DailyBriefingCard = ({ onPress }) => {
    const { colors } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayback = () => setIsPlaying(!isPlaying);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.container}
        >
            <LinearGradient
                colors={['#005656', '#008080']} // Pleach Green gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}
            >
                <View style={styles.content}>

                    {/* Top Badge */}
                    <View style={styles.badgeRow}>
                        <Ionicons name="sparkles" size={12} color="#fbbf24" style={{ marginRight: 6 }} />
                        <NativeText style={styles.badgeText}>AI Morning Brief</NativeText>
                    </View>

                    {/* Main Title */}
                    <NativeText style={styles.title}>Morning Pulse</NativeText>

                    {/* Subtitle */}
                    <NativeText style={styles.subtitle} numberOfLines={2}>
                        2 min audio summary of today's top heritage stories
                    </NativeText>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={styles.listenButton}
                        onPress={togglePlayback}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={18}
                            color="#005656"
                            style={{ marginRight: 6 }}
                        />
                        <NativeText style={styles.listenButtonText}>
                            {isPlaying ? "Playing..." : "Listen Now"}
                        </NativeText>
                    </TouchableOpacity>

                </View>

                {/* Right Side Visual */}
                <View style={styles.visualSide}>
                    <AudioBars />
                </View>

            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
        marginHorizontal: spacing.l,
        borderRadius: radius.xl, // 24px or similar for deep rounding
        shadowColor: "#005656",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
        width: 'auto',
    },
    gradient: {
        padding: spacing.l,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        zIndex: 2,
        paddingTop: spacing.m,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    badgeText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: '800', // Extra bold
        color: '#fff',
        marginBottom: spacing.xs,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.l,
        lineHeight: 20,
        maxWidth: '90%',
    },
    listenButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    listenButtonText: {
        color: '#005656',
        fontWeight: '700',
        fontSize: 14,
    },
    visualSide: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 120, // fixed width for visual area
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    audioBarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingRight: spacing.m,
    },
    audioBar: {
        width: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 2,
    }
});

export default DailyBriefingCard;
