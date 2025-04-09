import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import './App.css'
import Header from "./components/Header";
import Register from "./pages/Register";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import AdminApplications from "./pages/AdminApplications";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Navigate to="/register" replace />} /> {/* redirect "/" to "/register" automatically */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/admin/applications" element={<AdminApplications />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
