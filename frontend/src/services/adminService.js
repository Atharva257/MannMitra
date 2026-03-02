import API from "./api";

export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const getAllAssessments = async () => {
  const res = await API.get("/admin/assessments");
  return res.data;
};

export const getCrisisLogs = async () => {
  const res = await API.get("/admin/crisis");
  return res.data;
};
