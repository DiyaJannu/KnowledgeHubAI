import MainLayout from "../layout/MainLayout";
import UploadBox from "../components/UploadBox";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    FileText,
    MessageSquare,
    Sparkles,
    ArrowRight
} from "lucide-react";

function Dashboard() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await api.get("/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDocuments(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    return (

        <MainLayout>

            {/* Hero Section */}

            <section className="mb-14">

                <p className="text-indigo-600 font-semibold text-lg">

                    AI Powered Workspace

                </p>

                <h1 className="text-5xl font-bold text-slate-900 mt-3 leading-tight">

                    Chat with your PDFs
                    <br />
                    using Artificial Intelligence

                </h1>

                <p className="mt-5 text-slate-500 text-lg max-w-3xl">

                    Upload books, notes, research papers, and chat with them using Gemini AI.

                </p>



            </section>
            {/* Upload Section */}

            <section className="mb-14">

                <UploadBox onUpload={fetchDocuments} />

            </section>
            {/* Overview */}

            <section>

                <h2 className="text-2xl font-bold mb-6">

                    Quick Overview

                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Documents */}

                    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">

                        <div className="flex justify-between items-center">

                            <FileText
                                size={34}
                                className="text-indigo-600"
                            />

                            <span className="text-sm text-slate-400">

                                Uploaded Files

                            </span>

                        </div>

                        <h3 className="text-4xl font-bold mt-8">

                            {documents.length}

                        </h3>

                        <p className="text-slate-500 mt-2">

                            Documents

                        </p>

                    </div>

                    {/* Questions */}

                    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">

                        <div className="flex justify-between items-center">

                            <MessageSquare
                                size={34}
                                className="text-violet-600"
                            />

                            <span className="text-sm text-slate-400">

                                AI Requests

                            </span>

                        </div>

                        <h3 className="text-4xl font-bold mt-8">

                            0

                        </h3>

                        <p className="text-slate-500 mt-2">

                            Questions Asked

                        </p>

                    </div>

                    {/* Status */}

                    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">

                        <div className="flex justify-between items-center">

                            <Sparkles
                                size={34}
                                className="text-emerald-600"
                            />

                            <span className="text-sm text-emerald-600 font-semibold">

                                Online

                            </span>

                        </div>

                        <h3 className="text-4xl font-bold mt-8">

                            Ready

                        </h3>

                        <p className="text-slate-500 mt-2">

                            AI Assistant

                        </p>

                    </div>

                </div>

            </section>

            {/* Recent Documents */}

            <section className="mt-14">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">

                        Recent Documents

                    </h2>

                    <Link
                        to="/documents"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        View All
                    </Link>

                </div>

                <div className="bg-white rounded-3xl shadow-sm">

                    {documents.slice(0, 3).map((doc) => (

                        <div
                            key={doc.id}
                            className="flex justify-between items-center px-8 py-6 border-b last:border-none hover:bg-slate-50 transition"
                        >

                            <div>

                                <h3 className="font-semibold">

                                    {doc.filename}

                                </h3>

                                <p className="text-slate-500 text-sm mt-1">

                                    Uploaded PDF

                                </p>

                            </div>
                            <Link
                                to={`/pdf/${doc.id}`}
                                className="flex items-center gap-2 text-indigo-600 font-semibold"
                            >
                                Open

                                <ArrowRight size={18} />
                            </Link>
                        </div>

                    ))}

                </div>

            </section>

        </MainLayout>

    );

}

export default Dashboard;