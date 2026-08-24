import MainLayout from "../layout/MainLayout";
import { useEffect, useState } from "react";
import api from "../api/axios";
import DocumentCard from "../components/DocumentCard";

function Documents() {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/documents", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response:", response.data);

                setDocuments(response.data);



            } catch (error) {
                console.error(error);
            }
        };

        fetchDocuments();
    }, []);

    const handleDelete = async (documentId) => {
        try {
            const token = localStorage.getItem("token");

            await api.delete(`/document/${documentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted document from the UI immediately
            setDocuments((prev) =>
                prev.filter((doc) => doc.id !== documentId)
            );

        } catch (error) {
            console.error(error);
            alert("Failed to delete document.");
        }
    };
    return (
        <MainLayout>
            <h1 className="text-4xl font-bold mb-8">
                All Documents
            </h1>

            <div className="bg-white rounded-3xl shadow p-8">

                {documents.length === 0 ? (

                    <p className="text-slate-500">
                        No documents uploaded.
                    </p>

                ) : (

                    documents.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onDelete={handleDelete}
                        />
                    ))

                )}

            </div>
        </MainLayout>
    );
}

export default Documents;