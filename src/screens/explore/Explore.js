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
import DailyBriefingCard from "../../components/explore/DailyBriefingCard";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safe: { flex: 1 },
    screen: { flex: 1 },
    content: { paddingHorizontal: 0, paddingTop: 8, paddingBottom: 24 },
    sectionKicker: { marginLeft: 16, marginTop: 18, fontSize: 12, letterSpacing: 0.8, fontWeight: "600", marginBottom: 8, textTransform: 'uppercase' },
    categoryRow: { paddingLeft: 16, paddingBottom: 16, gap: 12, paddingRight: 16 },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
    },
    categoryLabelPill: {
        fontSize: 14,
        letterSpacing: 0.3,
    },
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

                {/* AI Feature: Daily Briefing Audio */}
                <DailyBriefingCard onPress={() => console.log('Playing Briefing')} />


                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map((c) => {
                        const isHeritage = c.key === 'heritage'; // Highlight first one like image

                        return (
                            <Pressable
                                key={c.id}
                                onPress={() => onOpenCategory(c.key)}
                                style={[
                                    styles.categoryPill,
                                    {
                                        backgroundColor: isHeritage ? '#ea580c' : (isDarkMode ? '#334155' : '#f1f5f9'),
                                        borderColor: isHeritage ? '#ea580c' : 'transparent',
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryLabelPill,
                                    {
                                        color: isHeritage ? '#fff' : (isDarkMode ? '#e2e8f0' : '#334155'),
                                        fontWeight: isHeritage ? '600' : '500'
                                    }
                                ]}>
                                    {c.label}
                                </Text>
                            </Pressable>
                        );
                    })}
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
