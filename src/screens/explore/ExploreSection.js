import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    sectionContainer: { marginBottom: 36 },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    seeAll: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Layout: Cinematic Showcase (Wide horizontal with side peek)
    showcaseScroll: { paddingLeft: 20, paddingRight: 4 },
    showcaseCard: { width: width * 0.85, height: 200, marginRight: 16, borderRadius: 24, overflow: 'hidden' },
    showcaseImage: { width: '100%', height: '100%' },
    showcaseOverlay: { position: 'absolute', bottom: 0, width: '100%', height: '60%', padding: 16, justifyContent: 'flex-end' },
    showcaseBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 8 },
    showcaseBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    showcaseTitle: { color: '#fff', fontSize: 18, fontWeight: '800', lineHeight: 22 },

    // Layout: Modern Bento (2x2 Grid)
    bentoWrapper: { paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    bentoCard: { width: (width - 52) / 2, height: 160, borderRadius: 20, overflow: 'hidden' },
    bentoImage: { width: '100%', height: '100%' },
    bentoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, justifyContent: 'flex-end' },
    bentoTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },

    // Layout: Clean Discovery Row (Vertical list with side images)
    discoveryList: { paddingHorizontal: 20, gap: 16 },
    discoveryCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    discoveryImage: { width: 68, height: 68, borderRadius: 16 },
    discoveryContent: { flex: 1, paddingBottom: 16, borderBottomWidth: 1 },
    discoveryKicker: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4 },
    discoveryTitle: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
    discoveryMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    discoveryMetaText: { fontSize: 11, opacity: 0.6, fontWeight: '600' }
});

const CinematicShowcase = ({ data, onOpenDetail }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.showcaseScroll}>
        {data.map((item) => (
            <Pressable key={item.id} onPress={() => onOpenDetail(item)} style={styles.showcaseCard}>
                <Image source={item.image} style={styles.showcaseImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.showcaseOverlay}>
                    <View style={styles.showcaseBadge}>
                        <Text style={styles.showcaseBadgeText}>{item.badge}</Text>
                    </View>
                    <Text style={styles.showcaseTitle} numberOfLines={2}>{item.title}</Text>
                </LinearGradient>
            </Pressable>
        ))}
    </ScrollView>
);

const ModernBento = ({ data, onOpenDetail }) => (
    <View style={styles.bentoWrapper}>
        {data.slice(0, 4).map((item) => (
            <Pressable key={item.id} onPress={() => onOpenDetail(item)} style={styles.bentoCard}>
                <Image source={item.image} style={styles.bentoImage} />
                <View style={styles.bentoOverlay}>
                    <Text style={styles.bentoTitle} numberOfLines={2}>{item.title}</Text>
                </View>
            </Pressable>
        ))}
    </View>
);

const CleanDiscoveryRow = ({ data, onOpenDetail, colors }) => (
    <View style={styles.discoveryList}>
        {data.slice(0, 4).map((item) => (
            <Pressable key={item.id} onPress={() => onOpenDetail(item)} style={styles.discoveryCard}>
                <Image source={item.image} style={styles.discoveryImage} />
                <View style={[styles.discoveryContent, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.discoveryKicker, { color: colors.primary }]}>{item.badge}</Text>
                    <Text style={[styles.discoveryTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                    <View style={styles.discoveryMeta}>
                        <Ionicons name="time-outline" size={12} color={colors.secondaryText} />
                        <Text style={[styles.discoveryMetaText, { color: colors.secondaryText }]}>{item.time}</Text>
                    </View>
                </View>
            </Pressable>
        ))}
    </View>
);

const ExploreSection = ({
    title,
    data,
    layout = 'showcase', // 'showcase', 'bento', 'discovery'
    onOpenDetail,
    onSeeAll
}) => {
    const { colors } = useTheme();

    if (!data || data.length === 0) return null;

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Pressable onPress={onSeeAll}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>Explore All</Text>
                </Pressable>
            </View>

            {layout === 'showcase' && <CinematicShowcase data={data} onOpenDetail={onOpenDetail} />}
            {layout === 'bento' && <ModernBento data={data} onOpenDetail={onOpenDetail} />}
            {layout === 'discovery' && <CleanDiscoveryRow data={data} onOpenDetail={onOpenDetail} colors={colors} />}
        </View>
    );
};

export default ExploreSection;
