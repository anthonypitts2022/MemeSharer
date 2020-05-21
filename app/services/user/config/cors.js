const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:3000/login",
  "https://localhost",
  "http://memesharer.com",
  "https://memesharer.com",
  "https://memesharer.com:3000",
  "memesharer.com"
];

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
