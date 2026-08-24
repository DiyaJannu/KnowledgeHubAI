import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const data = await loginUser(email, password);

            localStorage.setItem(
                "token",
                data.access_token
            );

            alert("Login Successful!");

            navigate("/dashboard");

        } catch (error) {

            alert("Invalid Email or Password");

        }

    };

    return (

        <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200 flex items-center justify-center p-6">

            <div className="w-full max-w-6xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* LEFT */}

                <div className="flex flex-col justify-center p-10">

                    <h1 className="text-5xl font-extrabold text-indigo-700">
                        KnowledgeHub AI
                    </h1>

                    <p className="mt-3 text-gray-600 text-lg">
                        Chat with your documents using Artificial Intelligence.
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="mt-10 space-y-6"
                    >

                        <div>

                            <label className="font-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full rounded-xl border p-4"
                            />

                        </div>

                        <div>

                            <label className="font-semibold">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full rounded-xl border p-4"
                            />

                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl"
                        >
                            Login
                        </button>

                    </form>

                    <p className="text-center mt-8">

                        Don't have an account?

                        <Link
                            to="/register"
                            className="text-indigo-700 font-bold ml-2"
                        >
                            Register
                        </Link>

                    </p>

                </div>

                {/* RIGHT */}

                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

                    <div className="text-center text-white">

                        <div className="text-8xl">
                            🤖
                        </div>

                        <h2 className="text-4xl font-bold mt-6">
                            AI Powered Learning
                        </h2>

                        <p className="mt-5 text-lg">

                            Upload PDFs

                            <br />

                            Ask Questions

                            <br />

                            Get Intelligent Answers

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;