import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";
import TopicPage from "./pages/Topic";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DataPortal from "./pages/DataPortal";
import DatasetDetail from "./pages/DatasetDetail";
import "./globals.css"; // Ensure global styles are imported

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/data-portal" element={<DataPortal />} />
        <Route path="/dataset/:id" element={<DatasetDetail />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>
    </Router>
  );
} 