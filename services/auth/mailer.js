// services/auth/mailer.js
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
  console.warn('⚠️  SENDGRID_API_KEY is not set. Emails will fail until you configure it.');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@example.com';
const REPLY_TO = process.env.REPLY_TO || FROM_EMAIL;

const sendOtpEmail = async (toEmail, otp) => {
  try {
    const msg = {
      to: toEmail,
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      subject: 'One-Time Password (OTP) Verification',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #2c3e50;">NoteVault Verification</h2>
          <p>Your One-Time Password (OTP) for verification is:</p>
          <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">
            ${otp}
          </h3>
          <p>This code will expire in <b>10 minutes</b>. Please do not share it with anyone.</p>
          <br/>
          <p>Best regards,<br/>NoteVault Team</p>
        </div>
      `,
      // Optional: add custom args so you can search in SendGrid UI
      customArgs: {
        service: 'notevault',
        purpose: 'otp'
      }
    };

    // sgMail.send returns a promise resolving to an array of responses.
    const res = await sgMail.send(msg);
    // res is usually an array; take first element
    const first = Array.isArray(res) ? res[0] : res;
    const status = first && first.statusCode ? first.statusCode : 'unknown';
    const headers = first && first.headers ? first.headers : {};
    const messageId = headers && (headers['x-message-id'] || headers['x-message-id'.toLowerCase()]) || headers['X-Message-Id'] || null;

    console.log('📤 SendGrid response status:', status);
    console.log('📤 SendGrid headers:', headers);
    if (messageId) console.log(`🔎 Message-ID (search in SendGrid Email Activity): ${messageId}`);

    return { status, messageId, headers };
  } catch (error) {
    // Better error logging for SendGrid
    if (error.response && error.response.body) {
      console.error('SendGrid response error:', JSON.stringify(error.response.body, null, 2));
    } else {
      console.error('❌ Failed to send OTP email:', error);
    }
    throw new Error('Email sending failed');
  }
};

module.exports = { sendOtpEmail };