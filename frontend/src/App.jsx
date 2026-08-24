import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import PDFViewer from "./pages/PDFViewer";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      {/* Authentication */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Main Pages */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/documents"
        element={<Documents />}
      />

      <Route
        path="/chat"
        element={<Chat />}
      />

      {/* PDF Viewer */}
      <Route
        path="/pdf/:documentId"
        element={<PDFViewer />}
      />

      {/* 404 - Keep this LAST */}
      <Route
        path="*"
        element={<NotFound />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />
    </Routes>
  );
}

export default App;