import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;

export const normalize = (size) => {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        // For Android, we also use roundToNearestPixel but might subtract slightly
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
    }
};

export const normalizeSpacing = (size) => {
    // Spacing doesn't need as aggressive normalization as font size
    // But for cross-platform consistency, we can scale it gently or keep it fixed
    // The prompt asks for scalable spacing system, so scaling is safer for responsiveness
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
