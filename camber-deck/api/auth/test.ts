import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Simple test endpoint to verify Vercel Functions are working
  const envVars = {
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM || 'not set',
    resendReplyTo: process.env.RESEND_REPLY_TO || 'not set',
    hasJwtSecret: !!process.env.JWT_SECRET,
    requireAllowlist: process.env.REQUIRE_ALLOWLIST || 'not set'
  };

  res.status(200).json({
    message: 'Auth test endpoint',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars
  });
}