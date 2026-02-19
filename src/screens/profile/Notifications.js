import React, { useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Platform, Animated, Dimensions, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../services/ThemeContext";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { useLanguage } from "../../services/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "../../components/Toast";
import { NOTIFICATIONS } from "../../data/mockData";
import { truncateText } from "../../utils/textUtils";

const { width } = Dimensions.get('window');

const NotificationItem = ({ item, onPress, onDismiss, onSave, isSaved, styles, colors }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(item)}
            activeOpacity={0.9}
        >
            <Image
                source={item.image}
                style={styles.cardImage}
                contentFit="cover"
                transition={300}
            />
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <View style={styles.topRow}>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={12} color={colors.primary} />
                            <Text style={[styles.locationText, { color: colors.primary }]}>{item.location}</Text>
                        </View>
                        <Text style={[styles.time, { color: colors.secondaryText }]}>{item.timeAgo}</Text>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                        {truncateText(item.title, 50)}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={[styles.source, { color: colors.secondaryText }]}>{item.source}</Text>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => onSave(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={isSaved ? "bookmark" : "bookmark-outline"}
                            size={22}
                            color={isSaved ? colors.primary : colors.text}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { marginTop: 12 }]}
                        onPress={() => onDismiss(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close-circle-outline" size={22} color={colors.secondaryText} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Notifications = () => {
    const { navigate } = useNavigation();
    const [dismissedIds, setDismissedIds] = useState(new Set());
    const [savedIds, setSavedIds] = useState(new Set());
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { t } = useLanguage();
    const { colors, isDarkMode } = useTheme();
    const insets = useSafeAreaInsets();

    const styles = useMemo(() => getStyles(colors, isDarkMode, insets), [colors, isDarkMode, insets]);

    const notifications = NOTIFICATIONS;

    const visibleNotifications = notifications.filter((n) => !dismissedIds.has(n.id));

    const handleDismiss = useCallback((id) => {
        setDismissedIds((prev) => new Set([...prev, id]));
    }, []);

    const handleSave = useCallback((id) => {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setToastMessage("Article removed from saved");
                setToastVisible(true);
            } else {
                next.add(id);
                setToastMessage("article saved");
                setToastVisible(true);
            }
            return next;
        });
    }, []);

    const handlePress = useCallback((item) => {
        navigate(SCREENS.DETAIL, { articleId: item.id });
    }, [navigate]);

    return (
        <View style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <View style={styles.headerIcon}>
                            <Ionicons name="notifications" size={24} color={colors.white} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>{t("notifications_title")}</Text>
                            <Text style={styles.headerSubtitle}>
                                {t("notifications_updates_count", { count: visibleNotifications.length })}
                            </Text>
                        </View>
                    </View>
                </View>

                {visibleNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="notifications-off-outline" size={48} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyText}>{t("notifications_empty")}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={visibleNotifications}
                        renderItem={({ item }) => (
                            <NotificationItem
                                item={item}
                                onPress={handlePress}
                                onDismiss={handleDismiss}
                                onSave={handleSave}
                                isSaved={savedIds.has(item.id)}
                                styles={styles}
                                colors={colors}
                            />
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <Toast
                    visible={toastVisible}
                    message={toastMessage}
                    onHide={() => setToastVisible(false)}
                />
            </View>
        </View>
    );
};

const getStyles = (colors, isDarkMode, insets) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: Math.max(insets.top, 10),
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.background,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.text,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: "500",
        color: colors.secondaryText,
        marginTop: 2,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        marginTop: 20,
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: colors.cardBg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        height: 110,
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: isDarkMode ? colors.border : 'transparent',
    },
    cardImage: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    locationText: {
        fontSize: 10,
        fontWeight: "700",
        textTransform: 'uppercase',
    },
    time: {
        fontSize: 11,
        fontWeight: "500",
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
        lineHeight: 20,
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    source: {
        fontSize: 11,
        fontWeight: "600",
    },
    actionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4,
    },
    actionBtn: {
        padding: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -60, // visual adjustment
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.cardBg,
        marginBottom: 16,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyText: {
        fontSize: 16,
        color: colors.secondaryText,
        fontWeight: "500",
    },
});

export default Notifications;
