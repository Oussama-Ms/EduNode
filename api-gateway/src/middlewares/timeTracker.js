import logger from '../config/logger.js';

/**
 * Time Tracker Middleware
 * 
 * WHY: As requested, this custom middleware intercepts every incoming request.
 * It tracks when the request started and listens for the response 'finish' event
 * to calculate the exact duration of the execution pipeline. This is crucial for
 * monitoring API performance and identifying bottlenecks.
 */
const timeTracker = (req, res, next) => {
  // 1. Record the start time using high-resolution time for accuracy
  const start = process.hrtime();

  // 2. We hook into the response object's 'finish' event.
  // This event is emitted by Node.js when the response has been fully sent to the client.
  res.on('finish', () => {
    // 3. Calculate the difference
    const diff = process.hrtime(start);
    
    // hrtime returns an array: [seconds, nanoseconds]
    // We convert it to milliseconds for readability
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    // 4. Log the result using Winston
    logger.info(`[TIME TRACKER] ${req.method} ${req.originalUrl} completed in ${timeInMs} ms`);
  });

  // 5. Pass control to the next middleware or route handler.
  // If we forget this, the request hangs forever!
  next();
};

export default timeTracker;
