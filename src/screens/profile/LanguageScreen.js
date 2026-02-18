import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, SCREENS } from "../../services/NavigationContext";
import { useTheme } from "../../services/ThemeContext";
import { useLanguage } from "../../services/LanguageContext";

const { width } = Dimensions.get('window');

const LanguageScreen = () => {
  const { goBack, navigate } = useNavigation();
  const { language, setLanguage, t, languages } = useLanguage();
  const { colors, isDarkMode } = useTheme();

  const labelKeyByCode = {
    en: "language_english",
    te: "language_telugu",
    ta: "language_tamil",
    kn: "language_kannada",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => goBack ? goBack() : navigate(SCREENS.PROFILE)}
          style={[styles.backBtn, { backgroundColor: colors.cardBg }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t("language_title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Select your preferred language</Text>

        <View style={styles.list}>
          {languages.map((lang) => {
            const selected = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                style={[
                  styles.langItem,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  selected && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.langItemLeft}>
                  <View style={[
                    styles.radioCircle,
                    { borderColor: colors.secondaryText },
                    selected && { borderColor: colors.white }
                  ]}>
                    {selected && <View style={[styles.radioInner, { backgroundColor: colors.white }]} />}
                  </View>
                  <Text style={[
                    styles.langText,
                    { color: colors.text },
                    selected && { color: colors.white }
                  ]}>
                    {t(labelKeyByCode[lang.code]) || lang.name}
                  </Text>
                </View>

                {selected && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                )}
              </TouchableOpacity>
            );
          })}
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
  },
  subtitle: {
    fontSize: width * 0.038,
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  langItemActive: {
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  langItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  langText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LanguageScreen;
