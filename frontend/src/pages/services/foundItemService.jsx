import axios from "axios";

const API = "http://localhost:5000/api/found-items";
const CLAIM_API = "http://localhost:5000/api/claims";

// Found Items
export const getAllItems = () => axios.get(API);

export const getItem = (id) => axios.get(`${API}/${id}`);

export const createItem = (data) => axios.post(`${API}/create`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const updateItem = (id, data) => axios.put(`${API}/update/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const archiveItem = (id) => axios.delete(`${API}/archive/${id}`);

// Claims
export const submitClaim = (itemId, data) => axios.post(`${CLAIM_API}/create/${itemId}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const getClaimsByItem = (itemId) => axios.get(`${CLAIM_API}/item/${itemId}`);

export const getClaim = (id) => axios.get(`${CLAIM_API}/${id}`);

export const approveClaim = (claimId) => axios.put(`${CLAIM_API}/approve/${claimId}`);

export const rejectClaim = (claimId) => axios.put(`${CLAIM_API}/reject/${claimId}`);