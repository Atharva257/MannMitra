import API from "./api";

export const submitAssessment = async (answers) => {
  const res = await API.post("/assessments", { answers });
  return res.data;
};

export const getHistory = async () => {
  const res = await API.get("/assessments");
  return res.data;
};
