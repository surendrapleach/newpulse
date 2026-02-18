import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { COLORS } from "../../utils/theme";
import { useLanguage } from "../../services/LanguageContext";
import { useTheme } from "../../services/ThemeContext";
import { MockDataService } from "../../data/mockData";
import Toast from "../../components/Toast";
import { wp, hp, rf } from "../../utils/responsive";

const EditProfileScreen = () => {
    const { goBack, navigate } = useNavigation();
    const { t } = useLanguage();
    const { colors } = useTheme();

    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [editing, setEditing] = useState({ name: false, email: false, phone: false });
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        const profile = MockDataService.getUserProfile();
        setAvatar(profile.avatar || '');
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '+91 9876543210');
    }, []);

    const toggleEdit = (field) => {
        setEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photos to change your profile picture.');
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Request camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
            return;
        }

        // Open camera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleSave = () => {
        MockDataService.updateUserProfile({ avatar, name, email, phone });
        setToastVisible(true);
        setTimeout(() => navigate(SCREENS.PROFILE), 1500);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={goBack} style={[styles.backBtn, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Image Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <TouchableOpacity
                            style={[styles.cameraBtn, { backgroundColor: COLORS.primary }]}
                            onPress={showImageOptions}
                        >
                            <Ionicons name="camera" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.avatarHint, { color: colors.secondaryText }]}>
                        Tap camera icon to change photo
                    </Text>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Form Fields */}
                <View style={styles.form}>
                    {/* Name */}
                    <View style={styles.fieldContainer}>
                        <View style={styles.labelRow}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="person-outline" size={18} color={colors.secondaryText} />
                                <Text style={[styles.label, { color: colors.secondaryText }]}>Name</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleEdit('name')} style={styles.editBtn}>
                                <Ionicons
                                    name={editing.name ? "checkmark-circle" : "create-outline"}
                                    size={20}
                                    color={editing.name ? COLORS.primary : colors.secondaryText}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: editing.name ? colors.cardBg : colors.background,
                                    color: colors.text,
                                    borderColor: editing.name ? COLORS.primary : colors.border,
                                    opacity: editing.name ? 1 : 0.6
                                }
                            ]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.secondaryText}
                            editable={editing.name}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.fieldContainer}>
                        <View style={styles.labelRow}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="mail-outline" size={18} color={colors.secondaryText} />
                                <Text style={[styles.label, { color: colors.secondaryText }]}>Email</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleEdit('email')} style={styles.editBtn}>
                                <Ionicons
                                    name={editing.email ? "checkmark-circle" : "create-outline"}
                                    size={20}
                                    color={editing.email ? COLORS.primary : colors.secondaryText}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: editing.email ? colors.cardBg : colors.background,
                                    color: colors.text,
                                    borderColor: editing.email ? COLORS.primary : colors.border,
                                    opacity: editing.email ? 1 : 0.6
                                }
                            ]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.secondaryText}
                            keyboardType="email-address"
                            editable={editing.email}
                        />
                    </View>

                    {/* Phone */}
                    <View style={styles.fieldContainer}>
                        <View style={styles.labelRow}>
                            <View style={styles.labelWithIcon}>
                                <Ionicons name="call-outline" size={18} color={colors.secondaryText} />
                                <Text style={[styles.label, { color: colors.secondaryText }]}>Phone</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleEdit('phone')} style={styles.editBtn}>
                                <Ionicons
                                    name={editing.phone ? "checkmark-circle" : "create-outline"}
                                    size={20}
                                    color={editing.phone ? COLORS.primary : colors.secondaryText}
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: editing.phone ? colors.cardBg : colors.background,
                                    color: colors.text,
                                    borderColor: editing.phone ? COLORS.primary : colors.border,
                                    opacity: editing.phone ? 1 : 0.6
                                }
                            ]}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            placeholderTextColor={colors.secondaryText}
                            keyboardType="phone-pad"
                            editable={editing.phone}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Ionicons name="checkmark-circle" size={22} color="#FFF" style={styles.saveIcon} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>

            <Toast
                visible={toastVisible}
                message="Changes are done in the profile"
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
    backBtn: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: rf(20),
        fontWeight: "700",
    },
    headerSpacer: {
        width: wp(10),
    },
    content: {
        padding: wp(5),
        paddingBottom: hp(4),
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: hp(1),
    },
    avatar: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarHint: {
        fontSize: rf(12),
        marginTop: hp(0.5),
    },
    divider: {
        height: 1,
        marginVertical: hp(2),
    },
    form: {
        gap: hp(2.5),
    },
    fieldContainer: {
        gap: hp(1),
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(1),
    },
    labelWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    label: {
        fontSize: rf(14),
        fontWeight: "600",
    },
    editBtn: {
        padding: wp(2),
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: wp(3.5),
        paddingVertical: hp(1.75),
        fontSize: rf(16),
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: hp(2),
        borderRadius: 14,
        alignItems: 'center',
        marginTop: hp(3),
        flexDirection: 'row',
        justifyContent: 'center',
        gap: wp(2),
    },
    saveIcon: {
        marginRight: wp(1),
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: rf(16),
        fontWeight: "700",
    },
});

export default EditProfileScreen;