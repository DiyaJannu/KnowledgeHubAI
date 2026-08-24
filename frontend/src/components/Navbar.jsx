import { useEffect, useState } from "react";
import api from "../api/axios";

function Navbar() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await api.get("/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);

            } catch (error) {

                console.error("Failed to load user:", error);

            }

        };

        fetchUser();

    }, []);

    return (

        <header className="bg-gradient-to-r from-sky-50 via-white to-purple-50 shadow-sm h-20 flex items-center justify-between px-10 border-b border-slate-200">

            {/* Brand */}

            <div>

                <h2 className="text-3xl font-bold">
                    🧠 KnowledgeHub AI
                </h2>

                <p className="ml-10 text-gray-500">
                    AI Powered Document Assistant
                </p>

            </div>


            {/* Profile */}

            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">

                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">

                    {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : "U"
                    }

                </div>

                <div>

                    <p className="font-semibold">

                        {user?.name || "User"}

                    </p>

                    <p className="text-sm text-gray-500">

                        Student

                    </p>

                </div>

            </div>

        </header>

    );

}

export default Navbar;