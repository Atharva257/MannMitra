import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/users/";

// Register user
export const register = async (userData) => {
  const res = await axios.post(API_URL + "register", userData);
  return res.data;
};

// Login user
export const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData);
  return res.data;
};

// Verify OTP
export const verifyOTP = async (verifyData) => {
  const res = await axios.post(API_URL + "verify-otp", verifyData);
  return res.data;
};

// Resend OTP
export const resendOTP = async (email) => {
  const res = await axios.post(API_URL + "resend-otp", { email });
  return res.data;
};