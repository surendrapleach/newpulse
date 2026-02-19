import { colors } from './tokens/colors';

export const darkTheme = {
    mode: 'dark',
    colors: {
        background: colors.gray950,
        surface: colors.gray900,
        surfaceHighlight: colors.gray800,
        modalOverlay: 'rgba(0,0,0,0.7)',

        textPrimary: colors.gray50,
        textSecondary: colors.gray400,
        textTertiary: colors.gray600,
        textInverse: colors.gray900,

        primary: colors.orange500,
        primaryLight: 'rgba(249, 115, 22, 0.2)',
        primaryDark: colors.orange600,

        success: colors.green500,
        error: colors.red500,
        warning: colors.yellow500,
        info: colors.blue500,

        // Aliases for backward compatibility
        text: colors.gray50,
        secondaryText: colors.gray400,
        navBg: colors.gray950,
        icon: colors.gray50,
        white: colors.white,
        black: colors.black,
        secondary: colors.orange300,

        border: colors.gray800,
        borderFocus: colors.orange500,

        cardBg: colors.gray900,
        inputBg: colors.gray800,
    }
};
