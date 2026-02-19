import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    Share,
    Platform,
    StatusBar,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
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
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../services/ThemeContext';
import { MockDataService } from '../../data/mockData';
import { useLanguage } from '../../services/LanguageContext';
import Toast from '../../components/Toast';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOP_BAR_HEIGHT = 50;
// Recalibrated for taller BottomNavigation (52px base + padding) and Top Bar
const INITIAL_ITEM_HEIGHT = SCREEN_HEIGHT - (Platform.OS === 'ios' ? 105 : 95) - TOP_BAR_HEIGHT;

const MOCK_ADS = [
    {
        id: 'ad1',
        title: 'Experience Heritage Pulse Premium',
        subtitle: 'Ad-free reading & exclusive cultural deep-dives.',
        buttonText: 'Upgrade'
    },
    {
        id: 'ad2',
        title: 'Visit the National Museum',
        subtitle: 'Explore 5,000 years of history today.',
        buttonText: 'Book Now'
    },
    {
        id: 'ad3',
        title: 'Authentic Handcrafted Silks',
        subtitle: 'Traditional weavers from Varanasi. Direct to you.',
        buttonText: 'Shop Now'
    },
    {
        id: 'ad4',
        title: 'Cultural Heritage Tour 2026',
        subtitle: 'Limited spots for Hampi and Ajanta caves.',
        buttonText: 'Join Waitlist'
    }
];

const SourceWebModal = ({ visible, url, onClose }) => {
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
        return visible ? (
            <View style={styles.webModalWrapper}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={styles.webModalOverlay}
                />
                {modalContent}
            </View>
        ) : null;
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
            presentationStyle="overFullScreen"
        >
            <View style={styles.webModalOverlay} />
            {modalContent}
        </Modal>
    );
};

const BannerAd = ({ ad }) => {
    const { colors } = useTheme();
    if (!ad) return null;

    return (
        <View style={[styles.bannerAdContainer, { backgroundColor: colors.cardBg, borderTopColor: colors.border }]}>
            <View style={[styles.adBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.adBadgeText}>AD</Text>
            </View>
            <View style={styles.adContent}>
                <Text style={[styles.adTitle, { color: colors.text }]} numberOfLines={1}>{ad.title}</Text>
                <Text style={[styles.adSubtitle, { color: colors.secondaryText }]} numberOfLines={1}>{ad.subtitle}</Text>
            </View>
            <TouchableOpacity style={[styles.adButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.adButtonText}>{ad.buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const SavedShortItem = ({ item, index, height, onRemove, onShare, onOpenUrl }) => {
    const { colors } = useTheme();
    const ad = MOCK_ADS[index % MOCK_ADS.length];

    const handleShare = async () => {
        try {
            await Share.share({ message: `${item.title}\n\nRead more at: ${item.sourceLink}` });
        } catch (error) {
            console.error(error.message);
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
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.gradient} />
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
                <View style={styles.topInfoBar}>
                    <View style={styles.publisherContainer}>
                        <View style={[styles.publisherDot, { backgroundColor: colors.primary }]} />
                        <Text style={styles.publisherText}>{item.publisher}</Text>
                    </View>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
                <View style={styles.floatingActions}>
                    <TouchableOpacity onPress={() => onRemove(item.id)} style={[styles.floatingButton, { backgroundColor: colors.cardBg }]}>
                        <Ionicons name="bookmark" size={22} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={[styles.floatingButton, { backgroundColor: colors.cardBg }]}>
                        <Ionicons name="share-social-outline" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={Platform.OS === 'web' ? 12 : 15}>
                    {item.content || "Exploring the rich heritage of India through curated stories and immersive experiences..."}
                </Text>
                {item.sourceLink && (
                    <TouchableOpacity onPress={() => onOpenUrl(item.sourceLink)} style={styles.sourceContainer}>
                        <Text style={[styles.sourcePrefix, { color: colors.secondaryText }]}>Source: </Text>
                        <Text style={[styles.sourceText, { color: colors.primary }]}>{item.publisher || "Original Article"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <BannerAd ad={ad} />
        </View>
    );
};

const SavedScreen = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [itemHeight, setItemHeight] = useState(INITIAL_ITEM_HEIGHT);
    const [browserVisible, setBrowserVisible] = useState(false);
    const [browserUrl, setBrowserUrl] = useState('');
    const { colors } = useTheme();
    const { language, t } = useLanguage();
    const { navigate } = useNavigation();
    const insets = useSafeAreaInsets();

    const openBrowser = (url) => {
        setBrowserUrl(url);
        setBrowserVisible(true);
    };

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && Math.abs(height - itemHeight) > 1) {
            setItemHeight(height);
        }
    };

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
        setToastMessage("Content removed from bookmarks");
        setToastVisible(true);
    }, []);

    if (savedArticles.length === 0) {
        return (
            <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.emptyState}>
                    <View style={[styles.emptyIconContainer, { backgroundColor: colors.cardBg }]}>
                        <Ionicons name="library-outline" size={48} color={colors.primary} />
                    </View>
                    <Text style={[styles.emptyText, { color: colors.text }]}>Your Library is Empty</Text>
                    <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
                        Save stories while browsing and they will appear here for seamless reading.
                    </Text>
                    <TouchableOpacity
                        style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
                        onPress={() => navigate(SCREENS.HOME)}
                    >
                        <Text style={styles.exploreBtnText}>Go to Stories</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Simple Top Bar for Title & Safe Area */}
            <View style={[
                styles.headerBar,
                {
                    backgroundColor: colors.background,
                    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : insets.top,
                    height: TOP_BAR_HEIGHT + (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : insets.top)
                }
            ]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Articles</Text>
            </View>

            <View style={{ flex: 1 }} onLayout={onLayout}>
                <FlatList
                    data={savedArticles}
                    renderItem={({ item, index }) => (
                        <SavedShortItem
                            item={item}
                            index={index}
                            height={itemHeight}
                            onRemove={handleRemoveItem}
                            onOpenUrl={openBrowser}
                        />
                    )}
                    keyExtractor={item => item.id}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={itemHeight}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    getItemLayout={(data, index) => ({
                        length: itemHeight,
                        offset: itemHeight * index,
                        index,
                    })}
                    style={[{ flex: 1 }, Platform.OS === 'web' && { scrollSnapType: 'y mandatory', overflowY: 'scroll' }]}
                />
            </View>
            <Toast
                visible={toastVisible}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />

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
    safeArea: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    headerBar: {
        height: TOP_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 12,
    },
    emptySubtext: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        opacity: 0.8,
    },
    exploreBtn: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 25,
        elevation: 4,
    },
    exploreBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    categoryBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    categoryBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    topInfoBar: {
        position: 'absolute',
        top: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    publisherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
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
        color: 'white',
    },
    timeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 8,
    },
    floatingActions: {
        position: 'absolute',
        right: 15,
        top: 15,
        gap: 12,
    },
    floatingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 30,
        marginBottom: 8,
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
    },
    sourceText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    floatingActions: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        gap: 12,
    },
    floatingButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalHeader: {
        paddingTop: Platform.OS === 'ios' ? 12 : 5,
        paddingBottom: 15,
        borderBottomWidth: 1,
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
    bannerAdContainer: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    adBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 10,
    },
    adBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    adContent: {
        flex: 1,
    },
    adTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    adSubtitle: {
        fontSize: 11,
        marginTop: 1,
    },
    adButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    adButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default SavedScreen;
