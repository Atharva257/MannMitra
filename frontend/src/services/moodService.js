import API from "./api";

export const getMoodHistory = async () => {
  const { data } = await API.get("/moods/history");
  return data;
};

export const saveMood = async (mood) => {
  const { data } = await API.post("/moods", { mood });
  return data;
};
