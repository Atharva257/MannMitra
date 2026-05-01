import nodemailer from "nodemailer";
import dns from "dns";

/**
 * Custom DNS lookup that forces IPv4 resolution.
 * This is the ONLY reliable way to prevent ENETUNREACH on Render's network,
 * which does not support outbound IPv6 (address family 2404:6800:...).
 * Neither `family: 4` nor `dns.setDefaultResultOrder` work reliably on Render.
 */
const ipv4Lookup = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, family: 4 }, callback);
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    lookup: ipv4Lookup, // ← Force IPv4 at socket connection level
  });


/**
 * Send OTP Email for registration verification
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit code
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    // Check if we have email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("-----------------------------------------");
      console.log(`| DEMO EMAIL FOR: ${email}`);
      console.log(`| YOUR OTP CODE IS: ${otp}`);
      console.log("| Please enter this in the verification screen.");
      console.log("-----------------------------------------");
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"MannMitra Safety" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your MannMitra Account 🌿",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4a90e2;">Welcome to MannMitra!</h2>
          <p>Thank you for joining our community. Please use the following code to verify your email address:</p>
          <div style="background: #f4f7f6; padding: 20px; text-align: center; border-radius: 10px;">
            <h1 style="letter-spacing: 5px; color: #4a90e2; margin: 0;">${otp}</h1>
          </div>
          <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This code will expire in 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #999;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Service Error:", error);
  }
};

/**
 * Send Contact Us Inquiry to support email
 * @param {Object} data - Contact form data {name, email, subject, message}
 */
export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const supportEmail = "mannmitra.noreply@gmail.com";
    
    // Check if we have email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("-----------------------------------------");
      console.log(`| DEMO CONTACT FORM SUBMISSION`);
      console.log(`| FROM: ${name} (${email})`);
      console.log(`| SUBJECT: ${subject}`);
      console.log(`| MESSAGE: ${message}`);
      console.log("-----------------------------------------");
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"MannMitra Support" <${process.env.EMAIL_USER}>`,
      to: supportEmail,
      replyTo: email,
      subject: `New Support Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Contact Message</h2>
          <div style="margin: 20px 0;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 10px; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="font-size: 0.8em; color: #999;">This message was sent from the MannMitra Contact Us form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Contact Email Service Error:", error);
    throw error;
  }
};