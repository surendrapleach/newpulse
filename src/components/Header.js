import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../services/NavigationContext';
import { useLanguage } from '../services/LanguageContext';
import { useTheme } from '../services/ThemeContext';

const Header = () => {
    const { navigate } = useNavigation();
    const { t } = useLanguage();
    const { colors } = useTheme();
    const [placeholder, setPlaceholder] = useState('');
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const phrases = useMemo(
        () => [
            t("header_phrase_traditions"),
            t("header_phrase_articles"),
            t("header_phrase_history"),
            t("header_phrase_culture"),
        ],
        [t]
    );

    useEffect(() => {
        if (index === phrases.length) {
            setIndex(0);
            return;
        }

        if (subIndex === phrases[index].length + 1 && !isDeleting) {
            setTimeout(() => setIsDeleting(true), 1000);
            return;
        }

        if (subIndex === 0 && isDeleting) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % phrases.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, isDeleting, phrases]);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(v => !v);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setPlaceholder(phrases[index].substring(0, subIndex));
    }, [subIndex, index, phrases]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={[styles.title, { color: colors.primary }]}>{t("header_title")}</Text>
                    <Text style={[styles.subtitle, { color: colors.secondaryText }]}>{t("header_subtitle")}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.notificationButton, { backgroundColor: colors.cardBg, shadowColor: colors.text }]}
                    onPress={() => navigate(SCREENS.NOTIFICATIONS)}
                >
                    <Ionicons name="notifications-outline" size={26} color={colors.text} />
                    <View style={[styles.notificationDot, { borderColor: colors.cardBg }]} />
                </TouchableOpacity>
            </View>

            {/* Search Bar with Typing Animation */}
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.searchContainer, { backgroundColor: colors.cardBg, borderColor: colors.primary }]}
                onPress={() => { }} // Could focus input here
            >
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor={colors.primary}
                        placeholderTextColor={colors.secondaryText}
                    />
                    {searchText.length === 0 && !isFocused && (
                        <View style={styles.placeholderContainer} pointerEvents="none">
                            <Text style={styles.placeholderText}>
                                {placeholder}
                                <Text style={{ color: showCursor ? colors.primary : 'transparent' }}>|</Text>
                            </Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="search-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 10,
        height: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 5,
        borderWidth: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        height: 52,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    inputWrapper: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
        paddingVertical: 0,
    },
    placeholderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 15,
        fontWeight: '500',
        color: "#989898ff",
    },
    filterButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Header;
