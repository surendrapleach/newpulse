import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, Pressable, ScrollView, Switch, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
// Use Design System Components
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";

import { useTheme } from "../../theme";
import { spacing } from "../../theme/tokens/spacing";
import { radius } from "../../theme/tokens/radius";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { MockDataService } from "../../data/mockData";
import { useLanguage } from "../../services/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "../../components/loading/Loading";
import Toast from "../../components/Toast";
import PersonalizationService from "../../services/PersonalizationService";

const { width } = Dimensions.get('window');

/**
 * Single Setting Item with updated design system styling
 */
const SettingItem = ({ icon, label, hasSwitch, value, onValueChange, onPress, isLast }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }
      ]}
      onPress={onPress}
      disabled={!onPress && !hasSwitch}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight }]}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>

      <View style={styles.settingContent}>
        <Text variant="body" color="textPrimary">{label}</Text>

        {hasSwitch ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.border}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        ) : (
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingGroup = ({ title, children }) => (
  <View style={styles.groupContainer}>
    {title && (
      <Text variant="meta" color="textSecondary" style={styles.groupTitle}>
        {title}
      </Text>
    )}
    <Card padding="none" variant="elevated">
      {children}
    </Card>
  </View>
);

const StatItem = ({ label, value, icon, colors }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={20} color={colors.primary} style={{ marginBottom: 4 }} />
    <Text variant="h3" color="textPrimary">{value}</Text>
    <Text variant="caption" color="textSecondary">{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const { navigate } = useNavigation();
  const { t, language } = useLanguage();
  // Use new theme hook from Design System path
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const profile = MockDataService.getUserProfile(language);

  // Toast Helper
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    showToast(value ? "Notifications are turned ON" : "Notifications are turned OFF");
  };

  const handleAutoScrollToggle = (value) => {
    setAutoScrollEnabled(value);
    showToast(value ? "Auto Scroll turned ON" : "Auto Scroll turned OFF");
  };

  const handleThemeToggle = () => {
    toggleTheme();
    const newMode = !isDarkMode ? "Dark Mode" : "Light Mode";
    showToast(`${newMode} Enabled`);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(SCREENS.REGISTER);
    }, 2500);
  };

  const handleClearInterests = () => {
    Alert.alert(
      "Clear Interests",
      "Are you sure you want to reset your interests and activity data? This will restart your personalization journey.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Everything",
          style: "destructive",
          onPress: async () => {
            await PersonalizationService.setInterests([]);
            await PersonalizationService.resetSessionSync();
            // Optionally clear activity too
            showToast("Interests cleared. Restart recommended.");
          }
        }
      ]
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 5) }]}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarContainer, { shadowColor: colors.textPrimary }]}>
                <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: colors.cardBg }]} />
                <View style={[styles.onlineBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                  <Ionicons name="camera" size={12} color={colors.white} />
                </View>
              </View>
            </View>

            <Text variant="h2" align="center" style={{ marginTop: spacing.m }}>
              {profile.name}
            </Text>
            <Text variant="bodySmall" color="textSecondary" align="center" style={{ marginTop: spacing.xs }}>
              {profile.role}
            </Text>

            <View style={{ marginTop: spacing.l, width: 200 }}>
              <Button
                label={t("profile_edit")}
                variant="outline"
                size="small"
                onPress={() => navigate(SCREENS.EDIT_PROFILE)}
              />
            </View>
          </View>

          {/* Stats */}
          <Card style={styles.statsCard} variant="elevated">
            <StatItem value={profile.stats.saved} label={t("profile_bookmarks")} icon="bookmark" colors={colors} />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatItem value="12" label="Read" icon="book" colors={colors} />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <StatItem value="5" label="Comments" icon="chatbubble" colors={colors} />
          </Card>

          {/* Settings Sections */}
          <View style={styles.settingsArea}>
            <SettingGroup title="Library">
              <SettingItem
                icon="bookmark-outline"
                label={t("profile_bookmarks")}
                isLast
                onPress={() => navigate(SCREENS.SAVED)}
              />
            </SettingGroup>

            <SettingGroup title={t("profile_settings")}>
              <SettingItem icon="notifications-outline" label={t("profile_notifications")} hasSwitch value={notificationsEnabled} onValueChange={handleNotificationToggle} />
              <SettingItem icon="newspaper-outline" label={t("profile_auto_scroll")} hasSwitch value={autoScrollEnabled} onValueChange={handleAutoScrollToggle} isLast onPress={() => navigate(SCREENS.AUTO_SCROLLING)} />
            </SettingGroup>

            <SettingGroup title="Preferences">
              <SettingItem icon="language-outline" label={t("profile_language")} onPress={() => navigate(SCREENS.LANGUAGE)} />
              <SettingItem icon={isDarkMode ? "sunny-outline" : "moon-outline"} label={isDarkMode ? "Light Mode" : "Dark Mode"} hasSwitch value={isDarkMode} onValueChange={handleThemeToggle} isLast />
            </SettingGroup>

            <SettingGroup title="Personalization">
              <SettingItem
                icon="refresh-outline"
                label="Reset My Feed"
                onPress={handleClearInterests}
                isLast
              />
            </SettingGroup>

            <SettingGroup title="Security">
              <SettingItem icon="shield-checkmark-outline" label={t("profile_privacy")} onPress={() => navigate(SCREENS.PRIVACY)} />
              <SettingItem icon="lock-closed-outline" label={t("profile_change_password")} isLast onPress={() => navigate(SCREENS.CHANGE_PASSWORD)} />
            </SettingGroup>

            {/* Logout */}
            <View style={{ marginTop: spacing.xl, marginBottom: spacing.xxl }}>
              <Button
                label={t("profile_sign_out")}
                variant="ghost"
                textColor="error"
                onPress={handleLogout}
                style={{ borderWidth: 1, borderColor: colors.error }}
              />
            </View>

            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Text variant="caption" color="textTertiary">Version 1.0.0</Text>
              <Text variant="caption" color="textTertiary" style={{ marginTop: 2 }}>Powered By Pleach India Foundation</Text>
            </View>
          </View>
        </Container>
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} onHide={() => setToastVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.l,
    marginTop: spacing.xl,
  },
  avatarWrapper: {
    // purely layout
  },
  avatarContainer: {
    position: 'relative',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 15,
    borderWidth: 3,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: spacing.l,
    marginVertical: spacing.l,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.s,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  settingsArea: {
    paddingHorizontal: spacing.l,
  },
  groupContainer: {
    marginBottom: spacing.l,
  },
  groupTitle: {
    marginBottom: spacing.s,
    marginLeft: spacing.s,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.l,
    height: 56, // Fixed height for consistent tap targets
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.m,
    height: '100%',
  },
});

export default ProfileScreen;
