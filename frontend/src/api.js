const BASE_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

const request = async (path, method = "GET", body) => {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

export const signup = (data) => request("/user/signup", "POST", data);
export const login = (data) => request("/user/login", "POST", data);
export const getProfile = () => request("/user/profile");
export const getCandidates = () => request("/candidate/");
export const voteCandidate = (id) => request(`/candidate/vote/${id}`, "POST");
export const getResults = () => request("/candidate/vote/count");
export const addCandidate = (data) => request("/candidate/", "POST", data);
export const updateCandidate = (id, data) => request(`/candidate/${id}`, "PUT", data);
export const deleteCandidate = (id) => request(`/candidate/${id}`, "DELETE");
export const updatePassword = (data) => request("/user/profile/password", "PUT", data);