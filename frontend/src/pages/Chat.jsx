import MainLayout from "../layout/MainLayout";
import { useEffect, useState } from "react";
import {
    Send,
    Sparkles,
    Plus,
    Trash2,
    MessageSquare,
    FileText,
    X
} from "lucide-react";
import api from "../api/axios";

function Chat() {

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);

    const [chats, setChats] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [selectedChat, setSelectedChat] = useState(null);

    const [showDocuments, setShowDocuments] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingDocuments, setLoadingDocuments] = useState(false);


    // Load previous chats
    useEffect(() => {

        fetchChats();

    }, []);


    // Fetch chat history
    const fetchChats = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get("/chats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setChats(response.data);

        } catch (error) {

            console.error("Failed to load chats:", error);

        } finally {

            setLoadingChats(false);

        }
    };


    // Open New Chat → load PDFs
    const handleNewChat = async () => {

        try {

            setLoadingDocuments(true);
            setShowDocuments(true);

            const token = localStorage.getItem("token");

            const response = await api.get("/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDocuments(response.data);

        } catch (error) {

            console.error("Failed to load documents:", error);

        } finally {

            setLoadingDocuments(false);

        }
    };


    // Create chat for selected PDF
    const handleSelectDocument = async (document) => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/chats",
                {
                    document_id: document.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setChats((prev) => [
                response.data,
                ...prev,
            ]);

            setSelectedChat(response.data);

            setMessages([]);

            setShowDocuments(false);

        } catch (error) {

            console.error("Failed to create chat:", error);

            alert("Unable to create chat.");

        }
    };


    // Open previous chat
    const handleSelectChat = async (chat) => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                `/chat/${chat.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedChat(chat);

            const formattedMessages = [];

            response.data.forEach((message) => {

                formattedMessages.push({
                    sender: "user",
                    text: message.question,
                });

                formattedMessages.push({
                    sender: "ai",
                    text: message.answer,
                });

            });

            setMessages(formattedMessages);

        } catch (error) {

            console.error("Failed to load chat:", error);

        }
    };


    // Delete chat
    const handleDeleteChat = async (chatId) => {

        try {

            const token = localStorage.getItem("token");

            await api.delete(
                `/chat/${chatId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setChats((prev) =>
                prev.filter((chat) => chat.id !== chatId)
            );

            if (selectedChat?.id === chatId) {

                setSelectedChat(null);
                setMessages([]);

            }

        } catch (error) {

            console.error("Failed to delete chat:", error);

        }
    };


    // Send question
    const handleSend = async () => {

        if (!question.trim()) return;

        if (!selectedChat) {

            alert("Please select a chat first.");

            return;

        }

        const userQuestion = question;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userQuestion,
            },
        ]);

        setQuestion("");
        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/ask",
                {
                    question: userQuestion,
                    chat_id: selectedChat.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data.answer,
                },
            ]);

        } catch (error) {

            console.error("Question error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Something went wrong. Please try again.",
                },
            ]);

        } finally {

            setLoading(false);

        }
    };


    return (

        <MainLayout>

            <div className="flex h-[85vh] gap-6">

                {/* CHAT HISTORY */}

                <div className="w-72 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col">

                    <div className="flex items-center justify-between mb-5">

                        <h2 className="font-bold text-xl">
                            Chat History
                        </h2>

                        <button
                            onClick={handleNewChat}
                            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            title="New Chat"
                        >
                            <Plus size={20} />
                        </button>

                    </div>


                    {/* PDF SELECTION */}

                    {showDocuments && (

                        <div className="mb-5 border rounded-2xl p-4 bg-slate-50">

                            <div className="flex items-center justify-between mb-3">

                                <h3 className="font-semibold">
                                    Choose a PDF
                                </h3>

                                <button
                                    onClick={() =>
                                        setShowDocuments(false)
                                    }
                                    className="text-slate-500 hover:text-black"
                                >
                                    <X size={18} />
                                </button>

                            </div>


                            {loadingDocuments ? (

                                <p className="text-sm text-slate-500">
                                    Loading PDFs...
                                </p>

                            ) : documents.length === 0 ? (

                                <p className="text-sm text-slate-500">
                                    No PDFs uploaded yet.
                                </p>

                            ) : (

                                <div className="space-y-2">

                                    {documents.map((document) => (

                                        <button
                                            key={document.id}
                                            onClick={() =>
                                                handleSelectDocument(document)
                                            }
                                            className="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-white transition"
                                        >

                                            <FileText
                                                size={18}
                                                className="text-indigo-600 flex-shrink-0"
                                            />

                                            <span className="truncate text-sm font-medium">
                                                {document.filename}
                                            </span>

                                        </button>

                                    ))}

                                </div>

                            )}

                        </div>

                    )}


                    {/* CHAT LIST */}

                    {loadingChats ? (

                        <p className="text-slate-400 text-sm">
                            Loading chats...
                        </p>

                    ) : chats.length === 0 ? (

                        <div className="flex-1 flex flex-col items-center justify-center text-center">

                            <MessageSquare
                                size={40}
                                className="text-slate-300 mb-3"
                            />

                            <p className="text-slate-500 text-sm">
                                No conversations yet.
                            </p>

                            <p className="text-slate-400 text-xs mt-1">
                                Click + to start a chat.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-2 overflow-y-auto">

                            {chats.map((chat) => (

                                <div
                                    key={chat.id}
                                    className={`flex items-center gap-2 p-3 rounded-xl transition ${selectedChat?.id === chat.id
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "hover:bg-slate-100"
                                        }`}
                                >

                                    <button
                                        onClick={() =>
                                            handleSelectChat(chat)
                                        }
                                        className="flex-1 flex items-center gap-2 text-left min-w-0"
                                    >

                                        <FileText
                                            size={18}
                                            className="flex-shrink-0"
                                        />

                                        <span className="font-medium truncate">
                                            {chat.title}
                                        </span>

                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDeleteChat(chat.id)
                                        }
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                                        title="Delete chat"
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* MAIN CHAT */}

                <div className="flex-1 flex flex-col">

                    {/* Header */}

                    <div className="text-center mb-6">

                        <Sparkles
                            className="mx-auto text-indigo-600"
                            size={36}
                        />

                        <h1 className="text-3xl font-bold mt-2">
                            KnowledgeHub AI
                        </h1>

                        <p className="text-slate-500 mt-1">

                            {selectedChat
                                ? selectedChat.title
                                : "Select a conversation to begin"
                            }

                        </p>

                    </div>


                    {/* Messages */}

                    <div className="flex-1 overflow-y-auto px-4 space-y-6">

                        {!selectedChat && (

                            <div className="h-full flex items-center justify-center">

                                <div className="text-center">

                                    <MessageSquare
                                        size={50}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h2 className="text-xl font-semibold mt-4">
                                        Start a conversation
                                    </h2>

                                    <p className="text-slate-500 mt-2">
                                        Click + to choose a PDF and start chatting.
                                    </p>

                                </div>

                            </div>

                        )}


                        {selectedChat && messages.length === 0 && (

                            <div className="flex">

                                <div className="bg-slate-200 rounded-2xl px-5 py-4 max-w-xl">

                                    Hello 👋
                                    <br />
                                    Ask me anything about this PDF.

                                </div>

                            </div>

                        )}


                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`flex ${message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`px-5 py-4 rounded-2xl max-w-xl ${message.sender === "user"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-200 text-black"
                                        }`}
                                >

                                    {message.text}

                                </div>

                            </div>

                        ))}


                        {loading && (

                            <div className="flex">

                                <div className="bg-slate-200 rounded-2xl px-5 py-4">

                                    🤖 Thinking...

                                </div>

                            </div>

                        )}

                    </div>


                    {/* Input */}

                    <div className="mt-6">

                        <div className="bg-white rounded-2xl shadow-lg border flex items-center px-4 py-3">

                            <input
                                type="text"
                                placeholder={
                                    selectedChat
                                        ? "Ask anything about your PDF..."
                                        : "Select a chat first..."
                                }
                                value={question}
                                onChange={(e) =>
                                    setQuestion(e.target.value)
                                }
                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {
                                        handleSend();
                                    }

                                }}
                                disabled={!selectedChat || loading}
                                className="flex-1 outline-none text-lg disabled:bg-transparent disabled:cursor-not-allowed"
                            />

                            <button
                                onClick={handleSend}
                                disabled={!selectedChat || loading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl p-3 transition"
                            >

                                <Send size={20} />

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}

export default Chat;