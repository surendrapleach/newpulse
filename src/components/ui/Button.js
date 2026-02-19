import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';
import Text from './Text'; // Using our Design System Text
import { radius } from '../../theme/tokens/radius';
import { spacing } from '../../theme/tokens/spacing';

const Button = ({
    label,
    onPress,
    variant = 'primary', // primary, secondary, outline, ghost
    size = 'medium',     // small, medium, large
    icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    textColor,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    // Variant Styles
    const getVariantStyle = () => {
        if (disabled) return { backgroundColor: colors.surfaceHighlight, borderColor: 'transparent' };

        switch (variant) {
            case 'secondary':
                return { backgroundColor: colors.surfaceHighlight };
            case 'outline':
                return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            case 'primary':
            default:
                return { backgroundColor: colors.primary };
        }
    };

    const getTextColor = () => {
        if (disabled) return 'textTertiary';
        switch (variant) {
            case 'outline':
            case 'ghost':
                return 'primary';
            case 'secondary':
                return 'textPrimary';
            case 'primary':
            default:
                return 'textInverse';
        }
    };

    // Size Styles
    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: spacing.xs,
                    paddingHorizontal: spacing.m,
                    minHeight: 32
                };
            case 'large':
                return {
                    paddingVertical: spacing.m,
                    paddingHorizontal: spacing.xl,
                    minHeight: 56
                };
            case 'medium':
            default:
                return {
                    paddingVertical: spacing.s,
                    paddingHorizontal: spacing.l,
                    minHeight: 44
                };
        }
    };

    const buttonStyle = [
        styles.base,
        { borderRadius: radius.m }, // Consistent radius
        getSizeStyle(),
        getVariantStyle(),
        fullWidth && styles.fullWidth,
        style
    ];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={buttonStyle}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textInverse} size="small" />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.iconWrapper}>{icon}</View>}
                    <Text
                        variant={size === 'large' ? 'h3' : 'body'}
                        color={textColor || getTextColor()}
                        style={{ fontWeight: '600' }}
                    >
                        {label}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        marginRight: spacing.s,
    }
});

export default React.memo(Button);
