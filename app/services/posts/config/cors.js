const allowedOrigins = ["http://localhost"];

const corsConfig = {
  origin: (origin, callback) => {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
};
module.exports = { corsConfig };
