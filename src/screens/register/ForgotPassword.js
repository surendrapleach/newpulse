import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../utils/theme";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import AuthLoading from "../../components/loading/AuthLoading";
import OTPModal from "../../components/OTPModal";
import FloatingLabelInput from "../../components/inputs/FloatingLabelInput";
import CustomAlert from "../../components/CustomAlert";

const { width } = Dimensions.get('window');

const ForgotPassword = () => {
    const { navigate, goBack } = useNavigation();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAuthLoading, setShowAuthLoading] = useState(false);

    // Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error");

    const showAlert = (title, message, type = "error") => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const handleReset = () => {
        if (!email) {
            showAlert("Missing Field", "Please enter your email or mobile number.");
            return;
        }
        console.log("Request email for:", { email });
        setModalVisible(true);
    };

    const handleVerifyCode = (code) => {
        if (code.length !== 4) {
            Alert.alert("Invalid Code", "Please enter the full 4-digit verification code.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setModalVisible(false);

            console.log("OTP Verified for:", { email, code });

            setShowAuthLoading(true);
            setTimeout(() => {
                setShowAuthLoading(false);
                navigate(SCREENS.HOME);
            }, 3000);
        }, 1500);
    };

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => goBack ? goBack() : navigate(SCREENS.LOGIN)}
                            style={styles.backBtn}
                        >
                            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <Text style={styles.title}> Forgot Password? 🔒 </Text>
                        <Text style={styles.subtitle}>
                            Don't worry! It happens. Please enter the email or mobile number associated with your account.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <FloatingLabelInput
                            label="Enter Email / Mobile No"
                            value={email}
                            onChangeText={setEmail}
                            iconName="mail-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity onPress={handleReset} activeOpacity={0.8} style={styles.buttonContainer}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.resetButton}
                            >
                                <Text style={styles.resetButtonText}> Get Verification Code </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}> Remember Password? </Text>
                        <TouchableOpacity onPress={() => navigate(SCREENS.LOGIN)}>
                            <Text style={styles.footerLink}> Sign In </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* OTP Modal */}
            <OTPModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onVerify={handleVerifyCode}
                isLoading={isLoading}
                sentTo={email}
            />

            <AuthLoading visible={showAuthLoading} />

            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: width * 0.05,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 40,
        width: "100%",
    },
    backBtn: {
        marginBottom: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: width * 0.04,
        letterSpacing: 0.5,
        color: COLORS.secondaryText,
        lineHeight: 24,
    },
    form: {
        width: "100%",
        gap: 24,
    },
    buttonContainer: {
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    resetButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25, // Match Login button radius
        paddingVertical: 18,
    },
    resetButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: COLORS.secondaryText,
    },
    footerLink: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.primary,
    },
});

export default ForgotPassword;
