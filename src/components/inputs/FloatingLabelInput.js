import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../utils/theme";

const FloatingLabelInput = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    isPassword,
    togglePasswordVisibility,
    isPasswordVisible,
    iconName,
    keyboardType,
    autoCapitalize
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [focusAnim, isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: iconName ? 45 : 20,
        top: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -10],
        }),
        fontSize: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [COLORS.secondaryText, COLORS.primary],
        }),
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
        zIndex: 1,
    };

    const containerStyle = {
        borderColor: COLORS.primary,
        borderWidth: isFocused ? 2 : 1.5,
        borderRadius: 25,
        backgroundColor: isFocused ? '#FFF8F0' : COLORS.background,
        elevation: 5,
        shadowColor: isFocused ? COLORS.primary : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isFocused ? 0.4 : 0.1,
        shadowRadius: isFocused ? 8 : 3,
    };

    return (
        <View style={[styles.inputGroup, containerStyle]}>
            <Animated.Text style={labelStyle}>
                {label}
            </Animated.Text>
            <View style={styles.inputInnerContainer}>
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={22}
                        color={isFocused ? COLORS.primary : COLORS.secondaryText}
                        style={styles.leadingIcon}
                    />
                )}
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize || "none"}
                    keyboardType={keyboardType}
                    placeholder=""
                    cursorColor={COLORS.primary}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color={isFocused ? COLORS.primary : COLORS.secondaryText}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        position: 'relative',
        marginVertical: 4,
        height: 60,
        justifyContent: 'center',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: '100%',
    },
    leadingIcon: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 10,
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
});

export default FloatingLabelInput;
