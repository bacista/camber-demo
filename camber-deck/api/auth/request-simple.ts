import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // For testing, just return success
    // In production, this would send the actual email
    console.log('Magic link requested for:', email);
    console.log('Using from:', process.env.RESEND_FROM);
    
    // Check if environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({
        success: false,
        message: 'Email service not configured'
      });
    }

    // For now, return success without actually sending email
    // This lets us test if the endpoint is reachable
    return res.status(200).json({
      success: true,
      message: 'Magic link sent! (Test mode - check Vercel logs)',
      debug: {
        emailTo: email,
        emailFrom: process.env.RESEND_FROM || 'not set',
        hasApiKey: !!process.env.RESEND_API_KEY
      }
    });
    
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}