import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { useLanguage } from "../../services/LanguageContext";
import { useTheme } from "../../services/ThemeContext";
import { COLORS } from "../../utils/theme";
import AuthLoading from "../../components/loading/AuthLoading";
import Toast from "../../components/Toast";

const { width } = Dimensions.get('window');

const ChangePasswordScreen = () => {
    const { navigate, goBack } = useNavigation();
    const { t } = useLanguage();
    const { colors, isDarkMode } = useTheme();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [focusedInput, setFocusedInput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Missing Fields", "Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        // Start Loading
        setIsLoading(true);

        // Simulate API call with 3s delay
        setTimeout(() => {
            setIsLoading(false);
            showToast("Password changed successfully");

            // Navigate back after closure or let user see toast
            setTimeout(() => {
                if (goBack) {
                    goBack();
                } else {
                    navigate(SCREENS.PROFILE);
                }
            }, 1000);
        }, 3000);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => goBack ? goBack() : navigate(SCREENS.PROFILE)}
                        style={[styles.backBtn, { backgroundColor: colors.cardBg }]}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerTextContainer}>
                        <Text style={[styles.title, { color: colors.primary }]}>Create new password 🔒</Text>
                        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                            Your new password must be different from previously used passwords.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Current Password Input */}
                        <View style={styles.inputs}>
                            <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed"
                                    size={24}
                                    style={[
                                        styles.inputIcon,
                                        focusedInput === "current" && styles.iconFocused
                                    ]}
                                />
                                <TextInput
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    style={[styles.input, { color: colors.text }]}
                                    secureTextEntry={!showCurrent}
                                    placeholderTextColor={colors.secondaryText}
                                    onFocus={() => setFocusedInput("current")}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCurrent(!showCurrent)}
                                    style={{ padding: 4 }}
                                >
                                    <Ionicons
                                        name={showCurrent ? "eye-outline" : "eye-off-outline"}
                                        size={24}
                                        color="#8E8E8E"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password Input */}
                        <View style={styles.inputs}>
                            <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed"
                                    size={24}
                                    style={[
                                        styles.inputIcon,
                                        focusedInput === "new" && styles.iconFocused
                                    ]}
                                />
                                <TextInput
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    style={[styles.input, { color: colors.text }]}
                                    secureTextEntry={!showNew}
                                    placeholderTextColor={colors.secondaryText}
                                    onFocus={() => setFocusedInput("new")}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNew(!showNew)}
                                    style={{ padding: 4 }}
                                >
                                    <Ionicons
                                        name={showNew ? "eye-outline" : "eye-off-outline"}
                                        size={24}
                                        color="#8E8E8E"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputs}>
                            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed"
                                    size={24}
                                    style={[
                                        styles.inputIcon,
                                        focusedInput === "confirm" && styles.iconFocused
                                    ]}
                                />
                                <TextInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    style={[styles.input, { color: colors.text }]}
                                    secureTextEntry={!showConfirm}
                                    placeholderTextColor={colors.secondaryText}
                                    onFocus={() => setFocusedInput("confirm")}
                                    onBlur={() => setFocusedInput(null)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirm(!showConfirm)}
                                    style={{ padding: 4 }}
                                >
                                    <Ionicons
                                        name={showConfirm ? "eye-outline" : "eye-off-outline"}
                                        size={24}
                                        color="#8E8E8E"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigate(SCREENS.FORGOT_PASSWORD)}
                            style={{ alignSelf: 'flex-end', marginTop: 4 }}
                        >
                            <Text style={{ color: colors.secondaryText, fontSize: 13, fontWeight: '600' }}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleChangePassword} activeOpacity={0.8} style={{ marginTop: 24 }}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.loginButton}
                            >
                                <Text style={styles.loginButtonText}> Update Password </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <AuthLoading visible={isLoading} />
                <Toast
                    visible={toastVisible}
                    message={toastMessage}
                    onHide={() => setToastVisible(false)}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.05,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: "700",
    },
    placeholder: {
        width: 40,
    },
    content: {
        paddingHorizontal: width * 0.06,
        paddingBottom: 40,
    },
    headerTextContainer: {
        marginTop: 24,
        marginBottom: 32,
    },
    title: {
        fontSize: width * 0.065,
        fontWeight: "800",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: width * 0.038,
        lineHeight: 22,
    },
    form: {
        gap: 20,
    },
    inputs: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 4,
        color: COLORS.text,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: COLORS.primary,
        borderWidth: 1.5,
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 12,
        color: "#818181ff",
    },
    iconFocused: {
        color: COLORS.primary,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    loginButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        paddingVertical: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
        letterSpacing: 0.5,
    },
});

export default ChangePasswordScreen;