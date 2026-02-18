import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert, Platform, Switch, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useTheme } from "../../services/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { MockDataService } from "../../data/mockData";
import { useLanguage } from "../../services/LanguageContext";
import Loading from "../../components/loading/Loading";
import Toast from "../../components/Toast";
import { COLORS } from "../../utils/theme";

const { width } = Dimensions.get('window');

// Reusable Animated Button
const AnimatedButton = ({ onPress, style, children, scaleMin = 0.95 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scaleMin,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Reusable Component for a single setting row
 */
const SettingItem = ({ icon, label, hasSwitch, value, onValueChange, onPress, isLast, colors }) => (
  <TouchableOpacity
    style={[
      styles.settingItem,
      !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 }
    ]}
    onPress={onPress}
    disabled={!onPress && !hasSwitch}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
      <Ionicons name={icon} size={20} color={colors.text} />
    </View>

    <View style={styles.settingContent}>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>

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
        <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
      )}
    </View>
  </TouchableOpacity>
);

const SettingGroup = ({ title, children, colors, isDarkMode }) => (
  <View style={styles.groupContainer}>
    {title && <Text style={[styles.groupTitle, { color: colors.secondaryText }]}>{title}</Text>}
    <View style={[
      styles.groupbox,
      {
        backgroundColor: colors.cardBg,
        borderColor: isDarkMode ? colors.primary : colors.border,
        borderWidth: 1
      }
    ]}>
      {children}
    </View>
  </View>
);

/**
 * Stats Item with ICON
 */
const StatItem = ({ label, value, icon, colors }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={20} color={colors.primary} style={{ marginBottom: 4 }} />
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{label}</Text>
  </View>
);


const ProfileScreen = () => {
  const { navigate } = useNavigation();
  const { t, language } = useLanguage();
  const { colors, isDarkMode, toggleTheme } = useTheme();

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.headerActions, { zIndex: 10 }]}>
        <AnimatedButton
          style={[styles.refreshButton, { backgroundColor: colors.cardBg }]}
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
          }}
        >
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </AnimatedButton>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { shadowColor: colors.text }]}>
            <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: colors.cardBg }]} />
            <View style={[styles.onlineBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Ionicons name="camera" size={12} color={colors.white} />
            </View>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
          <Text style={[styles.role, { color: colors.secondaryText }]}>{profile.role}</Text>

          {/* Edit Button - Animated & Medium Size */}
          <AnimatedButton
            style={[styles.editButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigate(SCREENS.EDIT_PROFILE)}
          >
            <Text style={[styles.editButtonText, { color: colors.text }]}>{t("profile_edit")}</Text>
          </AnimatedButton>
        </View>

        <View style={[
          styles.statsRow,
          {
            backgroundColor: colors.cardBg,
            borderColor: isDarkMode ? colors.primary : colors.border,
            shadowColor: colors.text
          }
        ]}>
          <StatItem value={profile.stats.saved} label={t("profile_bookmarks")} icon="bookmark" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem value="12" label="Read" icon="book" colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem value="5" label="Comments" icon="chatbubble" colors={colors} />
        </View>

        <View style={styles.settingsArea}>
          <SettingGroup title={t("profile_settings")} colors={colors} isDarkMode={isDarkMode}>
            <SettingItem icon="notifications-outline" label={t("profile_notifications")} hasSwitch value={notificationsEnabled} onValueChange={handleNotificationToggle} colors={colors} />
            <SettingItem icon="newspaper-outline" label={t("profile_auto_scroll")} hasSwitch value={autoScrollEnabled} onValueChange={handleAutoScrollToggle} isLast colors={colors} onPress={() => navigate(SCREENS.AUTO_SCROLLING)} />
          </SettingGroup>

          <SettingGroup title="Preferences" colors={colors} isDarkMode={isDarkMode}>
            <SettingItem icon="language-outline" label={t("profile_language")} onPress={() => navigate(SCREENS.LANGUAGE)} colors={colors} />
            <SettingItem icon={isDarkMode ? "sunny-outline" : "moon-outline"} label={isDarkMode ? "Light Mode" : "Dark Mode"} hasSwitch value={isDarkMode} onValueChange={handleThemeToggle} isLast colors={colors} />
          </SettingGroup>

          <SettingGroup title="Security" colors={colors} isDarkMode={isDarkMode}>
            <SettingItem icon="shield-checkmark-outline" label={t("profile_privacy")} onPress={() => navigate(SCREENS.PRIVACY)} colors={colors} />
            <SettingItem icon="lock-closed-outline" label={t("profile_change_password")} isLast colors={colors} onPress={() => navigate(SCREENS.CHANGE_PASSWORD)} />
          </SettingGroup>

          {/* Logout Button - Animated & Component Size */}
          <AnimatedButton
            style={[styles.logoutButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: colors.error }]}>{t("profile_sign_out")}</Text>
          </AnimatedButton>

          <Text style={[styles.versionText, { color: colors.secondaryText }]}>Version 1.0.0</Text>
          <Text style={[styles.versionText, { color: colors.secondaryText }]}>Powered By Pleach India Foundation</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} onHide={() => setToastVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 20,
    right: 20,
    zIndex: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
  name: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  role: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  settingsArea: {
    paddingHorizontal: 16,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  groupbox: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    height: 60,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 18,
    height: '100%',
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 10,
    borderRadius: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 13,
  },
  refreshButton: {
    padding: 0,
    borderRadius: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
