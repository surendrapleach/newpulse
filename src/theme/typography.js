import { Platform } from 'react-native';
import { typographyScale } from './tokens/typography-scale';
import { fontNames } from './fonts';

// Construct typography styles
// We do NOT use fontWeight property to avoid Android issues with custom fonts.
// We use fontFamily instead.

const createTextStyle = (sizeKey, fontKey, lineHeightKey, letterSpacingKey) => ({
    fontFamily: fontNames[fontKey],
    fontSize: typographyScale.size[sizeKey],
    lineHeight: typographyScale.lineHeight[lineHeightKey || sizeKey],
    letterSpacing: typographyScale.letterSpacing[letterSpacingKey || 'normal'],
});

export const typography = {
    display: createTextStyle('display', 'extraBold', 'display', 'tight'),
    h1: createTextStyle('h1', 'bold', 'h1', 'tight'),
    h2: createTextStyle('h2', 'bold', 'h2', 'tight'),
    h3: createTextStyle('h3', 'semiBold', 'h3', 'normal'),

    bodyLarge: createTextStyle('bodyLarge', 'regular', 'bodyLarge', 'normal'),
    body: createTextStyle('body', 'regular', 'body', 'normal'),
    bodyMedium: createTextStyle('body', 'medium', 'body', 'normal'),
    bodySmall: createTextStyle('bodySmall', 'regular', 'bodySmall', 'normal'),

    caption: createTextStyle('caption', 'medium', 'caption', 'normal'),
    meta: createTextStyle('meta', 'medium', 'meta', 'wide'),
    overline: {
        ...createTextStyle('overline', 'bold', 'overline', 'wider'),
        textTransform: 'uppercase',
    },
};
