import MainLayout from "../layout/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import api from "../api/axios";

function PDFViewer() {
    const { documentId } = useParams();
    const navigate = useNavigate();

    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let objectUrl = null;

        const loadPDF = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await api.get(
                    `/document/${documentId}/file`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        responseType: "blob",
                    }
                );

                objectUrl = URL.createObjectURL(response.data);

                setPdfUrl(objectUrl);

            } catch (error) {
                console.error("Error loading PDF:", error);

                setError(
                    "Unable to load this PDF. Please try again."
                );

            } finally {
                setLoading(false);
            }
        };

        loadPDF();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };

    }, [documentId]);

    return (
        <MainLayout>

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/documents")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition"
                    >
                        <ArrowLeft size={18} />

                        Back
                    </button>

                    <div>

                        <h1 className="text-3xl font-bold">
                            PDF Viewer
                        </h1>

                        <p className="text-slate-500 text-sm mt-1">
                            Document #{documentId}
                        </p>

                    </div>

                </div>

                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        <ExternalLink size={18} />

                        Open in New Tab
                    </a>
                )}

            </div>


            {/* PDF Area */}

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[75vh] border border-slate-200">

                {loading && (

                    <div className="h-full flex flex-col items-center justify-center">

                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin">
                        </div>

                        <p className="text-slate-500 mt-4">
                            Loading PDF...
                        </p>

                    </div>

                )}


                {!loading && error && (

                    <div className="h-full flex flex-col items-center justify-center">

                        <p className="text-red-500 font-medium">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {!loading && !error && pdfUrl && (

                    <iframe
                        src={pdfUrl}
                        title="PDF Viewer"
                        className="w-full h-full border-0"
                    />

                )}

            </div>

        </MainLayout>
    );
}

export default PDFViewer;