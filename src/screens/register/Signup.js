import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../utils/theme";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import AuthLoading from "../../components/loading/AuthLoading";
import OTPModal from "../../components/OTPModal";
import FloatingLabelInput from "../../components/inputs/FloatingLabelInput";
import CustomAlert from "../../components/CustomAlert";

const { width } = Dimensions.get('window');

const Signup = () => {
    const { navigate } = useNavigation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password Visibility States
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // Modal & Loading States
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleSignup = () => {
        let missingFields = [];
        if (!name) missingFields.push("Username");
        if (!email) missingFields.push("Email");
        if (!password) missingFields.push("Password");
        if (!confirmPassword) missingFields.push("Confirm Password");

        if (missingFields.length > 0) {
            showAlert("Missing Fields", `Please enter your ${missingFields.join(", ")}.`);
            return;
        }

        if (password !== confirmPassword) {
            showAlert("Password Mismatch", "Passwords do not match.", "error");
            return;
        }
        // Show verification modal
        setModalVisible(true);
    };

    const handleVerifyCode = (code) => {
        if (code.length !== 4) {
            Alert.alert("Invalid Code", "Please enter the full 4-digit verification code.");
            return;
        }

        setIsLoading(true);
        // Simulate network request / verification
        setTimeout(() => {
            setIsLoading(false);
            setModalVisible(false); // Close OTP modal

            console.log("Signup Verified!", { name, email, password, code });

            // Show Authentication Loading Screen
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
                    {/* Signup Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={require('../../../assets/images/signup-pic.png')}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}> Welcome To Heritej Pulse👋 </Text>
                        <Text style={styles.subtitle}>
                            Hello, I guess you are new around here. You can start using the application after sign up.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Name Input */}
                        <FloatingLabelInput
                            label="Username"
                            value={name}
                            onChangeText={setName}
                            iconName="person-outline"
                        />

                        {/* Email Input */}
                        <FloatingLabelInput
                            label="Email / Mobile No"
                            value={email}
                            onChangeText={setEmail}
                            iconName="mail-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Password Input */}
                        <FloatingLabelInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            isPassword={true}
                            secureTextEntry={!isPasswordVisible}
                            isPasswordVisible={isPasswordVisible}
                            togglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                            iconName="lock-closed"
                        />

                        {/* Confirm Password Input */}
                        <FloatingLabelInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPassword={true}
                            secureTextEntry={!isConfirmPasswordVisible}
                            isPasswordVisible={isConfirmPasswordVisible}
                            togglePasswordVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            iconName="lock-closed"
                        />

                        <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} style={styles.buttonContainer}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.signupButton}
                            >
                                <Text style={styles.signupButtonText}> Sign Up </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}> Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigate(SCREENS.LOGIN)}>
                            <Text style={styles.footerLink}> Login </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Verification Modal Component */}
                    <OTPModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onVerify={handleVerifyCode}
                        isLoading={isLoading}
                        sentTo={email}
                    />

                    {/* Full Screen Auth Loading */}
                    <AuthLoading visible={showAuthLoading} />

                    {/* Custom Alert */}
                    <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        type={alertType}
                        onClose={() => setAlertVisible(false)}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
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
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    illustration: {
        width: 200,
        height: 200,
    },
    header: {
        marginBottom: 30,
        width: "100%",
        paddingTop: 10,
    },
    title: {
        fontSize: width * 0.065,
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
        gap: 20,
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
    signupButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25, // Match Login button radius
        paddingVertical: 18,
    },
    signupButtonText: {
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

export default Signup;
