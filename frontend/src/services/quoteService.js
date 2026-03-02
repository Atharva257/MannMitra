import API from "./api";

export const getTodaysQuote = async () => {
  const { data } = await API.get("/quotes/today");
  return data;
};