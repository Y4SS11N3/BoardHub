const Vibrant = require('node-vibrant');
const path = require('path');

/**
 * Extract the dominant color from an image
 * @param {string} imagePath 
 * @returns {Promise<string|null>}
 */
const extractDominantColor = async (imagePath) => {
  try {
    const frontendPath = path.resolve(__dirname, '..', '..', 'frontend');
    const fullPath = path.join(frontendPath, 'public', 'board-backgrounds', imagePath);

    const palette = await Vibrant.from(fullPath).getPalette();
    const dominantColor = palette.Vibrant.rgb;

    return `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
  } catch (error) {
    return null;
  }
};

module.exports = { extractDominantColor };