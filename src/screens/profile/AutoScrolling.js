import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "../../services/NavigationContext";
import { useLanguage } from "../../services/LanguageContext";
import { useTheme } from "../../services/ThemeContext";
import { COLORS } from "../../utils/theme";
import Toast from "../../components/Toast";
import { wp, hp, rf } from "../../utils/responsive";

const AutoScrollingScreen = () => {
    const { goBack } = useNavigation();
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [speed, setSpeed] = useState(1); // 0: slow, 1: normal, 2: fast
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [pauseOnTouch, setPauseOnTouch] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSave = () => {
        setToastMessage('Scrolling preferences saved successfully! ✓');
        setToastVisible(true);
        setTimeout(() => goBack(), 1500);
    };

    const handleReset = () => {
        setSpeed(0); // Slow
        setAutoRefresh(false); // OFF
        setPauseOnTouch(false); // OFF
        setToastMessage('Settings reset to default values');
        setToastVisible(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={goBack} style={[styles.backButton, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Auto Scrolling</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Description */}
                <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                    <Text style={[styles.description, { color: colors.secondaryText }]}>
                        Customize your auto-scrolling experience for hands-free browsing
                    </Text>
                </View>

                {/* Speed Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="speedometer-outline" size={20} color={colors.text} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Scroll Speed</Text>
                    </View>
                    <View style={styles.optionsContainer}>
                        {['Slow', 'Normal', 'Fast'].map((item, index) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                                    speed === index && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                                ]}
                                onPress={() => setSpeed(index)}
                            >
                                <Ionicons
                                    name={index === 0 ? "speedometer-outline" : index === 1 ? "walk-outline" : "rocket-outline"}
                                    size={20}
                                    color={speed === index ? "#FFF" : colors.text}
                                />
                                <Text style={[
                                    styles.optionText,
                                    { color: colors.text },
                                    speed === index && { color: "#FFF" }
                                ]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Behavior Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={20} color={colors.text} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Behavior Settings</Text>
                    </View>

                    <View style={[styles.settingCard, { backgroundColor: colors.cardBg }]}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                                    <Ionicons name="refresh" size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Refresh</Text>
                                    <Text style={[styles.settingSubtext, { color: colors.secondaryText }]}>
                                        Automatically load new content
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={autoRefresh}
                                onValueChange={setAutoRefresh}
                                trackColor={{ false: colors.border, true: COLORS.primary }}
                                thumbColor="#FFF"
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        <View style={styles.settingItem}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                                    <Ionicons name="hand-left-outline" size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingLabel, { color: colors.text }]}>Pause on Touch</Text>
                                    <Text style={[styles.settingSubtext, { color: colors.secondaryText }]}>
                                        Stop scrolling when touching screen
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={pauseOnTouch}
                                onValueChange={setPauseOnTouch}
                                trackColor={{ false: colors.border, true: COLORS.primary }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: COLORS.primary }]}
                    onPress={handleSave}
                >
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" />
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.resetButton, { borderColor: colors.border }]}
                    onPress={handleReset}
                >
                    <Ionicons name="refresh-outline" size={20} color={colors.secondaryText} />
                    <Text style={[styles.resetButtonText, { color: colors.secondaryText }]}>Reset to Default</Text>
                </TouchableOpacity>
            </ScrollView>

            <Toast
                visible={toastVisible}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
    },
    backButton: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: rf(20),
        fontWeight: '700',
    },
    placeholder: {
        width: wp(10),
    },
    content: {
        padding: wp(5),
        paddingBottom: hp(4),
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        padding: wp(4),
        borderRadius: 14,
        marginBottom: hp(3),
    },
    description: {
        flex: 1,
        fontSize: rf(14),
        lineHeight: 20,
    },
    section: {
        marginBottom: hp(3),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(2),
    },
    sectionTitle: {
        fontSize: rf(16),
        fontWeight: '600',
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: wp(3),
    },
    optionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        paddingVertical: hp(1.5),
        borderRadius: 12,
        borderWidth: 2,
    },
    optionText: {
        fontSize: rf(14),
        fontWeight: '600',
    },
    settingCard: {
        borderRadius: 14,
        padding: wp(4),
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        marginRight: wp(3),
    },
    iconBox: {
        width: wp(11),
        height: wp(11),
        borderRadius: wp(2.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingTextContainer: {
        flex: 1,
    },
    settingLabel: {
        fontSize: rf(15),
        fontWeight: '600',
        marginBottom: hp(0.3),
    },
    settingSubtext: {
        fontSize: rf(12),
        lineHeight: 16,
    },
    divider: {
        height: 1,
        marginVertical: hp(2),
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        borderRadius: 14,
        paddingVertical: hp(2),
        marginBottom: hp(2),
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: rf(16),
        fontWeight: '700',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        borderRadius: 14,
        paddingVertical: hp(1.75),
        borderWidth: 1.5,
    },
    resetButtonText: {
        fontSize: rf(14),
        fontWeight: '600',
    },
});

export default AutoScrollingScreen;