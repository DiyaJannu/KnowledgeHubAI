import { Link } from "react-router-dom";
import { Eye, MessageSquare, MoreVertical } from "lucide-react";
import DocumentMenu from "./DocumentMenu";

function DocumentCard({ document, onDelete }) {
    return (
        <div className="flex justify-between items-center border-b py-5">

            <div>

                <h3 className="font-semibold text-lg">
                    {document.filename}
                </h3>

                <p className="text-slate-500 text-sm">
                    Uploaded PDF
                </p>


            </div>

            <div className="flex items-center gap-4">

                <Link
                    to={`/pdf/${document.id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    <Eye size={20} />
                </Link>

                <Link
                    to="/chat"
                    className="text-green-600 hover:text-green-800"
                >
                    <MessageSquare size={20} />
                </Link>

                <DocumentMenu

                    onDelete={() => {
                        const confirmDelete = window.confirm(
                            `Delete "${document.filename}"?`
                        );

                        if (confirmDelete) {
                            onDelete(document.id);
                        }
                    }}
                />

            </div>

        </div>
    );
}

export default DocumentCard;