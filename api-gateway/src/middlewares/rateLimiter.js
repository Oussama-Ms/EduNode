import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter Configuration
 * 
 * WHY: As requested, we need to prevent DoS (Denial of Service) attacks or spam
 * on resource-intensive routes like POST (creation). We use `express-rate-limit`
 * to restrict the number of requests a single IP address can make within a timeframe.
 */

// We create a specific limiter for POST creation routes: max 10 requests per minute
export const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many creation requests from this IP, please try again after a minute.'
  }
});

// We create a specific limiter for Admin Authentication: max 3 requests per 3 minutes
export const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes window
  max: 3, // Limit each IP to 3 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 3 minutes.'
  }
});
