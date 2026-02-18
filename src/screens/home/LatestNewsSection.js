import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useLanguage } from '../../services/LanguageContext';
import { useTheme } from '../../services/ThemeContext';
import { PALETTE } from '../../utils/theme';
import { MockDataService } from '../../data/mockData';
import { truncateText } from '../../utils/textUtils';

const NewsCard = ({ item, onPress, onShowToast, toastSavedText, colors, isDarkMode }) => {
    const [bookmarked, setBookmarked] = useState(false);

    const handleBookmark = () => {
        const newState = !bookmarked;
        setBookmarked(newState);
        if (newState) {
            onShowToast(toastSavedText);
        }
    };

    return (
        <Pressable
            onPress={() => onPress(item)}
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: colors.cardBg,
                    shadowColor: isDarkMode && pressed ? '#FFFFFF' : colors.text,
                    shadowOpacity: isDarkMode && pressed ? 0.5 : 0.1,
                    shadowRadius: isDarkMode && pressed ? 8 : 4,
                    elevation: isDarkMode && pressed ? 8 : 2,

                    // Interactive Border
                    borderWidth: isDarkMode ? (pressed ? 1.5 : 1) : 0,
                    borderColor: isDarkMode ? '#FFFFFF' : 'transparent',
                    // On Press in Dark Mode: Show thick White accent
                    // Resting in Dark Mode: Show uniform White border
                    borderLeftWidth: isDarkMode ? (pressed ? 4 : 1) : 4,
                    borderLeftColor: isDarkMode
                        ? '#FFFFFF'
                        : (pressed ? colors.primary : 'transparent'),

                    // Active State
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                }
            ]}
        >
            <Image source={item.image} style={styles.thumbnail} />
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.category, { color: colors.secondaryText }]}>{item.category}</Text>
                    <TouchableOpacity onPress={handleBookmark}>
                        <Ionicons
                            name={bookmarked ? "bookmark" : "bookmark-outline"}
                            size={20}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.headline, { color: colors.text }]} numberOfLines={2}>
                    {truncateText(item.title, 50)}
                </Text>
                <View style={styles.footerRow}>
                    <View style={styles.publisherInfo}>
                        <View style={[styles.publisherLogo, { backgroundColor: colors.text }]} />
                        <Text style={[styles.publisherName, { color: colors.secondaryText }]}>{item.publisher}</Text>
                    </View>
                    <View style={styles.timeInfo}>
                        <Ionicons name="time-outline" size={14} color={colors.secondaryText} style={styles.clockIcon} />
                        <Text style={[styles.timestamp, { color: colors.secondaryText }]}>{item.timestamp}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const LatestNewsSection = ({ onShowToast }) => {
    const { language, t } = useLanguage();
    const { colors, isDarkMode } = useTheme();
    const { navigate } = useNavigation();

    const data = useMemo(() => MockDataService.getLatestNews(language), [language]);

    const handlePress = (item) => {
        navigate(SCREENS.DETAIL, { articleId: item.id, item });
    };

    const handleSeeAll = () => {
        navigate(SCREENS.EXPLORE_SECTION_GRID, {
            sectionKey: "topNews",
            titleKey: "explore_top_news_title",
            subtitleKey: "explore_top_news_subtitle",
            title: t("explore_top_news_title"),
            subtitle: t("explore_top_news_subtitle"),
            items: data,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="newspaper-outline" size={24} color={colors.primary} style={styles.icon} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("home_latest")}</Text>
                </View>
                <TouchableOpacity onPress={handleSeeAll}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>{t("home_see_all")}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.list}>
                {data.map(item => (
                    <NewsCard
                        key={item.id}
                        item={item}
                        onPress={handlePress}
                        onShowToast={onShowToast}
                        toastSavedText={t("toast_saved")}
                        colors={colors}
                        isDarkMode={isDarkMode}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        flexDirection: 'column',
        gap: 16,
    },
    cardContainer: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    thumbnail: {
        width: 96,
        height: 96,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    contentContainer: {
        flex: 1,
        height: 96,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    headline: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    publisherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    publisherLogo: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 6,
    },
    publisherName: {
        fontSize: 12,
        fontWeight: '500',
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clockIcon: {
        marginRight: 4,
    },
    timestamp: {
        fontSize: 12,
    },
});

export default LatestNewsSection;
