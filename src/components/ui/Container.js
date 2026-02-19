import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/tokens/spacing';

const MAX_WIDTH = 1200; // Constrain width on large screens

const Container = ({
    children,
    style,
    padding = 'm',
    centerContent = false,
    ...props
}) => {
    const { colors } = useTheme();

    const containerStyle = [
        styles.base,
        {
            backgroundColor: colors.background,
            padding: spacing[padding] || spacing.m
        },
        centerContent && styles.center,
        style
    ];

    return (
        <View style={styles.outerWrapper}>
            <View style={containerStyle} {...props}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        flex: 1,
        alignItems: 'center', // for centering the inner container on large screens
        width: '100%',
    },
    base: {
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? MAX_WIDTH : '100%',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default React.memo(Container);
