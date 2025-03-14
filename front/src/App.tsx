import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import './App.css'
import Header from "./components/Header";
import Register from "./pages/Register";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/register" replace />} /> {/* redirect "/" to "/register" automatically */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
