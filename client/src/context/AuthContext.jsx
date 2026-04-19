import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            // Check if token expired
            if (decoded.exp * 1000 < Date.now()) {
                logout();
            } else {
                setUser(decoded);
                // Ideally fetch user details from backend to be sure
                API.get("/auth/me")
                    .then((res) => {
                        setUser(res.data); // Update with full user object from DB (including role)
                        setLoading(false);
                    })
                    .catch(() => {
                        logout();
                        setLoading(false);
                    });
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data);
            navigate("/dashboard");
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await API.post("/auth/register", userData);
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data);
            navigate("/dashboard");
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message);
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
