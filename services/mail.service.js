import nodeMailer from 'nodemailer';
import config from '../config/config.js';

const createTransport = () => {
  return nodeMailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: config.MAIL_SECURE,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });
};

export const sendEmail = async (to, subject, html) => {
  const transport = createTransport();

  try {
    const info = await transport.sendMail({
      from: `"${config.MAIL_FROM_NAME}" <${config.MAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  try {
    await sendEmail(email, subject, html);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
