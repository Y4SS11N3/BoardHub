const Joi = require('joi');

const boardSchema = Joi.object({
  boardId: Joi.string().optional(),
  title: Joi.string().optional(),
  subject: Joi.string().allow('').optional(),
  content: Joi.string().allow('').optional(),
  userId: Joi.number().optional(),
  isPublic: Joi.boolean().optional()
});

/**
 * Validate board data
 */
const validateBoard = (req, res, next) => {
  const { error } = boardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateBoard,
};