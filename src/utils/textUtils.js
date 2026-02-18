/**
 * Truncates text to a specified limit and adds an ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} limit - The maximum number of characters.
 * @returns {string} The truncated text.
 */
export const truncateText = (text, limit) => {
    if (!text) return '';
    // If no limit is provided, or limit is 0, return original text (or handle as needed)
    if (!limit) return text;

    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
};
