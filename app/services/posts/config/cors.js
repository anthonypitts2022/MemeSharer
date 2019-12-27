const allowedOrigins = ["http://localhost", "http://localhost:3301/posts", "http://localhost:3000", "http://localhost:3000/?"];

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
