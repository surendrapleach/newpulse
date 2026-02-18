import React from 'react';
import { View, StyleSheet } from 'react-native';
import TrendingSection from './TrendingSection';
import LatestNewsSection from './LatestNewsSection';

const National = ({ refreshKey, onShowToast }) => {
    return (
        <View style={styles.container}>
            <TrendingSection key={`trending-${refreshKey}`} onShowToast={onShowToast} />
            <LatestNewsSection key={`latest-${refreshKey}`} onShowToast={onShowToast} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 5,
    },
});

export default National;
