import API from "./api";

export const sendMessage = async (message, chatHistory = []) => {
  const res = await API.post("/chat", { message, chatHistory });
  return res.data;
};
