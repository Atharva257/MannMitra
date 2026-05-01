import { google } from "googleapis";

/**
 * WHY GMAIL API INSTEAD OF SMTP (NODEMAILER):
 * Render's infrastructure binds outbound TCP connections to an IPv6 socket (:::0).
 * Gmail's SMTP resolves to IPv6 addresses (2404:6800:...) which Render cannot route.
 * No nodemailer config (family:4, lookup override, dns.setDefaultResultOrder) can fix
 * this because the OS itself opens an IPv6 socket before the connection attempt.
 *
 * The Gmail API uses HTTPS (port 443) which Render routes correctly over IPv4.
 * This project already has the required Google OAuth2 credentials in .env.
 */

const getGmailClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Must match the URI used when refresh token was generated
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
};

/**
 * Encodes an email message to base64url format for the Gmail API
 */
const buildRawMessage = ({ from, to, replyTo, subject, html }) => {
  const replyToHeader = replyTo ? `Reply-To: ${replyTo}\r\n` : "";
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    replyToHeader.trim(),
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ]
    .filter(Boolean)
    .join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Send OTP Email for registration verification
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit code
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    // Fallback: log to console if no credentials configured
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_REFRESH_TOKEN
    ) {
      console.log("-----------------------------------------");
      console.log(`| DEMO EMAIL FOR: ${email}`);
      console.log(`| YOUR OTP CODE IS: ${otp}`);
      console.log("| Please enter this in the verification screen.");
      console.log("-----------------------------------------");
      return;
    }

    const gmail = getGmailClient();

    const raw = buildRawMessage({
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
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
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

    // Fallback: log to console if no credentials configured
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_REFRESH_TOKEN
    ) {
      console.log("-----------------------------------------");
      console.log(`| DEMO CONTACT FORM SUBMISSION`);
      console.log(`| FROM: ${name} (${email})`);
      console.log(`| SUBJECT: ${subject}`);
      console.log(`| MESSAGE: ${message}`);
      console.log("-----------------------------------------");
      return;
    }

    const gmail = getGmailClient();

    const raw = buildRawMessage({
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
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="font-size: 0.8em; color: #999;">This message was sent from the MannMitra Contact Us form.</p>
        </div>
      `,
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
  } catch (error) {
    console.error("Contact Email Service Error:", error);
    throw error;
  }
};