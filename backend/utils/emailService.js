const nodemailer = require('nodemailer');

// Create Gmail transporter for production
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'freesarvesh@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD // Use app password from environment variable
    }
  });
};

// Create a test account for development (fallback)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    // Fallback to console logging for development
    return {
      sendMail: async (options) => {
        console.log('📧 Email would be sent:', {
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html
        });
        return { messageId: 'console-log' };
      }
    };
  }
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    // Use Gmail if app password is configured, otherwise use test account
    const transporter = process.env.GMAIL_APP_PASSWORD 
      ? createGmailTransporter() 
      : await createTestAccount();
    
    const mailOptions = {
      from: 'freesarvesh@gmail.com',
      to: email,
      subject: 'Email Verification - StatsOfIndia',
      text: `Your verification code is: ${otp}\n\nThis code will expire in 3 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">StatsOfIndia</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with StatsOfIndia! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #495057; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              This verification code will expire in <strong>3 minutes</strong>. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Security Tip:</strong> Never share this code with anyone. StatsOfIndia will never ask for your verification code via phone or email.
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, fullName) => {
  try {
    // Use Gmail if app password is configured, otherwise use test account
    const transporter = process.env.GMAIL_APP_PASSWORD 
      ? createGmailTransporter() 
      : await createTestAccount();
    
    const mailOptions = {
      from: 'freesarvesh@gmail.com',
      to: email,
      subject: 'Welcome to StatsOfIndia!',
      text: `Welcome ${fullName}!\n\nThank you for joining StatsOfIndia. Your account has been successfully verified and activated.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">StatsOfIndia</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome aboard!</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${fullName}! 🎉</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your account has been successfully verified and activated. You now have full access to all features of StatsOfIndia.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>📊 Browse and download datasets</li>
                <li>🔍 Search for specific data</li>
                <li>⭐ Bookmark your favorite datasets</li>
                <li>📈 Access detailed statistics</li>
                <li>👤 Manage your profile and preferences</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Exploring Data
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              Thank you for choosing StatsOfIndia for your data needs!
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail
}; 