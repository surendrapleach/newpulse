import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useNavigation, SCREENS } from '../../services/NavigationContext';
import { useTheme } from '../../services/ThemeContext';
import Header from '../../components/Header';
import Toast from '../../components/Toast';
import Loading from '../../components/loading/Loading';
import { MockDataService } from '../../data/mockData';
import { useLanguage } from '../../services/LanguageContext';
import National from './National';
import International from './International';

const HomeScreen = () => {
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState('National');

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            MockDataService.refreshData();
            setRefreshKey(prev => prev + 1);
            setRefreshing(false);
        }, 2000);
    }, []);

    const showToast = (message) => {
        setToastMessage(message);
        setToastVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <Header />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        progressBackgroundColor={colors.cardBg}
                    />
                }
            >
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'National' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('National')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'National' ? colors.primary : colors.text }]}>National</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'International' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('International')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'International' ? colors.primary : colors.text }]}>International</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'National' ? (
                    <National refreshKey={refreshKey} onShowToast={showToast} />
                ) : (
                    <International />
                )}
            </ScrollView>

            {refreshing && (
                <View style={StyleSheet.absoluteFill}>
                    <Loading />
                </View>
            )}

            <Toast
                visible={toastVisible}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Light grey for separation, could be themed but hardcoded for now to be subtle
    },
    tab: {
        paddingVertical: 10,
        marginRight: 20,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeScreen;
