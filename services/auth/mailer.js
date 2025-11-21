// utils/mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendOtpEmail = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: `"NoteVault Support" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "One-Time Password (OTP) Verification",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                    <h2 style="color: #2c3e50;">NoteVault Verification</h2>
                    <p>Dear User,</p>
                    <p>Your One-Time Password (OTP) for verification is:</p>
                    <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 4px;">
                        ${otp}
                    </h3>
                    <p>This code will expire in <b>10 minutes</b>. Please do not share it with anyone.</p>
                    <br/>
                    <p>Best regards,<br/>NoteVault Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent successfully to ${toEmail}`);
    } catch (error) {
        console.error("❌ Failed to send OTP email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = { sendOtpEmail };
