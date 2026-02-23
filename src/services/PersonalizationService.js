import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    INTERESTS: '@heritage_interests',
    ACTIVITY: '@heritage_activity_v2', // v2 to avoid conflicts with previous simple arrays
    SYNC_STATUS: '@heritage_sync_status',
    SESSION_SYNCED: '@heritage_session_synced'
};

const SCORE_WEIGHTS = {
    VIEW: 1,
    BOOKMARK: 3,
    LIKE: 3,
    SHARE: 5
};

class PersonalizationService {
    /**
     * Get saved interests
     */
    static async getInterests() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.INTERESTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting interests:', error);
            return [];
        }
    }

    /**
     * Save interests
     */
    static async setInterests(interests) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(interests));
            return true;
        } catch (error) {
            console.error('Error setting interests:', error);
            return false;
        }
    }

    /**
     * Track user activity on a category
     */
    static async trackActivity(categoryKey, action = 'VIEW') {
        try {
            const currentData = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY);
            const activity = currentData ? JSON.parse(currentData) : {};

            const weight = SCORE_WEIGHTS[action] || 1;
            activity[categoryKey] = (activity[categoryKey] || 0) + weight;

            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
        } catch (error) {
            console.error('Error tracking activity:', error);
        }
    }

    /**
     * Get all local activity data
     */
    static async getActivity() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * Merges local guest data with account data from backend
     * @param {Object} accountData - { interests: [], activity: {} }
     */
    static async mergeAndSync(accountData = {}) {
        try {
            const isSessionSynced = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_SYNCED);
            if (isSessionSynced === 'true') {
                console.log('Already synced in this session.');
                return { success: true, message: 'Already synced' };
            }

            // 1. Merge Interests
            const localInterests = await this.getInterests();
            const cloudInterests = accountData.interests || [];
            const mergedInterests = Array.from(new Set([...localInterests, ...cloudInterests]));

            // 2. Merge Activity / Scores
            const localActivity = await this.getActivity();
            const cloudActivity = accountData.activity || {};
            const mergedActivity = { ...cloudActivity };

            Object.keys(localActivity).forEach(cat => {
                mergedActivity[cat] = (mergedActivity[cat] || 0) + (localActivity[cat] || 0);
            });

            // 3. Save Merged Data Locally
            await this.setInterests(mergedInterests);
            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(mergedActivity));

            // 4. Mark as Synced
            await AsyncStorage.setItem(STORAGE_KEYS.SYNC_STATUS, 'true');
            await AsyncStorage.setItem(STORAGE_KEYS.SESSION_SYNCED, 'true');

            console.log('Personalization data merged and synced successfully.');
            return {
                success: true,
                merged: {
                    interests: mergedInterests,
                    activity: mergedActivity
                }
            };
        } catch (error) {
            console.error('Merge/Sync error:', error);
            return { success: false, error };
        }
    }

    /**
     * Reset session sync flag (on logout/restart)
     */
    static async resetSessionSync() {
        await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_SYNCED);
    }

    /**
     * Check if interests exist (to determine first-time user flow)
     */
    static async hasInterests() {
        const interests = await this.getInterests();
        return interests.length > 0;
    }
}

export default PersonalizationService;
