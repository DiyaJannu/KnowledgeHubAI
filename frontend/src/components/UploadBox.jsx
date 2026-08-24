import { UploadCloud } from "lucide-react";
import { useRef } from "react";
import api from "../api/axios";

function UploadBox({ onUpload }) {
    const fileInputRef = useRef(null);

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Only allow PDF files
        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file only.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Uploaded:", response.data);

            // Tell Dashboard that a new document was uploaded
            if (onUpload) {
                onUpload(response.data);
            }

            alert("PDF uploaded successfully!");

        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload PDF.");
        }

        // Allow the same file to be selected again
        event.target.value = "";
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10">

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                {/* Left */}

                <div>

                    <p className="text-indigo-600 font-semibold uppercase tracking-wide">
                        Upload Document
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        Bring your PDFs to life
                    </h2>

                    <p className="text-slate-500 mt-5 max-w-xl leading-8">
                        Upload books, notes, research papers, or documents.
                        Gemini AI will understand your PDFs and answer your
                        questions instantly.
                    </p>

                    <button
                        type="button"
                        onClick={handleBrowse}
                        className="mt-8 bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl shadow-lg"
                    >
                        Browse PDF
                    </button>

                </div>

                {/* Right */}

                <div
                    onClick={handleBrowse}
                    className="
                        group
                        border-2
                        border-dashed
                        border-indigo-300
                        rounded-3xl
                        p-14
                        bg-indigo-50
                        cursor-pointer
                        transition-all
                        duration-300
                        ease-out
                        hover:bg-indigo-100
                        hover:border-indigo-500
                        hover:shadow-xl
                        hover:scale-[1.02]
                    "
                >

                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        hidden
                    />

                    <div className="bg-white p-6 rounded-full shadow-md transition-all duration-300 group-hover:shadow-indigo-300">

                        <UploadCloud
                            size={70}
                            className="text-indigo-600 float-animation transition-transform duration-300 group-hover:-translate-y-2"
                        />

                        <h3 className="font-bold text-2xl mt-6">
                            Drag & Drop
                        </h3>

                        <p className="text-slate-500 mt-3">
                            Supports PDF files only
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default UploadBox;