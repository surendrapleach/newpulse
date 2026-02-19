import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_GAP = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const styles = StyleSheet.create({
    sectionHead: { marginTop: 18 },
    sectionTitle: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
    sectionSub: { marginTop: 4, fontSize: 14 },
    cardsRow: { paddingTop: 14, paddingBottom: 8, paddingRight: 8 },
    seeAllBtn: {
        marginTop: 10,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    seeAllText: { fontSize: 14, fontWeight: "700" },
    card: {
        width: CARD_WIDTH,
        borderRadius: 18,
        overflow: "hidden",
        shadowOpacity: Platform.OS === "ios" ? 0.10 : 0,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
        marginRight: 4,
    },
    cardImageWrap: { height: 155, backgroundColor: "#eee" },
    cardImage: { width: "100%", height: "100%" },
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
    cardBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
    cardTitle: { fontSize: 16, fontWeight: "700" },
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
});

/* ====================================================================
   1. Helper Components (Private to this file)
   ==================================================================== */

const ExploreCard = ({ item, onPress, colors, isDarkMode }) => (
    <Pressable
        style={({ pressed }) => [
            styles.card,
            {
                backgroundColor: colors.cardBg,
                shadowColor: colors.text,
                borderColor: pressed ? colors.primary : '#ffffff',
                borderWidth: pressed ? 2 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }]
            }
        ]}
        onPress={() => onPress?.(item)}
    >
        <View style={styles.cardImageWrap}>
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <View style={[styles.badge, { backgroundColor: colors.background }]}>
                <Ionicons name="compass" size={14} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>{item.badge}</Text>
            </View>
        </View>

        <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
            </Text>


            <View style={styles.tagsRow}>
                {(item.tags || []).map((t) => (
                    <View key={t} style={[styles.tagPill, { backgroundColor: colors.background }]}>
                        <Text style={[styles.tagText, { color: colors.text }]}>{t}</Text>
                    </View>
                ))}
            </View>

            <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
                <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={colors.secondaryText} />
                    <Text style={[styles.metaText, { color: colors.secondaryText }]}>{item.location}</Text>
                </View>

                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.secondaryText} />
                    <Text style={[styles.metaText, { color: colors.secondaryText }]}>{item.time}</Text>
                </View>
            </View>
        </View>
    </Pressable>
);

const SnapCarousel = ({ data, renderItem }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            disableIntervalMomentum
            bounces={false}
        >
            {data.map((item, i) => (
                <View key={item.id} style={{ marginRight: i === data.length - 1 ? 0 : CARD_GAP }}>
                    {renderItem(item)}
                </View>
            ))}
        </ScrollView>
    );
};

const SectionTitle = ({ title, subtitle, colors }) => (
    <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
            <Text style={[styles.sectionSub, { color: colors.secondaryText }]}>{subtitle}</Text>
        ) : null}
    </View>
);

/* ====================================================================
   2. Main Exported Component
   ==================================================================== */

const ExploreSection = ({
    title,
    subtitle,
    data,
    onOpenDetail,
    onSeeAll,
    seeAllText = "See All"
}) => {
    const { colors, isDarkMode } = useTheme();

    if (!data || data.length === 0) return null;

    return (
        <View>
            <SectionTitle title={title} subtitle={subtitle} colors={colors} />

            <SnapCarousel
                data={data}
                renderItem={(item) => (
                    <ExploreCard
                        item={item}
                        onPress={onOpenDetail}
                        colors={colors}
                        isDarkMode={isDarkMode}
                    />
                )}
            />

            <Pressable style={[styles.seeAllBtn, { borderColor: colors.primary }]} onPress={onSeeAll}>
                <Text style={[styles.seeAllText, { color: colors.text }]}>{seeAllText}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text} />
            </Pressable>
        </View>
    );
};


export default ExploreSection;
