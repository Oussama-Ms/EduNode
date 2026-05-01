/**
 * Request Validation Middleware (Factory Function)
 * 
 * WHY: We use Zod for validation. Instead of writing manual if/else checks for every 
 * incoming field in our controllers, we define a Zod schema and pass it to this middleware.
 * This ensures the controller only ever receives clean, validated data.
 * 
 * It's a "Factory Function" because it takes a schema and returns the actual Express middleware.
 * 
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Zod's parse method throws an error if validation fails.
      // We overwrite req.body with the parsed data (which strips out unknown fields if configured).
      req.body = schema.parse(req.body);
      next(); // Data is valid, proceed to the controller
    } catch (error) {
      // If validation fails, Zod throws a ZodError.
      // We format it nicely for the client and return a 400 Bad Request.
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
};

export default validateRequest;
