import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Pressable, FlatList, Dimensions, Platform, Share, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import CommentsSheet from "../../components/CommentsSheet";
import { useNavigation } from "../../services/NavigationContext";
import { MockDataService } from "../../data/mockData";
import { useTheme } from "../../services/ThemeContext";
import { COLORS } from "../../utils/theme";
import { useLanguage } from "../../services/LanguageContext";
import { wp, hp, rf } from "../../utils/responsive";
import { truncateText } from "../../utils/textUtils";
import Toast from "../../components/Toast";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ArticleDetailScreen() {
  const { params, goBack, setIsTabBarVisible } = useNavigation();
  const { language, t } = useLanguage();
  const data = useMemo(() => MockDataService.getAllArticles(language), [language]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const flatListRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  useEffect(() => {
    // Default to hiding the main tab bar (since we start in Engaged mode)
    setIsTabBarVisible(false);

    return () => {
      // Restore tab bar when leaving screen
      setIsTabBarVisible(true);
    };
  }, []);

  const startIndex = useMemo(() => {
    if (params?.articleId) {
      const idx = data.findIndex((a) => a.id === params.articleId);
      return idx >= 0 ? idx : 0;
    }
    if (params?.item?.id) {
      const idx = data.findIndex((a) => a.id === params.item.id);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [params, data]);

  const renderArticle = ({ item, index }) => (
    <ArticlePage
      article={item}
      index={index}
      activeIndex={activeArticleIndex}
      setIsTabBarVisible={setIsTabBarVisible}
      t={t}
      showToast={showToast}
    />
  );

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    setActiveArticleIndex(index);
  };

  const { colors, isDarkMode } = useTheme();

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => {
          setIsTabBarVisible(true);
          goBack();
        }} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* Vertical swipeable articles */}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={startIndex}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </Animated.View>
  );
}

// Individual article page component
function ArticlePage({ article, index, activeIndex, setIsTabBarVisible, t, showToast }) {
  const { colors, isDarkMode } = useTheme();
  const content = Array.isArray(article?.content) ? article.content : [];
  // Default to ENGAGED state (Likes tab visible)
  const [isEngaged, setIsEngaged] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(MockDataService.isBookmarked(article?.id));
  const [likes, setLikes] = useState(article?.likes || "0");

  // Sync saved state when article changes or service updates
  useEffect(() => {
    setSaved(MockDataService.isBookmarked(article?.id));
  }, [article?.id]);

  // Helper to format likes (e.g., 2401 -> 2.4k)
  const formatLikes = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Helper to parse likes (e.g., 2.4k -> 2400)
  const parseLikes = (val) => {
    if (typeof val !== 'string') return val || 0;
    if (val.endsWith('k')) {
      return parseFloat(val) * 1000;
    }
    return parseInt(val) || 0;
  };

  // Animated value for engagement bar - START at 1 (Visible)
  const engagementAnim = useSharedValue(1);

  // Heart Button Animation (Small one)
  const buttonScale = useSharedValue(1);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    // Update like count state
    const currentCount = parseLikes(likes);
    setLikes(formatLikes(newLiked ? currentCount + 1 : currentCount - 1));

    if (newLiked) {
      // Pop (scale up and down) the small heart button
      buttonScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1.1, { damping: 12, stiffness: 200 })
      );
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Extract text content and limit it
  const getTextContent = () => {
    if (typeof article?.content === 'string') {
      return truncateText(article.content, 500);
    }

    if (Array.isArray(article?.content) && article.content.length > 0) {
      const fullText = article.content.map((block) =>
        block?.content?.map((seg) => seg?.text).join("") || ""
      ).join(" ");
      return truncateText(fullText, 500);
    }

    return truncateText(article?.headline || article?.subtitle || t("detail_fallback"), 500);
  };

  const textContent = getTextContent();

  // Handle content tap - toggle engagement mode
  const handleToggleMode = () => {
    const newEngagedState = !isEngaged;
    setIsEngaged(newEngagedState);

    // Animate engagement bar
    engagementAnim.value = withSpring(newEngagedState ? 1 : 0, {
      damping: 20,
      stiffness: 100,
      mass: 0.8
    });

    // Control main bottom navigation
    setIsTabBarVisible(!newEngagedState);
  };

  // Reset engagement when article changes - FORCE to Engaged state
  useEffect(() => {
    if (index === activeIndex) {
      // When this article becomes active, ensure it's in default engagement mode
      setIsEngaged(true);
      engagementAnim.value = withSpring(1, { damping: 20, stiffness: 100 });
      setIsTabBarVisible(false); // Hide main tabs by default
    }
  }, [activeIndex, index]);

  const engagementStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(engagementAnim.value, [0, 1], [100, 0])
      }
    ],
    opacity: interpolate(engagementAnim.value, [0, 1], [0, 1]),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: interpolate(engagementAnim.value, [0, 1], [0, 24]),
    borderTopRightRadius: interpolate(engagementAnim.value, [0, 1], [0, 24]),
    marginTop: interpolate(engagementAnim.value, [0, 1], [-80, -24]), // Override when Home Tab (0)
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(engagementAnim.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(engagementAnim.value, [0, 1], [20, 0]) }]
  }));

  return (
    <View style={[styles.articlePage, { backgroundColor: colors.background }]}>
      {/* Hero Image - Fixed top half */}
      <Pressable onPress={handleToggleMode} style={styles.heroContainer}>
        <Image
          source={article?.image}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Image Overlay - Category & Views */}
        <Animated.View style={[styles.imageOverlay, overlayStyle]}>
          <View style={[styles.categoryTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.categoryTagText, { color: isDarkMode ? '#000000' : '#FFFFFF' }]}>{article?.category || "Heritage"}</Text>
          </View>
          <View style={styles.viewsTag}>
            <Ionicons name="eye" size={14} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.viewsText}>{article?.views || "22.k"}</Text>
          </View>
        </Animated.View>
      </Pressable>

      {/* Content Card - Fixed bottom half */}
      <Animated.View style={[
        styles.contentCard,
        contentAnimatedStyle,
        { backgroundColor: colors.background } // Dynamic background
      ]}>
        {/* Clickable Header Area to Toggle Mode */}
        <Pressable onPress={handleToggleMode}>
          {/* Title/Headline - Fixed 30 chars limit */}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {truncateText(article?.headline || article?.title, 50)}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <Pressable
              style={styles.publisherInfo}
              onPress={async () => {
                if (article?.sourceLink) {
                  try {
                    const canOpen = await Linking.canOpenURL(article.sourceLink);
                    if (canOpen) {
                      await Linking.openURL(article.sourceLink);
                    }
                  } catch (e) {
                    console.error("Error opening URL:", e);
                  }
                }
              }}
            >
              <View style={[styles.publisherDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.publisherName, { color: colors.text }]}>{article?.publisher}</Text>
            </Pressable>
            <Text style={[styles.timestamp, { color: colors.secondaryText }]}>{article?.timestamp}</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        </Pressable>

        {/* Scrollable Content */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(15) }}
        >
          <Pressable onPress={handleToggleMode}>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {textContent}
            </Text>

            {/* Added Spacer to prevent clashing with floating engagement bar */}
            <View style={{ height: hp(10) }} />
          </Pressable>
        </Animated.ScrollView>

        {/* Tap hint when not engaged */}
        {!isEngaged && (
          <View style={styles.tapHint}>
            <Ionicons name="chevron-down-outline" size={14} color={colors.secondaryText} />
            <Text style={[styles.tapHintText, { color: colors.secondaryText }]}>scroll more to get the news</Text>
          </View>
        )}
      </Animated.View>

      {/* Fixed Bottom Engagement Bar */}
      <Animated.View style={[
        styles.engagementBar,
        engagementStyle,
        {
          backgroundColor: colors.cardBg,
          shadowColor: isDarkMode ? "#FFFFFF" : "#000", // White glow in dark mode
          shadowOpacity: isDarkMode ? 0.2 : 0.15,
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'transparent'
        }
      ]} pointerEvents={isEngaged ? "auto" : "none"}>
        <Pressable
          style={styles.engageBtn}
          onPress={handleLike}
        >
          <Animated.View style={buttonAnimatedStyle}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={28}
              color={liked ? COLORS.primary : (isDarkMode ? '#FFFFFF' : colors.text)} // Use white heart in dark mode
            />
          </Animated.View>
          <Text style={[
            styles.engageLabel,
            { color: colors.secondaryText },
            liked && { color: COLORS.primary } // Keep orange branding for active state
          ]}>
            {likes}
          </Text>
        </Pressable>

        <Pressable style={styles.engageBtn} onPress={async () => {
          try {
            await Share.share({
              message: `${article.title}\n\nCheck out this article on Heritage Pulse!\n${article.image || ''}`,
              url: article.image || '',
              title: article.title,
            });
          } catch (error) {
            console.error(error.message);
          }
        }}>
          <Ionicons name="logo-whatsapp" size={26} color={COLORS.success} />
          <Text style={[styles.engageLabel, { color: colors.secondaryText }]}>Share</Text>
        </Pressable>

        <Pressable
          style={styles.engageBtn}
          onPress={() => {
            const isNowSaved = MockDataService.toggleBookmark(article.id);
            setSaved(isNowSaved);
            showToast(isNowSaved ? t("toast_saved") : "Article removed from saved");
          }}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={26}
            color={saved ? COLORS.primary : (isDarkMode ? '#FFFFFF' : colors.text)}
          />
          <Text style={[
            styles.engageLabel,
            { color: colors.secondaryText },
            saved && { color: COLORS.primary }
          ]}>
            {saved ? "Saved" : "Save"}
          </Text>
        </Pressable>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  backBtn: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  articlePage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    width: "100%",
    height: "50%",
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#eee",
    position: 'absolute',
  },
  floatingHeart: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 30,
    left: wp(4),
    right: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryTagText: {
    color: '#FFF',
    fontSize: rf(12),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  viewsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewsText: {
    color: '#FFF',
    fontSize: rf(12),
    fontWeight: '600',
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(12),
  },
  title: {
    fontSize: rf(22),
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: rf(28),
    marginBottom: hp(1.5),
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  publisherInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  publisherDot: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: COLORS.primary,
  },
  publisherName: {
    fontSize: rf(13),
    fontWeight: "600",
    color: COLORS.text,
  },
  timestamp: {
    fontSize: rf(12),
    color: COLORS.secondaryText,
  },
  divider: {
    height: 2,
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 1,
    marginBottom: hp(1.5),
  },
  bodyText: {
    fontSize: rf(15),
    lineHeight: rf(24),
    color: COLORS.text,
    flex: 1,
  },
  tapHint: {
    position: 'absolute',
    bottom: hp(2),
    alignSelf: 'center',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
    paddingVertical: hp(1),
    opacity: 0.5,
  },
  tapHintText: {
    fontSize: rf(11),
    color: "#BBB",
    fontWeight: '500',
  },
  // Floating Pill Engagement Bar
  engagementBar: {
    position: "absolute",
    bottom: hp(2.5),
    left: wp(5),
    right: wp(5),
    backgroundColor: COLORS.cardBg,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  engageBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: hp(0.5),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    minWidth: wp(18),
  },
  engageLabel: {
    fontSize: rf(11),
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
  engageLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
