import { normalizeSpacing } from '../../utils/normalize';

// 4pt Grid System
// We normalize these values based on device width for true scalability

export const spacing = {
    xxs: normalizeSpacing(2),   // 2
    xs: normalizeSpacing(4),    // 4
    s: normalizeSpacing(8),     // 8
    m: normalizeSpacing(12),    // 12
    l: normalizeSpacing(16),    // 16
    xl: normalizeSpacing(20),   // 20
    xxl: normalizeSpacing(24),  // 24
    xxxl: normalizeSpacing(32), // 32
    huge: normalizeSpacing(48), // 48
    massive: normalizeSpacing(64)// 64
};
