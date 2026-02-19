import React, { useMemo } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { typography } from '../../theme/typography';

const Text = ({
    children,
    variant = 'body',
    color,
    align = 'left',
    style,
    numberOfLines,
    ...props
}) => {
    const { colors } = useTheme();

    const textStyle = useMemo(() => {
        const baseStyle = typography[variant] || typography.body;
        const colorStyle = { color: color ? (colors[color] || color) : colors.textPrimary };
        const alignStyle = { textAlign: align };

        return [baseStyle, colorStyle, alignStyle, style];
    }, [variant, color, align, style, colors]);

    return (
        <RNText style={textStyle} numberOfLines={numberOfLines} {...props}>
            {children}
        </RNText>
    );
};

export default React.memo(Text);
