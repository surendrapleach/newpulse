import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../services/ThemeContext';

const International = () => {
    const { colors, theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.text, { color: colors.text }]}>International News Coming Soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderRadius: 12,
        marginHorizontal: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default International;
