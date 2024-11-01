const rateLimit = require("express-rate-limit");

// Rate limiter for regular users
const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // Limit each user to 20 requests per windowMs
  message: {
    message:
      "Too many requests from this IP, please try again after 5 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Do not count failed requests in the rate limit
  handler: (req, res) => {
    res
      .status(429)
      .send({
        message: "Too many requests, please try again after 5 minutes.",
      });
  },
  keyGenerator: (req) => req.user?._id || req.ip, // Apply limit per user or IP
});

// Rate limiter for admins
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each admin to 100 requests per windowMs
  message: {
    message:
      "Too many requests from this IP, please try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  handler: (req, res) => {
    res
      .status(429)
      .send({
        message: "Too many requests, please try again after 5 minutes.",
      });
  },
  keyGenerator: (req) => req.admin?._id || req.ip, // Apply limit per admin or IP
});

module.exports = { userRateLimiter, adminRateLimiter };
