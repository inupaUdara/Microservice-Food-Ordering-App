const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to read email templates
const getTemplate = (templateName, data) => {
  let templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  // Replace placeholders with dynamic data
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key]);
  });
  
  return template;
};

// Send email using HTML template
const sendEmail = (to, subject, templateName, data) => {
  const emailHTML = getTemplate(templateName, data);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: emailHTML,  // Sending HTML content
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
