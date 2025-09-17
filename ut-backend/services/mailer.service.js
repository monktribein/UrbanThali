const nodemailer = require('nodemailer');
const { secret } = require('../config/secret');

/**
 * Create a nodemailer transporter using environment configuration
 */
function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: secret.email_host,
    service: secret.email_service,
    port: Number(secret.email_port) || 465,
    secure: true,
    auth: {
      user: secret.email_user,
      pass: secret.email_pass,
    },
  });

  return transporter;
}

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.html - html content
 * @param {Array} [options.attachments] - nodemailer attachments
 */
async function sendEmail({ to, subject, html, attachments = [] }) {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email transporter verified successfully');
    
    const result = await transporter.sendMail({
      from: `UrbanThali Orders <${secret.email_user}>`,
      to,
      subject,
      html,
      attachments,
    });
    
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendEmail };







