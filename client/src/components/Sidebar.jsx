import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Businesses", path: "/businesses" },
        { name: "Invoices", path: "/invoices" },
        { name: "Tax Reports", path: "/reports" },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">ETIMS</div>
            <nav className="flex-1 p-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-2">
                            <Link
                                to={item.path}
                                className={`block p-2 rounded hover:bg-gray-700 transition-colors ${location.pathname === item.path ? "bg-gray-700" : ""
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
                &copy; 2026 ETIMS
            </div>
        </div>
    );
};

export default Sidebar;
