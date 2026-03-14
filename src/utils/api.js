// import axios from 'axios';
// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', timeout: 30000 });
// API.interceptors.request.use(c => { const t=localStorage.getItem('ag_token'); if(t) c.headers.Authorization=`Bearer ${t}`; return c; });
// export const inspectionAPI = {
//   getAll:       p      => API.get('/inspections', { params: p }),
//   getOne:       id     => API.get(`/inspections/${id}`),
//   create:       d      => API.post('/inspections', d),
//   update:       (id,d) => API.put(`/inspections/${id}`, d),
//   delete:       id     => API.delete(`/inspections/${id}`),
//   getStats:     ()     => API.get('/inspections/stats'),
//   reportIssue:  (id,m) => API.post(`/inspections/${id}/report-issue`, { message: m }),
//   resolveIssue: (id,r) => API.put(`/inspections/${id}/resolve-issue`, { adminReply: r }),
// };
// export const userAPI = {
//   getAll:  ()     => API.get('/users'),
//   update:  (id,d) => API.put(`/users/${id}`, d),
//   delete:  id     => API.delete(`/users/${id}`),
// };
// export const getPDFUrl = id => `${process.env.REACT_APP_API_URL||'http://localhost:5000/api'}/pdf/generate/${id}?token=${localStorage.getItem('ag_token')}`;
// export default API;



import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 30000,
});

API.interceptors.request.use((c) => {
  const t = localStorage.getItem("ag_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export const inspectionAPI = {
  getAll: (p) => API.get("/inspections", { params: p }),
  getOne: (id) => API.get(`/inspections/${id}`),
  create: (d) => API.post("/inspections", d),
  update: (id, d) => API.put(`/inspections/${id}`, d),
  delete: (id) => API.delete(`/inspections/${id}`),
  getStats: () => API.get("/inspections/stats"),
  reportIssue: (id, m) =>
    API.post(`/inspections/${id}/report-issue`, { message: m }),
  resolveIssue: (id, r) =>
    API.put(`/inspections/${id}/resolve-issue`, { adminReply: r }),
};

export const userAPI = {
  getAll: () => API.get("/users"),
  update: (id, d) => API.put(`/users/${id}`, d),
  delete: (id) => API.delete(`/users/${id}`),
};

export const getPDFUrl = (id) =>
  `/api/pdf/generate/${id}?token=${localStorage.getItem("ag_token")}`;

export default API;
