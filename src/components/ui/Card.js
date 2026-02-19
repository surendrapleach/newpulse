import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { radius } from '../../theme/tokens/radius';
import { spacing } from '../../theme/tokens/spacing';
import { shadows } from '../../theme/tokens/shadows';

const Card = ({
    children,
    variant = 'elevated', // elevated, outlined, flat
    padding = 'm',
    onPress,
    style,
    ...props
}) => {
    const { colors, mode } = useTheme();

    const getVariantStyle = () => {
        switch (variant) {
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'flat':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 0,
                };
            case 'elevated':
            default:
                return {
                    backgroundColor: colors.cardBg,
                    ...(mode === 'dark' ? shadows.darkSm : shadows.sm),
                };
        }
    };

    const cardStyle = [
        styles.base,
        {
            borderRadius: radius.m,
            padding: spacing[padding] || spacing.m
        },
        getVariantStyle(),
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} style={cardStyle} activeOpacity={0.7} {...props}>
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        overflow: 'hidden',
    }
});

export default React.memo(Card);
