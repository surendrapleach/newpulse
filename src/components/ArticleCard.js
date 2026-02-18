import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated, TouchableWithoutFeedback, Easing, TouchableOpacity, Share } from 'react-native';
import { COLORS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { MockDataService } from '../data/mockData';
import { useNavigation } from '../services/NavigationContext';
import { useTheme } from '../services/ThemeContext'; // Import useTheme

const { width, height } = Dimensions.get('window');

// Helper to extract plain text from rich content
const getPreviewText = (content) => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content) && content.length > 0) {
        // Find first paragraph
        const firstPara = content.find(block => block.type === 'paragraph');
        if (firstPara && Array.isArray(firstPara.content)) {
            return firstPara.content.map(span => span.text).join('');
        }
    }
    return "Check out this amazing story on Heritage Pulse.";
};

const ArticleCard = ({ article, isActive }) => {
    const { setIsTabBarVisible } = useNavigation();
    const { colors, isDarkMode } = useTheme(); // Use Theme Context
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Animation Value: 1 = Visible, 0 = Hidden
    const visibilityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setIsBookmarked(MockDataService.isBookmarked(article.id));

        if (!isActive) {
            // Reset to default state when swiping away
            setIsControlsVisible(true);
            visibilityAnim.setValue(1);
        } else {
            if (isControlsVisible) {
                setIsTabBarVisible(false);
            }
        }
    }, [isActive, article.id]);

    const toggleControls = () => {
        const nextState = !isControlsVisible;
        setIsControlsVisible(nextState);
        setIsTabBarVisible(!nextState);

        Animated.timing(visibilityAnim, {
            toValue: nextState ? 1 : 0,
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
        }).start();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this article: ${article.title}\n\nRead more on Heritage Pulse app ....!`,
                url: article.image,
                title: article.title,
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    // --- Animations ---
    const contentScale = visibilityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1.02, 1],
    });

    const actionBarTranslateY = visibilityAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    const actionBarOpacity = visibilityAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const previewText = getPreviewText(article.content);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* 1. Hero Image */}
            <View style={styles.imageContainer}>
                <Image source={article.image} style={styles.image} resizeMode="cover" />
                <Animated.View style={[styles.imageOverlay, { opacity: visibilityAnim }]} />

                {/* 2. Source Badge */}
                <Animated.View style={[styles.sourceBadge, { opacity: visibilityAnim }]}>
                    <View style={styles.sourceIcon}>
                        <Text style={styles.sourceInitial}>{article.publisher?.[0] || 'P'}</Text>
                    </View>
                    <Text style={styles.sourceName}>{article.publisher}</Text>
                </Animated.View>
            </View>

            {/* 3. Content Card */}
            <TouchableWithoutFeedback onPress={toggleControls}>
                <View style={[styles.contentCardWrapper, { backgroundColor: colors.background }]}>
                    <Animated.View
                        style={[
                            styles.contentCard,
                            { transform: [{ scale: contentScale }] }
                        ]}
                    >
                        {/* Meta Info */}
                        <View style={styles.metaRow}>
                            <Text style={[styles.category, { color: colors.primary }]}>{article.category}</Text>
                            <Text style={[styles.timestamp, { color: colors.secondaryText }]}>{article.timestamp}</Text>
                        </View>

                        {/* Title */}
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={3} ellipsizeMode="tail">
                            {article.title}
                        </Text>

                        {/* Body Preview */}
                        <Text style={[styles.bodyPreview, { color: colors.secondaryText }]} numberOfLines={6} ellipsizeMode="tail">
                            {article.subtitle} — {previewText}
                        </Text>

                        {/* Keywords */}
                        <View style={styles.keywordsRow}>
                            <Text style={[styles.keyword, { color: colors.primary }]} onPress={() => console.log('Keyword clicked')}>#{article.category}</Text>
                        </View>
                    </Animated.View>

                    {/* 4. Action Bar */}
                    <Animated.View
                        style={[
                            styles.actionBar,
                            {
                                backgroundColor: colors.cardBg,
                                borderColor: colors.border,
                                transform: [{ translateY: actionBarTranslateY }],
                                opacity: actionBarOpacity
                            }
                        ]}
                    >
                        <TouchableOpacity style={styles.actionBtn} onPress={() => { }}>
                            <Ionicons name="heart-outline" size={24} color={colors.text} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{article.likes || '2.4k'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => { }}>
                            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{article.comments || '86'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: COLORS.black, // Fallback
    },
    imageContainer: {
        height: '45%', // Keep relative height
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    sourceBadge: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    sourceIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    sourceInitial: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sourceName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    contentCardWrapper: {
        height: '55%', // Keep relative height
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingBottom: 0,
        overflow: 'hidden',
    },
    contentCard: {
        flex: 1,
        padding: 24,
        paddingTop: 32,
        paddingBottom: 110,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    category: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timestamp: {
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        lineHeight: 30,
    },
    bodyPreview: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    keywordsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    keyword: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
        borderTopWidth: 1,
    },
    actionBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ArticleCard;
