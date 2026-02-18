import React, { useMemo, useState } from "react";
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

// ==========================================
// Main Explore Component
// ==========================================
const Explore = () => {
    const { navigate } = useNavigation();
    const { t, language } = useLanguage();
    const { colors, isDarkMode } = useTheme();

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
        const filtered = MockDataService.getExploreSection(key, language);
        const label = t(`cat_${key}`);

        navigate(SCREENS.EXPLORE_SECTION_GRID, {
            sectionKey: `category-${key}`,
            titleKey: `cat_${key}`,
            subtitleKey: "explore_category_subtitle",
            title: label,
            subtitle: t("explore_category_subtitle", { category: label }),
            subtitleVars: { category: label },
            items: filtered,
        });
    };

    const onOpenDetail = (item) => {
        navigate(SCREENS.DETAIL, { articleId: item?.id });
    };

    const handleSeeAll = (sectionKey, titleKey, subtitleKey, items, columns = 1) => {
        navigate(SCREENS.EXPLORE_SECTION_GRID, {
            sectionKey,
            titleKey,
            subtitleKey,
            title: t(titleKey),
            subtitle: t(subtitleKey),
            items,
            columns
        });
    };

    return (
        <View style={[styles.safe, { backgroundColor: colors.background }]}>
            <Header />
            <ScrollView
                style={[styles.screen, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
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
                    subtitle={t("explore_top_news_subtitle")}
                    data={latestNews}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("topNews", "explore_top_news_title", "explore_top_news_subtitle", latestNews)}
                    seeAllText={t("explore_see_all")}
                />

                <ExploreSection
                    title={t("explore_trending_title")}
                    subtitle={t("explore_trending_subtitle")}
                    data={culturalEvents}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("culturalEvents", "explore_trending_title", "explore_trending_subtitle", culturalEvents)}
                    seeAllText={t("explore_see_all")}
                />

                <ExploreSection
                    title={t("explore_museums_title")}
                    subtitle={t("explore_museums_subtitle")}
                    data={museums}
                    onOpenDetail={onOpenDetail}
                    onSeeAll={() => handleSeeAll("museums", "explore_museums_title", "explore_museums_subtitle", museums, 1)}
                    seeAllText={t("explore_see_all")}
                />

                <View style={{ height: 28 }} />
            </ScrollView>
        </View>
    );
};

// ==========================================
// Explore Section Grid Component (See All View)
// ==========================================
export const ExploreSectionGrid = () => {
    const { params, navigate, goBack } = useNavigation();
    const { t, language } = useLanguage();
    const { colors, isDarkMode } = useTheme();

    // Search Animation State
    const [search, setSearch] = useState("");
    const [placeholder, setPlaceholder] = useState('');
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
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

    // Typing Effect
    React.useEffect(() => {
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

    // Cursor Blink
    React.useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(v => !v);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Update Placeholder
    React.useEffect(() => {
        setPlaceholder(phrases[index].substring(0, subIndex));
    }, [subIndex, index, phrases]);


    const sectionKey = params?.sectionKey || "topNews";
    const title = params?.titleKey ? t(params.titleKey, params?.titleVars || {}) : params?.title || t("explore_top_news_title");
    const subtitle = params?.subtitleKey
        ? t(params.subtitleKey, params?.subtitleVars || {})
        : params?.subtitle || t("explore_top_news_subtitle");
    const columns = params?.columns === 2 ? 2 : 1;

    const items = useMemo(() => {
        if (Array.isArray(params?.items) && params.items.length > 0) {
            return params.items
                .map((it) => MockDataService.getArticleById(it.id, language))
                .filter(Boolean);
        }
        return MockDataService.getExploreSection(sectionKey, language);
    }, [params?.items, sectionKey, language]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((x) => (x?.title || "").toLowerCase().includes(q));
    }, [search, items]);

    const rows = useMemo(() => {
        const out = [];
        const step = columns;
        for (let i = 0; i < filtered.length; i += step) out.push(filtered.slice(i, i + step));
        return out;
    }, [filtered, columns]);

    return (
        <View style={[gridStyles.safe, { backgroundColor: colors.background }]}>
            <ScrollView
                style={[gridStyles.screen, { backgroundColor: colors.background }]}
                contentContainerStyle={gridStyles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header: Back Button Left, Text Right */}
                <View style={gridStyles.headerRow}>
                    <Pressable onPress={goBack} hitSlop={10} style={gridStyles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.primary} />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={[gridStyles.h1, { color: colors.text }]}>{t("explore_title")}</Text>
                        <Text style={[gridStyles.sub, { color: colors.secondaryText }]}>{t("explore_subtitle")}</Text>
                    </View>
                </View>

                {/* Search with Animation */}
                <View style={[gridStyles.searchWrap, {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.primary,
                    shadowColor: colors.text
                }]}>
                    <Ionicons name="search" size={18} color={colors.secondaryText} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            style={[gridStyles.searchInput, { color: colors.text }]}
                            returnKeyType="search"
                        />
                        {search.length === 0 && !isFocused && (
                            <View style={StyleSheet.absoluteFillObject} pointerEvents="none" justifyContent="center">
                                <Text style={{ fontSize: 14, color: colors.secondaryText }}>
                                    {placeholder}
                                    <Text style={{ color: showCursor ? colors.primary : 'transparent' }}>|</Text>
                                </Text>
                            </View>
                        )}
                    </View>
                    <Ionicons name="sparkles" size={18} color={colors.primary} />
                </View>

                {/* Title */}
                <View style={gridStyles.sectionHead}>
                    <Text style={[gridStyles.sectionTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[gridStyles.sectionSub, { color: colors.secondaryText }]}>{subtitle}</Text>
                </View>

                {/* List/Grid */}
                <View style={{ marginTop: 14 }}>
                    {rows.map((row, rIdx) => (
                        <View
                            key={rIdx}
                            style={[
                                gridStyles.row,
                                columns === 2 ? gridStyles.rowTwoCol : gridStyles.rowOneCol,
                            ]}
                        >
                            {row.map((item) =>
                                columns === 2 ? (
                                    <GridCard
                                        key={item.id}
                                        item={item}
                                        onPress={() => navigate(SCREENS.DETAIL, { articleId: item?.id })}
                                        colors={colors}
                                    />
                                ) : (
                                    <BigCard
                                        key={item.id}
                                        item={item}
                                        onPress={() => navigate(SCREENS.DETAIL, { articleId: item?.id })}
                                        colors={colors}
                                    />
                                )
                            )}

                            {columns === 2 && row.length === 1 ? <View style={{ flex: 1 }} /> : null}
                        </View>
                    ))}
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>
        </View>
    );
}

// Helper Components for Grid
function BigCard({ item, onPress, colors }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                gridStyles.bigCard,
                {
                    backgroundColor: colors.cardBg,
                    shadowColor: colors.text,
                    borderColor: pressed ? colors.primary : '#ffffff',
                    borderWidth: pressed ? 2 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                }
            ]}
        >
            <View style={[gridStyles.bigImgWrap, { backgroundColor: colors.border }]}>
                <Image source={item.image} style={gridStyles.bigImg} resizeMode="cover" />
                <View style={[gridStyles.badge, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="compass" size={14} color={colors.primary} />
                    <Text style={[gridStyles.badgeText, { color: colors.primary }]}>{item.badge}</Text>
                </View>
            </View>

            <View style={gridStyles.bigBody}>
                <Text style={[gridStyles.bigTitle, { color: colors.text }]} numberOfLines={2}>
                    {truncateText(item.title, 50)}
                </Text>

                <View style={gridStyles.ratingRow}>
                    <View style={gridStyles.ratingPill}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={gridStyles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={[gridStyles.reviewsText, { color: colors.secondaryText }]}>({item.reviews})</Text>
                </View>

                <View style={gridStyles.tagsRow}>
                    {(item.tags || []).slice(0, 2).map((t) => (
                        <View key={t} style={[gridStyles.tagPill, { backgroundColor: colors.background }]}>
                            <Text style={[gridStyles.tagText, { color: colors.text }]}>{t}</Text>
                        </View>
                    ))}
                </View>

                <View style={[gridStyles.metaRow, { borderTopColor: colors.border }]}>
                    <View style={gridStyles.metaItem}>
                        <Ionicons name="location-outline" size={14} color={colors.secondaryText} />
                        <Text style={[gridStyles.metaText, { color: colors.secondaryText }]}>{item.location}</Text>
                    </View>

                    <View style={gridStyles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.secondaryText} />
                        <Text style={[gridStyles.metaText, { color: colors.secondaryText }]}>{item.time}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

function GridCard({ item, onPress, colors }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                gridStyles.gridCard,
                {
                    backgroundColor: colors.cardBg,
                    shadowColor: colors.text,
                    borderColor: pressed ? colors.primary : '#ffffff',
                    borderWidth: pressed ? 2 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }]
                }
            ]}
        >
            <View style={[gridStyles.gridImgWrap, { backgroundColor: colors.border }]}>
                <Image source={item.image} style={gridStyles.gridImg} resizeMode="cover" />
                <View style={[gridStyles.badgeSmall, { backgroundColor: colors.cardBg }]}>
                    <Ionicons name="compass" size={13} color={colors.primary} />
                    <Text style={[gridStyles.badgeTextSmall, { color: colors.primary }]}>{item.badge}</Text>
                </View>
            </View>

            <View style={gridStyles.gridBody}>
                <Text style={[gridStyles.gridTitle, { color: colors.text }]} numberOfLines={2}>
                    {truncateText(item.title, 50)}
                </Text>

                <View style={gridStyles.ratingRow}>
                    <View style={gridStyles.ratingPill}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={gridStyles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={[gridStyles.reviewsText, { color: colors.secondaryText }]}>({item.reviews})</Text>
                </View>
            </View>
        </Pressable>
    );
}

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

const gridStyles = StyleSheet.create({
    safe: { flex: 1 },
    screen: { flex: 1 },
    content: { paddingHorizontal: width * 0.04, paddingTop: 8, paddingBottom: 24 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 4 },
    h1: { fontSize: width * 0.07, fontWeight: "700" },
    sub: { marginTop: 4, fontSize: width * 0.035 },
    backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    searchWrap: {
        marginTop: 14,
        height: 52,
        borderRadius: 14,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        shadowOpacity: Platform.OS === "ios" ? 0.08 : 0,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
    sectionHead: { marginTop: 18 },
    sectionTitle: { fontSize: width * 0.05, lineHeight: 28, fontWeight: "700" },
    sectionSub: { marginTop: 4, fontSize: width * 0.035 },
    row: { marginBottom: 14 },
    rowOneCol: { gap: 14 },
    rowTwoCol: { flexDirection: "row", gap: 14 },
    bigCard: {
        borderRadius: 18,
        overflow: "hidden",
        shadowOpacity: Platform.OS === "ios" ? 0.10 : 0,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    bigImgWrap: { height: height * 0.25 },
    bigImg: { width: "100%", height: "100%" },
    bigBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
    bigTitle: { fontSize: width * 0.045, fontWeight: "700" },
    tagsRow: { marginTop: 10, flexDirection: "row", gap: 8 },
    tagPill: {
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    tagText: { fontSize: 12, fontWeight: "500" },
    metaRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    metaText: { fontSize: 12, fontWeight: "500" },
    gridCard: {
        flex: 1,
        borderRadius: 18,
        overflow: "hidden",
        shadowOpacity: Platform.OS === "ios" ? 0.10 : 0,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    gridImgWrap: { height: height * 0.15 },
    gridImg: { width: "100%", height: "100%" },
    gridBody: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
    gridTitle: { fontSize: width * 0.035, fontWeight: "700" },
    badge: {
        position: "absolute",
        left: 12,
        bottom: 12,
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 32,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        elevation: 2,
    },
    badgeText: { fontSize: 12, fontWeight: "700" },
    badgeSmall: {
        position: "absolute",
        left: 10,
        bottom: 10,
        borderRadius: 16,
        paddingHorizontal: 10,
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },
    badgeTextSmall: { marginLeft: 7, fontSize: 11, fontWeight: "700" },
    ratingRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 },
    ratingPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#1FA84A",
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 24,
    },
    ratingText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    reviewsText: { fontSize: 12 },
});

export default Explore;
