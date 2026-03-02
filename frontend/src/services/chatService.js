import API from "./api";

export const sendMessage = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data;
};
