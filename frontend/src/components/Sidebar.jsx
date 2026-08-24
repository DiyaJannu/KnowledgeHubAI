import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={22} />
        },
        {
            name: "Documents",
            path: "/documents",
            icon: <FileText size={22} />
        },
        {
            name: "AI Chat",
            path: "/chat",
            icon: <MessageSquare size={22} />
        },
        {
            name: "Settings",
            path: "/settings",
            icon: <Settings size={22} />
        }
    ];

    return (

        <aside className="w-60 bg-[#EEF6FF] text-slate-100 flex flex-col shadow-xl">

            {/* Navigation */}

            <nav className="flex-1 pt-10 px-4">

                {menuItems.map((item) => (

                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300

${location.pathname === item.path
                                ? "text-black font-semibold"
                                : "text-slate-600 hover:bg-white hover:text-black hover:shadow-sm"
                            }`}
                    >

                        {item.icon}

                        <span className="font-semibold text-lg">

                            {item.name}

                        </span>

                    </Link>

                ))}

            </nav>

            {/* Logout */}

            <div className="p-5">

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full bg-rose-500 hover:bg-rose-600 rounded-2xl py-4 font-semibold transition-all duration-300 hover:scale-[1.02]"
                > Logout
                </button>

            </div>

        </aside>

    );

}

export default Sidebar;