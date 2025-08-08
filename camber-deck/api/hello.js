// Simple CommonJS endpoint for Vercel Functions
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'Hello from Vercel!',
    method: req.method,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    hasEnvVars: {
      resendKey: !!process.env.RESEND_API_KEY,
      upstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      jwtSecret: !!process.env.JWT_SECRET
    }
  });
};