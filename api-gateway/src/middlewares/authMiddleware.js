import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * 
 * WHY: We need to protect sensitive "Admin" routes (like deleting a student).
 * This middleware checks for a Bearer token in the Authorization header.
 * If the token is valid, it decodes it and attaches the payload to `req.user`.
 * 
 * Note: In a full app, we would also verify if the user still exists in the DB 
 * and if they have the 'admin' role. For this step, validating the JWT signature is the core requirement.
 */
const protectAdminRoute = (req, res, next) => {
  let token;

  // 1. Check if the header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Split "Bearer <token>" and take the token part
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If no token is found, reject the request immediately.
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  try {
    // 3. Verify the token using our secret key. 
    // The secret should be in the environment variables.
    const secret = process.env.JWT_SECRET || 'fallback_dev_secret_key_change_in_prod';
    
    // jwt.verify throws an error if the token is expired or altered.
    const decoded = jwt.verify(token, secret);

    // 4. Attach the decoded payload (usually user ID and role) to the request object.
    req.user = decoded;

    // Optional: Check if role is admin
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
    // }

    next(); // Validated! Proceed to route.
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Invalid token.',
    });
  }
};

export default protectAdminRoute;
