import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    StatusBar,
    Share,
    Platform,
    Modal,
    ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../../services/NavigationContext';
import { useTheme } from '../../services/ThemeContext';
import { MockDataService } from '../../data/mockData';
import { useLanguage } from '../../services/LanguageContext';
import PersonalizationService from '../../services/PersonalizationService';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Initial estimate, will be updated by onLayout
const TOP_BAR_HEIGHT = 50;
const BANNER_HEIGHT = 64;
// Recalibrated for taller BottomNavigation (52px base + padding)
const INITIAL_ITEM_HEIGHT = SCREEN_HEIGHT - (Platform.OS === 'ios' ? 105 : 95) - TOP_BAR_HEIGHT;

const MOCK_ADS = [
    {
        id: 'ad_tales',
        title: 'Tales Below the Heels',
        subtitle: 'Experience the magic of forgotten stories.',
        buttonText: 'Book Now',
        url: 'https://pleachindia.org/tales-below-the-heels-2/'
    },
    {
        id: 'ad1',
        title: 'Experience Heritej Pulse Premium',
        subtitle: 'Ad-free reading & exclusive cultural deep-dives.',
        buttonText: 'Upgrade',
        url: 'https://pleachindia.org/'
    },
    {
        id: 'ad2',
        title: 'Visit the National Museum',
        subtitle: 'Explore 5,000 years of history today.',
        buttonText: 'Book Now',
        url: 'https://www.nationalmuseumindia.gov.in/'
    },
    {
        id: 'ad3',
        title: 'Authentic Handcrafted Silks',
        subtitle: 'Support local artisans from Varanasi.',
        buttonText: 'Shop Now',
        url: 'https://pleachindia.org/'
    },
    {
        id: 'ad4',
        title: 'Cultural Heritage Tour 2026',
        subtitle: 'Join our curated journey through Rajasthan.',
        buttonText: 'Join'
    }
];

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        ...Platform.select({
            web: {
                userSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
            }
        }),
    },
    container: {
        flex: 1,
    },
    card: {
        width: width,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: '40%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    badge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 28,
        marginBottom: 8,
    },
    timeLabel: {
        fontSize: 12,
        marginBottom: 10,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        opacity: 0.9,
    },
    sourceContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    sourcePrefix: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    sourceText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    floatingActions: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        gap: 12,
        flexDirection: 'row',
    },
    floatingButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
            web: {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }
        }),
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        paddingTop: Platform.OS === 'ios' ? 12 : 5,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    closeHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#DDD',
        borderRadius: 3,
        marginBottom: 8,
        marginTop: Platform.OS === 'ios' ? 40 : 5,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    modalUrl: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        marginHorizontal: 15,
        textAlign: 'center',
    },
    externalButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webModalWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        justifyContent: 'flex-end',
    },
    webModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iframeOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        pointerEvents: 'none',
    },
    iframeOverlayText: {
        fontSize: 11,
        color: '#999',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    categoryBar: {
        height: TOP_BAR_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        zIndex: 10,
    },
    categoryBarContent: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    categoryTabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeCategoryTabText: {
        fontWeight: 'bold',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    bannerAdContainer: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderTopWidth: 1,
        ...Platform.select({
            web: {
                cursor: 'pointer'
            }
        })
    },
    adBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 12,
    },
    adBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    adContent: {
        flex: 1,
        marginRight: 10
    },
    adTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2
    },
    adSubtitle: {
        fontSize: 11,
        opacity: 0.8
    },
    adButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    adButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

const CATEGORIES = [
    { name: 'Trending', key: 'trending' },
    { name: 'Heritage', key: 'heritage' },
    { name: 'Dance', key: 'dance' },
    { name: 'History', key: 'history' },
    { name: 'Events', key: 'events' },
    { name: 'Culture', key: 'culture' },
    { name: 'Food', key: 'food' },
    { name: 'Art', key: 'art' },
    { name: 'News', key: 'news' },
];

export const SourceWebModal = ({ visible, url, onClose }) => {
    const { colors } = useTheme();
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
        .activeOffsetY([0, 20])
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY + context.value.y;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 150 || event.velocityY > 500) {
                translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
                    runOnJS(onClose)();
                });
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            borderTopLeftRadius: interpolate(translateY.value, [0, 100], [0, 30], Extrapolate.CLAMP),
            borderTopRightRadius: interpolate(translateY.value, [0, 100], [0, 30], Extrapolate.CLAMP),
            overflow: 'hidden',
        };
    });

    useEffect(() => {
        if (visible) translateY.value = 0;
    }, [visible]);

    const handleExternalOpen = () => {
        if (Platform.OS === 'web') {
            window.open(url, '_blank');
        } else {
            WebBrowser.openBrowserAsync(url);
        }
    };

    const modalContent = (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modalContainer, animatedStyle, { backgroundColor: colors.background }]}>
                <View style={[styles.modalHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                    <View style={styles.closeHandle} />
                    <View style={styles.modalTitleRow}>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.modalUrl, { color: colors.secondaryText }]} numberOfLines={1}>{url}</Text>
                        <TouchableOpacity onPress={handleExternalOpen} style={styles.externalButton}>
                            <Ionicons name="open-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.background }}>
                    {Platform.OS === 'web' ? (
                        <View style={{ flex: 1 }}>
                            <iframe
                                src={url}
                                style={{ border: 'none', width: '100%', height: '100%' }}
                                title="Source"
                            />
                            <View style={styles.iframeOverlay}>
                                <Text style={styles.iframeOverlayText}>If content doesn't load, use the open button above.</Text>
                            </View>
                        </View>
                    ) : (
                        <WebView
                            source={{ uri: url }}
                            startInLoadingState
                            renderLoading={() => (
                                <ActivityIndicator
                                    style={StyleSheet.absoluteFill}
                                    color={colors.primary}
                                    size="large"
                                />
                            )}
                        />
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
    );

    if (Platform.OS === 'web') {
        if (!visible) return null;
        return (
            <View style={styles.webModalWrapper}>
                <TouchableOpacity activeOpacity={1} style={styles.webModalOverlay} onPress={onClose} />
                {modalContent}
            </View>
        );
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            presentationStyle="overFullScreen"
            transparent={true}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                {modalContent}
            </GestureHandlerRootView>
        </Modal>
    );
};

const BannerAd = ({ ad, onOpenUrl }) => {
    const { colors } = useTheme();
    if (!ad) return null;

    const handlePress = () => {
        if (ad.url && onOpenUrl) {
            onOpenUrl(ad.url);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={[styles.bannerAdContainer, { backgroundColor: colors.cardBg, borderTopColor: colors.border }]}
        >
            <View style={[styles.adBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.adBadgeText}>AD</Text>
            </View>
            <View style={styles.adContent}>
                <Text style={[styles.adTitle, { color: colors.text }]} numberOfLines={1}>{ad.title}</Text>
                <Text style={[styles.adSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>{ad.subtitle}</Text>
            </View>
            <TouchableOpacity style={[styles.adButton, { backgroundColor: colors.primary }]} onPress={handlePress}>
                <Text style={styles.adButtonText}>{ad.buttonText}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export const ShortItem = ({ item, index, height, onOpenUrl }) => {
    const ad = MOCK_ADS[index % MOCK_ADS.length];
    const { colors } = useTheme();
    const [bookmarked, setBookmarked] = useState(MockDataService.isBookmarked(item.id));

    const handleShare = async () => {
        try {
            await Share.share({ message: `${item.title}\n\nRead more at: ${item.sourceLink}` });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleBookmark = () => {
        const isNowBookmarked = MockDataService.toggleBookmark(item.id);
        setBookmarked(isNowBookmarked);

        if (isNowBookmarked && item.category) {
            PersonalizationService.trackActivity(item.category.toLowerCase(), 'BOOKMARK');
        }
    };

    return (
        <View style={[
            styles.card,
            { backgroundColor: colors.background, height: height },
            Platform.OS === 'web' && { scrollSnapAlign: 'start' }
        ]}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{item.category}</Text>
                </View>
                <View style={styles.floatingActions}>
                    <TouchableOpacity onPress={handleBookmark} style={[styles.floatingButton, { backgroundColor: colors.cardBg }]}>
                        <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={bookmarked ? colors.primary : colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={[styles.floatingButton, { backgroundColor: colors.cardBg }]}>
                        <Ionicons name="share-social-outline" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.timeLabel, { color: colors.secondaryText }]}>{item.timestamp}</Text>
                <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={Platform.OS === 'web' ? 12 : 15}>{item.content}</Text>
                {item.sourceLink && (
                    <TouchableOpacity onPress={() => onOpenUrl(item.sourceLink)} style={styles.sourceContainer}>
                        <Text style={[styles.sourcePrefix, { color: colors.secondaryText }]}>Source: </Text>
                        <Text style={[styles.sourceText, { color: colors.primary }]}>{item.publisher || "Original Article"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <BannerAd ad={ad} onOpenUrl={onOpenUrl} />
        </View>
    );
};

const CategoryList = ({ categoryKey, language, itemHeight, searchQuery, onOpenUrl }) => {
    const { params } = useNavigation();
    const { colors } = useTheme();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArticles = async () => {
            setLoading(true);
            try {
                if (searchQuery) {
                    // Fetch search results if query is present
                    const data = MockDataService.searchArticles(searchQuery);
                    // Sort by time-wise (mock: latest first if they have isLatest)
                    const sortedData = data.sort((a, b) => {
                        if (a.isLatest && !b.isLatest) return -1;
                        if (!a.isLatest && b.isLatest) return 1;
                        return 0;
                    });
                    setArticles(sortedData);
                } else if (categoryKey === 'trending') {
                    // This is our personalized "Home Feed"
                    const interests = await PersonalizationService.getInterests();
                    const activity = await PersonalizationService.getActivity();
                    const data = MockDataService.getPersonalizedFeed(interests, activity);
                    setArticles(data);
                } else {
                    const data = MockDataService.getExploreSection(categoryKey, language);
                    setArticles(data);
                }
            } catch (error) {
                console.error("Error loading articles:", error);
            } finally {
                setLoading(false);
            }
        };
        loadArticles();
    }, [categoryKey, language, searchQuery]);

    const initialIndex = React.useMemo(() => {
        if (!articles || !articles.length) return 0;
        const targetId = params?.articleId;
        if (!targetId) return 0;
        const idx = articles.findIndex(a => a.id === targetId);
        return idx >= 0 ? idx : 0;
    }, [articles, params?.articleId]);

    const [activeIndex, setActiveIndex] = useState(initialIndex);

    // Reset index when articles change (e.g. category switch)
    useEffect(() => {
        setActiveIndex(initialIndex);
    }, [articles, initialIndex]);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            setActiveIndex(index);

            // Track activity for personalization
            const item = articles[index];
            if (item && item.category) {
                PersonalizationService.trackActivity(item.category.toLowerCase(), 'VIEW');
            }
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    if (loading) {
        return (
            <View style={[styles.emptyContainer, { width: width, height: itemHeight }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (articles.length === 0) {
        return (
            <View style={[styles.emptyContainer, { width: width, height: itemHeight }]}>
                <Ionicons name="newspaper-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No stories in this category yet.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={articles}
            renderItem={({ item, index }) => <ShortItem item={item} index={index} height={itemHeight} onOpenUrl={onOpenUrl} />}
            keyExtractor={item => item.id}
            pagingEnabled={true}
            key={`list-${categoryKey}-${itemHeight}`}
            vertical
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(data, index) => ({
                length: itemHeight,
                offset: itemHeight * index,
                index,
            })}
            initialScrollIndex={initialIndex}
            style={[{ flex: 1 }, Platform.OS === 'web' && { scrollSnapType: 'y mandatory', overflowY: 'scroll' }]}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={true}
        />
    );
};


const ShortsScreen = () => {
    const { params } = useNavigation();
    const { language } = useLanguage();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const displayCategories = CATEGORIES;

    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [browserVisible, setBrowserVisible] = useState(false);
    const [browserUrl, setBrowserUrl] = useState('');
    const [itemHeight, setItemHeight] = useState(INITIAL_ITEM_HEIGHT);
    const horizontalScrollRef = useRef(null);
    const categoryBarRef = useRef(null);

    // Dynamic height measurement
    const onLayout = (event) => {
        const { height: measuredHeight } = event.nativeEvent.layout;
        if (measuredHeight > 0 && Math.abs(measuredHeight - itemHeight) > 1) {
            setItemHeight(measuredHeight);
        }
    };

    // Content Protection
    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleContextMenu = (e) => e.preventDefault();
            window.addEventListener('contextmenu', handleContextMenu);
            return () => window.removeEventListener('contextmenu', handleContextMenu);
        }
    }, []);

    // Handle initial category/article from params
    useEffect(() => {
        let targetCategory = params?.categoryKey;

        // If we have an articleId but no categoryKey, find the category for that article
        if (params?.articleId && !targetCategory) {
            const article = MockDataService.getArticleById(params.articleId, language);
            if (article) {
                targetCategory = article.category?.toLowerCase();
            }
        }

        if (targetCategory) {
            const index = displayCategories.findIndex(cat => cat.key === targetCategory);
            // Also try matching by name if key fails (backup)
            const finalIndex = index !== -1 ? index : displayCategories.findIndex(cat => cat.name.toLowerCase() === targetCategory);

            if (finalIndex !== -1 && finalIndex !== activeCategoryIndex) {
                setTimeout(() => {
                    handleCategoryPress(finalIndex);
                }, 100);
            }
        }
    }, [params?.categoryKey, params?.articleId]);

    const openBrowser = useCallback((url) => {
        // Fallback for web if iframe might be blocked, or just open modal
        setBrowserUrl(url);
        setBrowserVisible(true);
    }, []);

    const handleCategoryPress = (index) => {
        if (index < 0 || index >= displayCategories.length) return;
        setActiveCategoryIndex(index);
        horizontalScrollRef.current?.scrollTo({ x: index * width, animated: true });

        categoryBarRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5
        });
    };

    // Global Keyboard Listener for Web
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (e) => {
            if (browserVisible) return; // Don't switch categories if browser is open

            if (e.key === 'ArrowRight') {
                setActiveCategoryIndex(prev => {
                    const next = Math.min(prev + 1, CATEGORIES.length - 1);
                    horizontalScrollRef.current?.scrollTo({ x: next * width, animated: true });
                    categoryBarRef.current?.scrollToIndex({ index: next, animated: true, viewPosition: 0.5 });
                    return next;
                });
            } else if (e.key === 'ArrowLeft') {
                setActiveCategoryIndex(prev => {
                    const next = Math.max(prev - 1, 0);
                    horizontalScrollRef.current?.scrollTo({ x: next * width, animated: true });
                    categoryBarRef.current?.scrollToIndex({ index: next, animated: true, viewPosition: 0.5 });
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [browserVisible]);

    const handleScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x || 0;
        const index = Math.round(xOffset / width);

        if (index !== activeCategoryIndex && index >= 0 && index < displayCategories.length) {
            setActiveCategoryIndex(index);
            categoryBarRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
            });
        }
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Category Top Bar */}
            <View style={[
                styles.categoryBar,
                {
                    backgroundColor: colors.background,
                    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : insets.top,
                    height: TOP_BAR_HEIGHT + (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : insets.top)
                }
            ]}>
                <FlatList
                    ref={categoryBarRef}
                    data={displayCategories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryBarContent}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={item.key || item.name}
                            onPress={() => handleCategoryPress(index)}
                            style={[
                                styles.categoryTab,
                                activeCategoryIndex === index && { backgroundColor: `${colors.primary}15` },
                            ]}
                        >
                            <Text style={[
                                styles.categoryTabText,
                                {
                                    color: activeCategoryIndex === index ? colors.primary : '#888',
                                }
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.key || item.name}
                />
            </View>


            {/* Main Horizontal Pager */}
            <View
                style={{ flex: 1 }}
                onLayout={onLayout}
            >
                <Animated.ScrollView
                    ref={horizontalScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    scrollEventThrottle={16}
                    nestedScrollEnabled={true}
                    style={[{ flex: 1 }, Platform.OS === 'web' && { scrollSnapType: 'x mandatory', overflowX: 'scroll' }]}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!browserVisible}
                >
                    {displayCategories.map((cat, index) => (
                        <View
                            key={cat.key || cat.name}
                            style={[
                                { width: width, height: '100%' },
                                Platform.OS === 'web' && { scrollSnapAlign: 'start' }
                            ]}
                        >
                            <CategoryList
                                categoryKey={cat.key}
                                language={language}
                                itemHeight={itemHeight}
                                searchQuery={cat.key === 'search' ? params?.searchQuery : null}
                                onOpenUrl={openBrowser}
                            />
                        </View>
                    ))}
                </Animated.ScrollView>
            </View>
            {/* Header / Category Overlay (Optional, but removed to match 'Saved' immersion) */}

            {browserVisible && (
                <SourceWebModal
                    visible={browserVisible}
                    url={browserUrl}
                    onClose={() => setBrowserVisible(false)}
                />
            )}
        </View>
    );
};


export default ShortsScreen;
