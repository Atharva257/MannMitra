import axios from "axios";

export const chatReply = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "Please enter a message." });

  try {
    // Call HuggingFace inference API (DialoGPT or similar)
    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-small",
      { inputs: message },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    let reply = hfRes.data?.generated_text || "I'm here for you. Please tell me more.";
    res.json({ reply });
  } catch (err) {
    // fallback response
    res.json({ reply: "I understand this is tough. You're not alone. Can you share more about how you're feeling?" });
  }
};