import TrustedContact from "../models/TrustedContact.js";

// Add contact
export const addContact = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const contact = await TrustedContact.create({ user: req.user._id, name, phone });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({ user: req.user._id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};