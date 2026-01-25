/**
 * Formats a raw text block into an array of items.
 * Handles both newline-separated and hyphen/asterisk-prefixed lists.
 */
export const formatToList = (text) => {
    if (!text) return [];
    return text
        .split('\n')
        .filter(item => item.trim() !== '')
        .map(item => item.replace(/^- /, '').replace(/^\* /, '').trim());
};

/**
 * Generates a consistent, accessible background color from a string.
 * Uses a simple hash function.
 */
export const getBadgeColor = (text) => {
    if (!text) return 'hsl(220, 15%, 85%)';
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use HSL for better control over lightness and saturation
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 60%, 45%)`;
};
