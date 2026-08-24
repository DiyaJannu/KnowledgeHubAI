import MainLayout from "../layout/MainLayout";
import { useEffect, useState } from "react";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Settings() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {

        try {

            const token = localStorage.getItem("token");

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

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };

    return (

        <MainLayout>

            <div className="max-w-4xl">

                {/* Header */}

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-slate-900">
                        Settings
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage your account and application information.
                    </p>

                </div>


                {/* Account */}

                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">

                    <div className="flex items-center gap-3 mb-8">

                        <User
                            size={24}
                            className="text-indigo-600"
                        />

                        <h2 className="text-2xl font-bold">
                            Account
                        </h2>

                    </div>


                    <div className="flex items-center gap-5">

                        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">

                            {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"
                            }

                        </div>


                        <div>

                            <h3 className="text-xl font-semibold">
                                {user.name || "Loading..."}
                            </h3>

                            <div className="flex items-center gap-2 text-slate-500 mt-1">

                                <Mail size={16} />

                                <span>
                                    {user.email || "Loading..."}
                                </span>

                            </div>

                            <p className="text-sm text-slate-400 mt-1">
                                Student
                            </p>

                        </div>

                    </div>

                </section>


                {/* Application */}

                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6">

                    <div className="flex items-center gap-3 mb-6">

                        <Shield
                            size={24}
                            className="text-indigo-600"
                        />

                        <h2 className="text-2xl font-bold">
                            Application
                        </h2>

                    </div>


                    <div>

                        <h3 className="text-lg font-semibold">
                            KnowledgeHub AI
                        </h3>

                        <p className="text-slate-500 mt-1">
                            AI Powered Document Assistant
                        </p>

                        <p className="text-sm text-slate-400 mt-4">
                            Version 1.0.0
                        </p>

                    </div>

                </section>


                {/* Logout */}

                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

                    <h2 className="text-xl font-bold mb-2">
                        Account
                    </h2>

                    <p className="text-slate-500 mb-5">
                        Sign out of your KnowledgeHub AI account.
                    </p>


                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition font-semibold"
                    >

                        <LogOut size={18} />

                        Log Out

                    </button>

                </section>

            </div>

        </MainLayout>
    );
}

export default Settings;