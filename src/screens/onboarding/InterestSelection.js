import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useTheme } from '../../services/ThemeContext';
import PersonalizationService from '../../services/PersonalizationService';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ALL_INTERESTS = [
    { label: 'Ancient Engineering', icon: '🪜' },
    { label: 'Traditional Crafts', icon: '🧶' },
    { label: 'Architectural Wonders', icon: '🏛️' },
    { label: 'Preservation', icon: '🏺' },
    { label: 'Spiritual Journeys', icon: '🛕' },
    { label: 'Royal Legacies', icon: '🏰' },
    { label: 'Urban Heritage', icon: '🏠' },
    { label: 'Freedom Stories', icon: '🇮🇳' },
    { label: 'Textile Arts', icon: '🧵' },
    { label: 'Cultural Festivals', icon: '🎉' },
    { label: 'Culinary Traditions', icon: '🥘' },
    { label: 'Tribal Lore', icon: '🏹' },
    { label: 'Modern Museums', icon: '🖼️' },
    { label: 'Wildlife Heritage', icon: '🐅' },
    { label: 'Sacred Spaces', icon: '🕌' },
    { label: 'Ancient Civilizations', icon: '🌍' },
    { label: 'Oral Traditions', icon: '🗣️' },
    { label: 'Art Restorations', icon: '🎨' },
    { label: 'Vedic Science', icon: '📜' },
    { label: 'Heritage Tourism', icon: '🧭' },
    { label: 'Local Legends', icon: '👺' }
];

const InterestSelection = () => {
    const { navigate } = useNavigation();
    const { colors, isDarkMode } = useTheme();
    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (interest) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleContinue = async () => {
        if (selectedInterests.length < 5) return;

        await PersonalizationService.setInterests(selectedInterests);
        navigate(SCREENS.HOME);
    };

    const isComplete = selectedInterests.length >= 5;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>What sparks your curiosity?</Text>
                <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                    Select at least 5 topics to customize your discovery feed.
                </Text>

                <View style={styles.progressRow}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: colors.primary,
                                    width: `${Math.min((selectedInterests.length / 5) * 100, 100)}%`
                                }
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressNumber, { color: colors.primary }]}>
                        {selectedInterests.length} / 5
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.pillContainer}>
                    {ALL_INTERESTS.map((item) => {
                        const isSelected = selectedInterests.includes(item.label);
                        return (
                            <TouchableOpacity
                                key={item.label}
                                activeOpacity={0.7}
                                onPress={() => toggleInterest(item.label)}
                                style={[
                                    styles.pill,
                                    {
                                        backgroundColor: isSelected ? colors.primary : (isDarkMode ? '#1e293b' : '#fff'),
                                        borderColor: isSelected ? colors.primary : colors.border
                                    }
                                ]}
                            >
                                <Text style={styles.pillIcon}>{item.icon}</Text>
                                <Text style={[
                                    styles.pillText,
                                    { color: isSelected ? '#fff' : colors.text }
                                ]}>
                                    {item.label}
                                </Text>
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginLeft: 8 }} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    onPress={handleContinue}
                    disabled={!isComplete}
                    style={[
                        styles.ctaButton,
                        {
                            backgroundColor: isComplete ? colors.primary : colors.secondaryText,
                            opacity: isComplete ? 1 : 0.5
                        }
                    ]}
                >
                    <Text style={styles.ctaText}>
                        {isComplete ? "Let's Go" : `Pick ${5 - selectedInterests.length} more`}
                    </Text>
                    {isComplete && <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 10 }} />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 38,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    progressNumber: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '900',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1.5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pillIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    pillText: {
        fontSize: 15,
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopWidth: 1,
    },
    ctaButton: {
        height: 60,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    ctaText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
    }
});

export default InterestSelection;
