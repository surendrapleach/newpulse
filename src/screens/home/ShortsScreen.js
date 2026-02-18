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
    runOnJS,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from 'react-native-gesture-handler';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useTheme } from '../../services/ThemeContext';
import { MockDataService } from '../../data/mockData';
import { useLanguage } from '../../services/LanguageContext';
import { COLORS } from '../../utils/theme';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Initial estimate, will be updated by onLayout
const TOP_BAR_HEIGHT = 50;
const INITIAL_ITEM_HEIGHT = SCREEN_HEIGHT - (Platform.OS === 'ios' ? 90 : 70) - TOP_BAR_HEIGHT;

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

const SourceWebModal = ({ visible, url, onClose }) => {
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
                translateY.value = withSpring(SCREEN_HEIGHT, { velocity: event.velocityY }, () => {
                    runOnJS(onClose)();
                    translateY.value = 0;
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
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
                <View style={styles.modalHeader}>
                    <View style={styles.closeHandle} />
                    <View style={styles.modalTitleRow}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalUrl} numberOfLines={1}>{url}</Text>
                        <TouchableOpacity onPress={handleExternalOpen} style={styles.externalButton}>
                            <Ionicons name="open-outline" size={22} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {Platform.OS === 'web' ? (
                        <View style={{ flex: 1 }}>
                            <iframe
                                src={url}
                                style={{ border: 'none', width: '100%', height: '100%' }}
                                title="Source"
                            />
                            {/* Overlay message for potentially blocked iframes */}
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
                                    color={COLORS.primary}
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
            animationType="slide"
            presentationStyle="fullScreen"
            transparent={true}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                {modalContent}
            </GestureHandlerRootView>
        </Modal>
    );
};

const ShortItem = ({ item, height, onOpenUrl }) => {
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
        setBookmarked(MockDataService.toggleBookmark(item.id));
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.background, height: height }]}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
                <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.badgeText}>{item.category}</Text>
                </View>
                <View style={styles.topInfoBar}>
                    <View style={styles.publisherContainer}>
                        <View style={[styles.publisherDot, { backgroundColor: COLORS.primary }]} />
                        <Text style={styles.publisherText}>{item.publisher}</Text>
                    </View>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
                <View style={styles.floatingActions}>
                    <TouchableOpacity onPress={handleBookmark} style={styles.floatingButton}>
                        <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={bookmarked ? COLORS.primary : "#333"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.floatingButton}>
                        <Ionicons name="share-social-outline" size={22} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={12}>{item.content}</Text>
                {item.sourceLink && (
                    <TouchableOpacity onPress={() => onOpenUrl(item.sourceLink)} style={styles.sourceContainer}>
                        <Text style={styles.sourcePrefix}>Source: </Text>
                        <Text style={[styles.sourceText, { color: colors.primary }]}>{item.publisher || "Original Article"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const CategoryList = ({ categoryKey, language, itemHeight, onOpenUrl }) => {
    const articles = React.useMemo(() => {
        if (categoryKey === 'trending') return MockDataService.getTrendingArticles(language);
        return MockDataService.getExploreSection(categoryKey, language);
    }, [categoryKey, language]);

    const [activeIndex, setActiveIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

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
            renderItem={({ item }) => <ShortItem item={item} height={itemHeight} onOpenUrl={onOpenUrl} />}
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
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={true}
        />
    );
};

const ShortsScreen = () => {
    const { language } = useLanguage();
    const { colors } = useTheme();
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

    const openBrowser = useCallback((url) => {
        // Fallback for web if iframe might be blocked, or just open modal
        setBrowserUrl(url);
        setBrowserVisible(true);
    }, []);

    const handleCategoryPress = (index) => {
        if (index < 0 || index >= CATEGORIES.length) return;
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
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / width);

        if (index !== activeCategoryIndex && index >= 0 && index < CATEGORIES.length) {
            setActiveCategoryIndex(index);
            categoryBarRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
            });
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" transparent />

            {/* Category Top Bar */}
            <View style={[styles.categoryBar, { backgroundColor: colors.background }]}>
                <FlatList
                    ref={categoryBarRef}
                    data={CATEGORIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryBarContent}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => handleCategoryPress(index)}
                            style={[
                                styles.categoryTab,
                                activeCategoryIndex === index && { backgroundColor: `${COLORS.primary}15` }
                            ]}
                        >
                            <Text style={[
                                styles.categoryTabText,
                                {
                                    color: activeCategoryIndex === index ? COLORS.primary : '#888',
                                    fontWeight: activeCategoryIndex === index ? 'bold' : '600'
                                }
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.key}
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
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    nestedScrollEnabled={true}
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!browserVisible}
                >
                    {CATEGORIES.map((cat, index) => (
                        <View key={cat.key} style={{ width: width, height: '100%' }}>
                            <CategoryList
                                categoryKey={cat.key}
                                language={language}
                                itemHeight={itemHeight}
                                onOpenUrl={openBrowser}
                            />
                        </View>
                    ))}
                </Animated.ScrollView>
            </View>

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

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        height: '45%',
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
    topInfoBar: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    publisherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },
    publisherDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    publisherText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
            },
            android: {
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
            },
            web: {
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }
        }),
    },
    content: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 28,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
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
});

export default ShortsScreen;
