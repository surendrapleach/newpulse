import React, { useMemo, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    Image,
    TextInput,
    Dimensions,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { useLanguage } from "../../services/LanguageContext";
import { useTheme } from "../../services/ThemeContext";
import { MockDataService } from "../../data/mockData";
import { truncateText } from "../../utils/textUtils";
import Header from "../../components/Header";
import ExploreSection from "./ExploreSection";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safe: { flex: 1 },
    screen: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
    sectionKicker: { marginTop: 18, fontSize: 12, letterSpacing: 0.8, fontWeight: "600" },
    categoryRow: { paddingTop: 14, paddingBottom: 8, gap: 22, paddingRight: 8 },
    categoryItem: { width: 96, alignItems: "center" },
    categoryImgWrap: {
        width: 86,
        height: 86,
        borderRadius: 43,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    categoryImg: { width: 78, height: 78, borderRadius: 39 },
    categoryLabel: { marginTop: 10, fontSize: 12, fontWeight: "500" },
});


// ==========================================
// Main Explore Component
// ==========================================
const Explore = () => {
    const { navigate } = useNavigation();
    const { t, language } = useLanguage();
    const { colors, isDarkMode } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;

    const categories = useMemo(() => {
        const rawCategories = MockDataService.getExploreCategories();
        return rawCategories.map(c => ({
            ...c,
            id: `${c.key}-1`,
            label: t(`cat_${c.key}`),
            icon: typeof c.image === 'string' ? { uri: c.image } : c.image
        }));
    }, [t, language]);

    // Data for sections
    const latestNews = useMemo(() => MockDataService.getLatestNews(language), [language]);
    const culturalEvents = useMemo(() => MockDataService.getTrendingArticles(language), [language]);
    const museums = useMemo(() => MockDataService.getExploreSection("museums", language), [language]);

    const onOpenCategory = (key) => {
        // Map explore category keys to ShortsScreen categories if necessary
        const categoryMap = {
            'museums': 'history',
            'monuments': 'heritage',
            'handicrafts': 'art',
            'festivals': 'events',
            'folklore': 'culture',
            'cuisine': 'food'
        };

        const targetCategory = categoryMap[key] || key;
        navigate(SCREENS.HOME, { categoryKey: targetCategory });
    };

    const onOpenDetail = (item) => {
        navigate(SCREENS.HOME, { articleId: item?.id });
    };

    const handleSeeAll = (sectionKey) => {
        const sectionToCategory = {
            'topNews': 'news',
            'culturalEvents': 'events',
            'museums': 'history'
        };

        const categoryKey = sectionToCategory[sectionKey] || 'trending';
        navigate(SCREENS.HOME, { categoryKey });
    };

    return (
        <View style={[styles.safe, { backgroundColor: colors.background }]}>
            <Header scrollY={scrollY} />
            <Animated.ScrollView
                style={[styles.screen, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Browse by category */}
                <Text style={[styles.sectionKicker, { color: colors.secondaryText }]}>{t("explore_browse_by_category")}</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map((c) => (
                        <Pressable key={c.id} style={styles.categoryItem} onPress={() => onOpenCategory(c.key)}>
                            <View
                                style={[
                                    styles.categoryImgWrap,
                                    {
                                        backgroundColor: colors.cardBg,
                                        shadowColor: colors.text,
                                        borderColor: isDarkMode ? colors.primary : 'transparent',
                                        borderWidth: isDarkMode ? 1 : 0
                                    }
                                ]}
                            >
                                <Image source={c.icon} style={styles.categoryImg} resizeMode="cover" />
                            </View>
                            <Text style={[styles.categoryLabel, { color: colors.text }]}>{c.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Modular Sections using Generic Component */}
                <ExploreSection
                    title={t("explore_top_news_title")}
                    data={latestNews}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("topNews")}
                    seeAllText={t("explore_see_all")}
                />

                <ExploreSection
                    title={t("explore_trending_title")}
                    data={culturalEvents}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("culturalEvents")}
                    seeAllText={t("explore_see_all")}
                />

                <ExploreSection
                    title={t("explore_museums_title")}
                    data={museums}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("museums")}
                    seeAllText={t("explore_see_all")}
                />

                <View style={{ height: 28 }} />
            </Animated.ScrollView>
        </View>
    );
};

export default Explore;
