import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Dimensions, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../utils/theme";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import AuthLoading from "../../components/loading/AuthLoading";
import FloatingLabelInput from "../../components/inputs/FloatingLabelInput";
import CustomAlert from "../../components/CustomAlert";
import PersonalizationService from "../../services/PersonalizationService";

const Login = () => {
    const { navigate } = useNavigation();
    const { height } = useWindowDimensions();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleLogin = () => {
        let missingFields = [];
        if (!email) missingFields.push("Email");
        if (!password) missingFields.push("Password");

        if (missingFields.length > 0) {
            showAlert("Missing Fields", `Please enter your ${missingFields.join(" and ")}.`);
            return;
        }

        console.log("Login with:", { email, password });
        setIsLoading(true);
        // Simulate auth delay
        setTimeout(async () => {
            // Simulate fetching cloud data from backend
            const mockCloudData = {
                interests: ['heritage', 'art'],
                activity: { 'heritage': 10, 'dance': 5 }
            };

            // Perform merge of local guest data with cloud data
            await PersonalizationService.mergeAndSync(mockCloudData);

            setIsLoading(false);
            navigate(SCREENS.HOME);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Login Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={require('../../../assets/images/login-pic.png')}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back👋</Text>
                        <Text style={styles.subtitle}>
                            Sign in to continue exploring your heritage.
                        </Text>
                    </View>

                    <View style={styles.form}>

                        <FloatingLabelInput
                            label="Email or Mobile Number"
                            value={email}
                            onChangeText={setEmail}
                            iconName="mail-outline"
                        />

                        <FloatingLabelInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            isPassword={true}
                            secureTextEntry={!isPasswordVisible}
                            isPasswordVisible={isPasswordVisible}
                            togglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                            iconName="lock-closed-outline"
                        />

                        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigate(SCREENS.FORGOT_PASSWORD)}>
                            <Text style={styles.forgotPasswordText}>Recover Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} style={styles.buttonContainer}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.loginButton}
                            >
                                <Text style={styles.loginButtonText}> Sign In </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}> New here? </Text>
                        <TouchableOpacity onPress={() => navigate(SCREENS.SIGNUP)}>
                            <Text style={styles.footerLink}> Create Account </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <AuthLoading visible={isLoading} />
                <CustomAlert
                    visible={alertVisible}
                    title={alertTitle}
                    message={alertMessage}
                    type={alertType}
                    onClose={() => setAlertVisible(false)}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Using safe warm white from theme
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    illustration: {
        width: 120,
        height: 120,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        paddingHorizontal: 20,
        width: "100%",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.secondaryText,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 22,
    },
    form: {
        width: "100%",
        gap: 20,
        paddingHorizontal: 24,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: 4,
    },
    forgotPasswordText: {
        color: COLORS.secondaryText,
        fontWeight: "500",
        fontSize: 14,
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
    loginButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        paddingVertical: 18,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.secondaryText,
        fontSize: 15,
    },
    footerLink: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.primary,
    },
});
