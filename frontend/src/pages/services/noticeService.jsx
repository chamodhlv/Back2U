import axios from "axios";

const API = "http://localhost:5000/api/notices";

// Public
export const getAllNotices = () => axios.get(API);

export const getNotice = (id) => axios.get(`${API}/${id}`);

export const getPriorityNotices = () => axios.get(`${API}/priority`);

export const getNoticesByCategory = (category) => axios.get(`${API}/category/${category}`);

// Admin
export const getAllNoticesAdmin = () => axios.get(`${API}/admin`);

export const createNotice = (data) => axios.post(`${API}/create`, data);

export const updateNotice = (id, data) => axios.put(`${API}/update/${id}`, data);

export const deleteNotice = (id) => axios.delete(`${API}/delete/${id}`);

export const archiveNotice = (id) => axios.put(`${API}/archive/${id}`);
