import { colors } from './tokens/colors';

export const lightTheme = {
    mode: 'light',
    colors: {
        background: colors.gray50,
        surface: colors.white, // Surface is now white to contrast with gray50 cards or backgrounds
        surfaceHighlight: colors.gray100,
        modalOverlay: 'rgba(0,0,0,0.5)',

        textPrimary: colors.gray900,
        textSecondary: colors.gray600,
        textTertiary: colors.gray400,
        textInverse: colors.white,

        primary: colors.pleach500,
        primaryLight: colors.pleach100,
        primaryDark: colors.pleach700,

        success: colors.green500,
        error: colors.red500,
        warning: colors.yellow500,
        info: colors.blue500,

        border: colors.gray200,
        borderFocus: colors.pleach500,

        // Aliases for backward compatibility
        text: colors.gray900,
        secondaryText: colors.gray600,
        navBg: colors.white, // Navigation background
        icon: colors.gray900,
        white: colors.white,
        black: colors.black,
        secondary: colors.pleach300, // Approximate secondary

        cardBg: colors.white, // Ensure cardBg is effectively white for elevated cards on gray background
        inputBg: colors.gray50,
    }
};
