import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: 'your-email@example.com', // Replace with your email
      subject: 'Test Email from Camber Deck',
      html: '<p>This is a test email to verify Resend configuration.</p>',
      reply_to: process.env.RESEND_REPLY_TO
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(error);
    
    if (error.message?.includes('domain')) {
      console.log('\n📌 Domain not verified. Please verify your domain in Resend dashboard.');
      console.log('   Or use "onboarding@resend.dev" for testing.');
    }
  }
}

testEmail();