
// Primitive Colors (Raw Values)
const pallet = {
    white: '#FFFFFF',
    black: '#000000',

    // Grays / Neutrals (Tailwind/System inspired)
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    gray950: '#030712',

    // Accents (Orange Primary as requested)
    orange50: '#FFF7ED',
    orange100: '#FFEDD5',
    orange200: '#FED7AA',
    orange300: '#FDBA74',
    orange400: '#FB923C',
    orange500: '#F97316', // Primary Brand
    orange600: '#EA580C',
    orange700: '#C2410C',
    orange800: '#9A3412',
    orange900: '#7C2D12',

    // Status
    red500: '#EF4444',
    green500: '#22C55E',
    blue500: '#3B82F6',
    yellow500: '#EAB308',

    // Transparent
    transparent: 'transparent',
    overlayDark: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(255, 255, 255, 0.5)',
};

export const colors = {
    ...pallet,

    // Semantic Tokens will be defined in themes (light.js / dark.js)
    // But we export primitives here for reference
};
