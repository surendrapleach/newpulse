import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../services/ThemeContext';

const OTPModal = ({ visible, onClose, onVerify, isLoading, sentTo }) => {
    const { colors, isDarkMode } = useTheme();
    const [verificationCode, setVerificationCode] = useState("");
    const inputRef = useRef(null);

    // Auto-focus logic
    useEffect(() => {
        if (visible) {
            setVerificationCode("");
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleConfirm = () => {
        onVerify(verificationCode);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
                    <View style={[styles.modalContent, { backgroundColor: colors.cardBg, shadowColor: colors.text }]}>
                        <Text style={[styles.modalTitle, { color: colors.primary }]}>Verification Code ✅</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
                            You need to enter 4-digit code we send to : {"\n"}
                            <Text style={{ fontWeight: 'bold', color: colors.primary }}>{sentTo}</Text>
                        </Text>

                        {/* Wrapper to ensure touches focus the input */}
                        <View style={styles.codeContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.hiddenCodeInput}
                                keyboardType="number-pad"
                                maxLength={4}
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                caretHidden={true}
                                contextMenuHidden={true}
                                selectTextOnFocus={false}
                            />

                            {/* Visual Display of slots */}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => inputRef.current?.focus()}
                                style={styles.codeSlotsContainer}
                            >
                                {[0, 1, 2, 3].map((index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.codeSlot,
                                            {
                                                backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
                                                borderColor: isDarkMode ? '#444' : '#E0E0E0'
                                            },
                                            (verificationCode.length === index || (index === 3 && verificationCode.length === 4)) && {
                                                borderColor: colors.primary,
                                                backgroundColor: isDarkMode ? '#222' : '#FFF',
                                                shadowColor: colors.primary
                                            },
                                            verificationCode.length === index && styles.codeSlotActive // Apply shadow style only if active
                                        ]}
                                    >
                                        <Text style={[styles.codeSlotText, { color: colors.primary }]}>
                                            {verificationCode[index] || ""}
                                        </Text>
                                    </View>
                                ))}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            activeOpacity={0.8}
                            disabled={isLoading}
                            style={styles.modalButtonWrapper}
                        >
                            <LinearGradient
                                colors={["#EB6A00", "#FF8D28"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.modalButton}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {!isLoading && (
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={[styles.cancelButtonText, { color: colors.secondaryText }]}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    kav: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        borderRadius: 20,
        padding: 30,
        width: '85%',
        alignItems: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    codeContainer: {
        width: '100%',
        marginBottom: 20,
        height: 60,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hiddenCodeInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        zIndex: 10,
    },
    codeSlotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        gap: 10,
    },
    codeSlot: {
        width: 50,
        height: 55,
        borderWidth: 1.5,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeSlotActive: {
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    codeSlotText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalButtonWrapper: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalButton: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 15,
        padding: 5,
    },
    cancelButtonText: {
        fontSize: 14,
    },
});

export default OTPModal;
