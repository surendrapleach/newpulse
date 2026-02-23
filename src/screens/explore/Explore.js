import React, { useMemo, useState, useRef, useEffect } from "react";
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

const Explore = () => {
    const { navigate } = useNavigation();
    const { colors, isDarkMode } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [suggestions] = useState([
        'UNESCO Sites', 'Mughal Architecture', 'Ancient Temples', 'Indian Festivals', 'Silk Routes'
    ]);
    const [trendingNews, setTrendingNews] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        // Fetch initial trending news
        const news = MockDataService.getTrendingArticles();
        setTrendingNews(news.slice(0, 4));
    }, []);

    // Perform search when text changes
    useEffect(() => {
        if (searchText.trim().length > 0) {
            setIsSearching(true);
            const results = MockDataService.searchArticles(searchText);
            setSearchResults(results);
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    }, [searchText]);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const onOpenDetail = (item) => {
        navigate(SCREENS.SEARCH_RESULTS, {
            searchQuery: searchText
        });
    };

    const clearSearch = () => {
        setSearchText('');
    };

    return (
        <View style={[styles.safe, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { paddingTop: 60 }]}>
                <View style={[styles.searchBar, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', borderColor: colors.border }]}>
                    <Ionicons name="search" size={20} color={colors.secondaryText} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search heritage, history..."
                        placeholderTextColor={colors.secondaryText}
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        onSubmitEditing={() => {
                            if (searchText.trim()) {
                                navigate(SCREENS.SEARCH_RESULTS, { searchQuery: searchText.trim() });
                            }
                        }}
                    />
                    {searchText.length > 0 && (
                        <Pressable onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
                        </Pressable>
                    )}
                </View>
            </View>

            <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {isSearching ? (
                    /* Search Results View */
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>
                            {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} for "{searchText}"
                        </Text>

                        {searchResults.length > 0 ? (
                            <View style={styles.newsList}>
                                {searchResults.map((item) => (
                                    <Pressable
                                        key={item.id}
                                        style={styles.newsCard}
                                        onPress={() => onOpenDetail(item)}
                                    >
                                        <View style={styles.newsInfo}>
                                            <Text style={[styles.newsCategory, { color: colors.primary }]}>{item.category.toUpperCase()}</Text>
                                            <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                                            <Text style={[styles.newsMeta, { color: colors.secondaryText }]}>{item.time || '5 min read'}</Text>
                                        </View>
                                        <View style={styles.imageWrapper}>
                                            <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.newsImage} />
                                            <View style={styles.videoOverlay}>
                                                <Ionicons name="play" size={12} color="white" />
                                            </View>
                                        </View>
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyPrompt}>
                                <Ionicons name="search-outline" size={48} color={colors.border} />
                                <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                                    No results found for "{searchText}"
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    /* Default Trending View */
                    <>
                        {/* Suggestions / Trending Topics */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Trending Topics</Text>
                            <View style={styles.suggestionGrid}>
                                {suggestions.map((tag, index) => (
                                    <Pressable
                                        key={index}
                                        style={[styles.tag, { backgroundColor: isDarkMode ? 'rgba(0, 86, 86, 0.1)' : colors.primaryLight, borderColor: colors.primary }]}
                                        onPress={() => handleSearch(tag)}
                                    >
                                        <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Trending News Section */}
                        {trendingNews.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Heritage News</Text>
                                    <Pressable onPress={() => navigate(SCREENS.HOME, { categoryKey: 'news' })}>
                                        <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>See All</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.newsList}>
                                    {trendingNews.map((item) => (
                                        <Pressable
                                            key={item.id}
                                            style={styles.newsCard}
                                            onPress={() => onOpenDetail(item)}
                                        >
                                            <View style={styles.newsInfo}>
                                                <Text style={[styles.newsCategory, { color: colors.primary }]}>{item.category.toUpperCase()}</Text>
                                                <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                                                <Text style={[styles.newsMeta, { color: colors.secondaryText }]}>Trending • {item.time || '5 min read'}</Text>
                                            </View>
                                            <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.newsImage} />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.emptyPrompt}>
                            <Ionicons name="library-outline" size={48} color={colors.border} />
                            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                                Discover the richness of Indian Heritage
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 20 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        gap: 10
    },
    input: { flex: 1, fontSize: 16, fontWeight: '500' },
    screen: { flex: 1 },
    content: { padding: 20 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    historyList: { marginTop: 8 },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    historyText: { fontSize: 15, fontWeight: '500' },
    suggestionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    tagText: { fontSize: 14, fontWeight: '600' },
    newsList: { gap: 20 },
    newsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderRadius: 12,
        overflow: 'hidden'
    },
    newsInfo: { flex: 1 },
    newsCategory: { fontSize: 11, fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 },
    newsTitle: { fontSize: 15, fontWeight: '600', lineHeight: 20, marginBottom: 4 },
    newsMeta: { fontSize: 12 },
    newsImage: { width: 90, height: 90, borderRadius: 12 },
    imageWrapper: { position: 'relative' },
    videoOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyPrompt: { alignItems: 'center', marginTop: 40, opacity: 0.8 },
    emptyText: { marginTop: 12, textAlign: 'center', fontSize: 14, fontWeight: '500' }
});

export default Explore;
