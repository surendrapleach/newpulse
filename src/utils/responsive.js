import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Width Percentage
 * Converts a percentage to a responsive pixel value based on screen width.
 * @param {number} percentage - The percentage value (e.g., 5 for 5%).
 * @returns {number} - The calculated pixel value.
 */
export const wp = (percentage) => {
    return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percentage) / 100);
};

/**
 * Height Percentage
 * Converts a percentage to a responsive pixel value based on screen height.
 * @param {number} percentage - The percentage value (e.g., 5 for 5%).
 * @returns {number} - The calculated pixel value.
 */
export const hp = (percentage) => {
    return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percentage) / 100);
};

/**
 * Responsive Font
 * Scales font size based on screen width.
 * @param {number} size - The base font size.
 * @returns {number} - The calculated responsive font size.
 */
export const rf = (size) => {
    const scale = SCREEN_WIDTH / 400; // Base width for scaling
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Export screen dimensions for direct use if needed
export const width = SCREEN_WIDTH;
export const height = SCREEN_HEIGHT;
