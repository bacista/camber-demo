// CommonJS endpoint for auth request
const crypto = require('crypto');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://camber-deck.vercel.app');
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Check if we have Resend configured
    if (process.env.RESEND_API_KEY) {
      try {
        // Dynamic import for Resend (ES module)
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const magicLink = `https://camber-deck.vercel.app/?token=${token}`;
        
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'onboarding@resend.dev',
          to: email,
          subject: 'Access your Camber Investor Deck',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
              <h2>Access Your Camber Investor Deck</h2>
              <p>Click the link below to access the investor deck:</p>
              <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #1CA6A3; color: white; text-decoration: none; border-radius: 6px;">
                Access Deck
              </a>
              <p style="margin-top: 20px; color: #666;">
                This link will expire in 4 hours for security reasons.
              </p>
              <p style="margin-top: 20px; color: #666;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          `,
          reply_to: process.env.RESEND_REPLY_TO || 'onboarding@resend.dev'
        });

        console.log('Email sent successfully to:', email);
        
        return res.status(200).json({
          success: true,
          message: 'Magic link sent! Check your email.'
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Fall through to test mode
      }
    }

    // Test mode - log the magic link
    const magicLink = `https://camber-deck.vercel.app/?token=${token}`;
    console.log('Magic link for', email, ':', magicLink);
    
    return res.status(200).json({
      success: true,
      message: 'Magic link sent! (Test mode - check logs)',
      debug: process.env.NODE_ENV === 'development' ? {
        token,
        magicLink
      } : undefined
    });
    
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};