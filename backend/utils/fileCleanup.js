const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

/**
 * Clean up old files in the uploads directory
 */
const cleanupUploads = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const files = await readdir(uploadsDir);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      
      try {
        const stats = await stat(filePath);

        if (stats.mtime < oneWeekAgo) {
          await unlink(filePath);
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('Error reading uploads directory:', err);
  }
};

/**
 * Start the cleanup schedule
 */
const startCleanupSchedule = () => {
  setInterval(cleanupUploads, 24 * 60 * 60 * 1000);
  cleanupUploads();
};

module.exports = { cleanupUploads, startCleanupSchedule };