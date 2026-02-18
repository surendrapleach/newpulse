/**
 * ReadingTimeEstimator.js
 * Utility to calculate estimated reading time based on article content
 */

const AVERAGE_READING_SPEED_WPM = 200; // Average adult reading speed

/**
 * Extracts plain text from article content structure
 * @param {Array} content - Article content array
 * @returns {string} Plain text content
 */
export const extractTextFromContent = (content) => {
    if (!Array.isArray(content)) return '';

    return content
        .map((block) => {
            if (block?.content && Array.isArray(block.content)) {
                return block.content.map((seg) => seg?.text || '').join(' ');
            }
            return '';
        })
        .join(' ');
};

/**
 * Counts words in a given text string
 * @param {string} text - Text to count words in
 * @returns {number} Word count
 */
export const countWords = (text) => {
    if (!text || typeof text !== 'string') return 0;

    // Remove extra whitespace and split by spaces
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
};

/**
 * Calculates estimated reading time
 * @param {Array|string} content - Article content (array or string)
 * @param {number} wpm - Words per minute (default: 200)
 * @returns {Object} { minutes, seconds, formattedTime }
 */
export const calculateReadingTime = (content, wpm = AVERAGE_READING_SPEED_WPM) => {
    let text = '';

    if (Array.isArray(content)) {
        text = extractTextFromContent(content);
    } else if (typeof content === 'string') {
        text = content;
    }

    const wordCount = countWords(text);
    const minutes = Math.ceil(wordCount / wpm);
    const seconds = Math.round((wordCount / wpm) * 60);

    // Format the reading time
    let formattedTime = '';
    if (minutes < 1) {
        formattedTime = '< 1 min read';
    } else if (minutes === 1) {
        formattedTime = '1 min read';
    } else {
        formattedTime = `${minutes} min read`;
    }

    return {
        minutes,
        seconds,
        wordCount,
        formattedTime,
    };
};

/**
 * Gets a short reading time string
 * @param {Array|string} content - Article content
 * @returns {string} Formatted reading time string
 */
export const getReadingTime = (content) => {
    const { formattedTime } = calculateReadingTime(content);
    return formattedTime;
};
