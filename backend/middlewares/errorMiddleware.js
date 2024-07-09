/**
 * Global error handling middleware
 */
module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.message.includes('Unexpected token')) {
    return res.status(400).json({ error: 'Invalid JSON data', details: err.message });
  }

  if (err.message === 'Invalid JSON format') {
    return res.status(400).json({ error: 'Invalid JSON format', details: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: err.stack || 'No additional details available',
  });
};