import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            await api.post("/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            alert("Registration Successful!");

            navigate("/login");

        } catch (error) {

            console.error(error);

            alert("Registration Failed.");

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-white to-pink-200">

            <div className="w-[92%] max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2">

                {/* Left Side */}

                <div className="p-16">

                    <h1 className="text-5xl font-bold text-indigo-700 text-center">
                        KnowledgeHub AI
                    </h1>

                    <div className="text-center mt-6 mb-10">

                        <h2 className="text-3xl font-bold">
                            Create New Account
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Join us and start your AI learning journey
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Name */}

                        <div>

                            <label className="font-semibold block mb-2">
                                Name
                            </label>

                            <div className="relative">

                                <User
                                    size={20}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div>

                            <label className="font-semibold block mb-2">
                                Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={20}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    onInvalid={(e) =>
                                        e.target.setCustomValidity("Please enter a valid email address.")
                                    }
                                    onInput={(e) =>
                                        e.target.setCustomValidity("")
                                    }
                                    className="w-full mt-2 border rounded-2xl pl-16 pr-5 py-4" />

                            </div>

                        </div>

                        {/* Password */}

                        <div>

                            <label className="font-semibold block mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={20}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-xl py-4 pl-14 pr-14 outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="font-semibold block mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={20}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-xl py-4 pl-14 pr-14 outline-none focus:ring-2 focus:ring-indigo-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-[1.02] transition-all duration-300"
                        >
                            Create Account
                        </button>

                    </form>

                    <p className="text-center mt-8">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-indigo-600 font-semibold"
                        >
                            Login
                        </Link>

                    </p>

                </div>

                {/* Right Side */}

                <div className="bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white">

                    <div className="text-8xl mb-8">
                        🤖
                    </div>

                    <h2 className="text-5xl font-bold mb-10">
                        AI Powered Learning
                    </h2>

                    <div className="space-y-5 text-2xl text-center">

                        <p>📄 Upload PDFs</p>

                        <p>💬 Ask Questions</p>

                        <p>⚡ Get Intelligent Answers</p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;