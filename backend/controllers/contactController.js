import TrustedContact from "../models/TrustedContact.js";

// Add contact (Mentor/Admin only)
export const addContact = async (req, res) => {
  try {
    if (req.user.role === "student") {
      return res.status(403).json({ message: "Only mentors and admins can add emergency contacts" });
    }
    const { name, phone } = req.body;
    const contact = await TrustedContact.create({ name, phone });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get contacts (Global - everyone can view)
export const getContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};