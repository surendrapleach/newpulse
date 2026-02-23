import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useTheme } from '../../services/ThemeContext';
import { useLanguage } from '../../services/LanguageContext';
import { MockDataService } from '../../data/mockData';
import { ShortItem, SourceWebModal } from '../home/ShortsScreen';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SearchResultsScreen = () => {
    const { params, goBack } = useNavigation();
    const { language } = useLanguage();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [browserVisible, setBrowserVisible] = useState(false);
    const [browserUrl, setBrowserUrl] = useState('');
    const [itemHeight, setItemHeight] = useState(SCREEN_HEIGHT);

    const searchQuery = params?.searchQuery || '';

    useEffect(() => {
        const loadResults = async () => {
            setLoading(true);
            try {
                const results = MockDataService.searchArticles(searchQuery);
                // Sort by time-wise (mock: latest first)
                const sortedResults = results.sort((a, b) => {
                    if (a.isLatest && !b.isLatest) return -1;
                    if (!a.isLatest && b.isLatest) return 1;
                    return 0;
                });
                setArticles(sortedResults);
            } catch (error) {
                console.error("Error loading search results:", error);
            } finally {
                setLoading(false);
            }
        };
        loadResults();
    }, [searchQuery]);

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0) setItemHeight(height);
    };

    const openBrowser = (url) => {
        setBrowserUrl(url);
        setBrowserVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Header / Top Bar */}
            <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={goBack} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    {searchQuery}
                </Text>
            </View>

            <View style={{ flex: 1 }} onLayout={onLayout}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : articles.length > 0 ? (
                    <FlatList
                        data={articles}
                        renderItem={({ item, index }) => (
                            <ShortItem
                                item={item}
                                index={index}
                                height={itemHeight}
                                onOpenUrl={openBrowser}
                            />
                        )}
                        keyExtractor={item => item.id}
                        pagingEnabled
                        vertical
                        showsVerticalScrollIndicator={false}
                        snapToInterval={itemHeight}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        getItemLayout={(data, index) => ({
                            length: itemHeight,
                            offset: itemHeight * index,
                            index,
                        })}
                        style={Platform.OS === 'web' && { scrollSnapType: 'y mandatory', overflowY: 'scroll' }}
                    />
                ) : (
                    <View style={styles.center}>
                        <Ionicons name="search-outline" size={64} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                            No results found for "{searchQuery}"
                        </Text>
                    </View>
                )}
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
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        zIndex: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'left',
        marginLeft: 4,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyText: { marginTop: 15, fontSize: 16, textAlign: 'center', fontWeight: '500' }
});

export default SearchResultsScreen;
