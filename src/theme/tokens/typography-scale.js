import { normalize } from '../../utils/normalize';

// Modular Scale: 1.25 (Major Third) approx, tuned for mobile readability
// Line heights are strict (1.4 - 1.5 ratio)

export const typographyScale = {
    size: {
        display: normalize(32),
        h1: normalize(28),
        h2: normalize(24),
        h3: normalize(20),
        bodyLarge: normalize(18),
        body: normalize(16),
        bodySmall: normalize(14),
        caption: normalize(12),
        meta: normalize(11),
        overline: normalize(10),
    },
    lineHeight: {
        display: normalize(40),  // ~1.25
        h1: normalize(34),       // ~1.2
        h2: normalize(30),       // ~1.25
        h3: normalize(28),       // ~1.4
        bodyLarge: normalize(26),// ~1.44
        body: normalize(24),     // ~1.5
        bodySmall: normalize(20),// ~1.42
        caption: normalize(18),  // ~1.5
        meta: normalize(16),     // ~1.45
        overline: normalize(14), // ~1.4
    },
    letterSpacing: {
        tighter: -0.5,
        tight: -0.25,
        normal: 0,
        wide: 0.5,
        wider: 1.0,
    }
};
