import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700">
                Welcome, {user?.name}
            </div>
            <div>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
