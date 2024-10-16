const { body, validationResult } = require('express-validator');

const validateEditedComic = [
  body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('author').optional().isLength({ min: 3 }).withMessage('Author name must be at least 3 characters long'),
  body('condition').optional().isIn(['new', 'used']).withMessage('Condition must be either "new" or "used"'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be a valid integer'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('pages').optional().isInt({ min: 0 }).withMessage('Pages must be a positive number'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEditedComic;
