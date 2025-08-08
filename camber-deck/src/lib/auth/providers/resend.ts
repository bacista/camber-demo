import type { EmailSender } from './magic-link';

export interface ResendConfig {
  apiKey: string;
  from: string;
  replyTo?: string;
}

export class ResendEmailSender implements EmailSender {
  private apiKey: string;
  private from: string;
  private replyTo?: string;

  constructor(config: ResendConfig) {
    this.apiKey = config.apiKey;
    this.from = config.from;
    this.replyTo = config.replyTo;
  }

  async send(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: [to],
          subject,
          html,
          text: text || this.htmlToText(html),
          reply_to: this.replyTo,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Resend API error:', error);
        return false;
      }

      const data = await response.json();
      console.log('Email sent successfully:', data.id);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private htmlToText(html: string): string {
    // Basic HTML to text conversion
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

export function createResendEmailSender(
  apiKey?: string,
  from?: string,
  replyTo?: string
): ResendEmailSender {
  const key = apiKey || process.env.RESEND_API_KEY;
  const fromEmail = from || process.env.RESEND_FROM || 'noreply@example.com';
  const replyToEmail = replyTo || process.env.RESEND_REPLY_TO;

  if (!key) {
    throw new Error(
      'Resend API key not found. Please set RESEND_API_KEY environment variable.'
    );
  }

  return new ResendEmailSender({
    apiKey: key,
    from: fromEmail,
    replyTo: replyToEmail,
  });
}