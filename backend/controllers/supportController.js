import { sendContactEmail } from "../services/emailService.js";

/**
 * Handle Contact Us form submission
 * @route POST /api/support/contact
 */
export const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ message: "Thank you for reaching out! Your message has been sent." });
  } catch (error) {
    console.error("Support Controller Error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
};