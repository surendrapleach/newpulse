import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, title, message, type = 'error', onClose }) => {
    if (!visible) return null;

    let iconName = 'alert-circle';
    let iconColor = COLORS.error || '#FF4B4B'; // Fallback red
    let titleColor = COLORS.error || '#FF4B4B'; // Fallback red

    if (type === 'success') {
        iconName = 'checkmark-circle';
        iconColor = COLORS.success || '#4CAF50'; // Fallback green
        titleColor = COLORS.success || '#4CAF50';
    } else if (type === 'warning') {
        iconName = 'warning';
        iconColor = COLORS.warning || '#FFC107'; // Fallback yellow
        titleColor = COLORS.warning || '#FFC107';
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={50} color={iconColor} />
                    </View>
                    <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.buttonContainer}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.secondaryText || '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 25, // Match Login button radius
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CustomAlert;
