const { validationResult } = require('express-validator/check');

export function checkValidationResult(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  res.status(400).json({ errors: result.array() });
}
