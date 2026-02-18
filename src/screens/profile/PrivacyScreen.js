import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { useLanguage } from "../../services/LanguageContext";
import { useTheme } from "../../services/ThemeContext";

const { width } = Dimensions.get('window');

const PrivacyScreen = () => {
  const { goBack, navigate } = useNavigation();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.bodyText, { color: colors.secondaryText }]}>{content}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => goBack ? goBack() : navigate(SCREENS.PROFILE)}
          style={[styles.backBtn, { backgroundColor: colors.cardBg }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>{t("privacy_title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lastUpdated, { color: colors.secondaryText }]}>Last Updated: February 10, 2026</Text>

        {renderSection(
          "1. Introduction",
          "Welcome to Heritage Pulse. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our application."
        )}

        {renderSection(
          "2. Data Collection",
          "We collect information that you provide directly to us, such as your name, email address, and profile preferences. We also automatically collect certain device information and usage data to improve your experience."
        )}

        {renderSection(
          "3. Use of Information",
          "Your data is used to personalize content, provide customer support, and improve our services. We do not sell your personal data to third parties."
        )}

        {renderSection(
          "4. Data Security",
          "We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure."
        )}

        {renderSection(
          "5. Your Rights",
          "You have the right to access, correct, or delete your personal data. You can manage your preferences in the settings menu or contact us for assistance."
        )}

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.primary }]}>For questions, contact us at privacy@heritagepulse.com</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: width * 0.05,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default PrivacyScreen;
