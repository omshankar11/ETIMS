import axios from "axios";

const API = axios.create({
    baseURL: "https://your-backend-url/api",
});

// Add auth token to every request if available
API.interceptors.request.use((req) => {
    if (localStorage.getItem("token")) {
        req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return req;
});

export default API;
