import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, Pressable, Platform, FlatList, TouchableOpacity, Dimensions, Share } from 'react-native';
import { MockDataService } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useLanguage } from '../../services/LanguageContext';
import { useTheme } from '../../services/ThemeContext';
import Toast from '../../components/Toast';

import { truncateText } from '../../utils/textUtils';

const { width } = Dimensions.get('window');

const SavedItem = ({ item, onPress, onRemove, onShare, styles, colors }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(item)}
            activeOpacity={0.9}
        >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                        {truncateText(item.title, 50)}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={[styles.publisher, { color: colors.secondaryText }]}>{item.publisher}</Text>
                        <Text style={[styles.dot, { color: colors.secondaryText }]}>•</Text>
                        <Text style={[styles.time, { color: colors.secondaryText }]}>{item.timestamp}</Text>
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => onRemove(item.id)}>
                        <Ionicons name="bookmark" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => onShare(item)}>
                        <Ionicons name="share-social-outline" size={24} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const SavedScreen = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { navigate } = useNavigation();
    const { language, t } = useLanguage();
    const { colors, isDarkMode } = useTheme();

    const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    useEffect(() => {
        loadSavedArticles();
    }, [language]);

    const loadSavedArticles = () => {
        const articles = MockDataService.getSavedArticles(language);
        setSavedArticles(articles);
    };

    const handleRemoveItem = useCallback((id) => {
        MockDataService.toggleBookmark(id);
        setSavedArticles(prev => prev.filter(item => item.id !== id));
        setToastMessage("Article is removed from the saved");
        setToastVisible(true);
    }, []);

    const handleShareItem = useCallback(async (item) => {
        try {
            await Share.share({
                message: `${item.title} \n\n${item.subtitle || ''} \n\nCheck out this article on Heritage Pulse!`,
                url: item.image || '',
                title: item.title,
            });
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    const handlePressItem = useCallback((item) => {
        navigate(SCREENS.DETAIL, { articleId: item.id, item });
    }, [navigate]);

    return (
        <View style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Saved Articles</Text>

                    {/* Neat Badge UI for Count */}
                    <View style={styles.badgeContainer}>
                        <Ionicons name="bookmark" size={16} color={colors.primary} />
                        <Text style={styles.badgeText}>
                            {savedArticles.length} Saved
                        </Text>
                    </View>
                </View>

                {savedArticles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="bookmark" size={48} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyText}>{t("saved_empty_title")}</Text>
                        <Text style={styles.emptySubtext}>{t("saved_empty_subtitle")}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={savedArticles}
                        renderItem={({ item }) => (
                            <SavedItem
                                item={item}
                                onPress={handlePressItem}
                                onRemove={handleRemoveItem}
                                onShare={handleShareItem}
                                styles={styles}
                                colors={colors}
                            />
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <Toast
                    visible={toastVisible}
                    message={toastMessage}
                    onHide={() => setToastVisible(false)}
                />
            </View>
        </View>
    );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
        zIndex: 10,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: width * 0.075,
        fontWeight: 'bold',
        color: colors.primary,
        flex: 1,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBg,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 6,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginTop: 5,
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        height: 120, // Slightly increased height
        backgroundColor: colors.cardBg,
        shadowColor: colors.text,
        borderColor: isDarkMode ? colors.primary : 'transparent',
        borderWidth: isDarkMode ? 0.5 : 0,
    },
    cardImage: {
        width: 120,
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    category: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    publisher: {
        fontSize: 11,
        fontWeight: '500',
    },
    dot: {
        fontSize: 11,
        marginHorizontal: 4,
    },
    time: {
        fontSize: 11,
    },
    actionContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 4,
        paddingTop: 4,
        paddingBottom: 4,
    },
    iconBtn: {
        padding: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: colors.cardBg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colors.text,
    },
    emptySubtext: {
        fontSize: 15,
        textAlign: 'center',
        maxWidth: '70%',
        lineHeight: 22,
        color: colors.secondaryText,
    },
});

export default SavedScreen;
