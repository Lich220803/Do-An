import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Teacher from "./pages/Teacher";
import Navbar from "./components/Navbar";  // Navbar hiển thị email và đăng xuất
import Subjects from './pages/Subjects';  // Trang chọn môn học
import Questions from "./pages/Questions";
import HomeStudent from "./pages/HomeStudent";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar được đặt ở đây để luôn hiển thị */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/teacher" element={<Teacher />} /> {/* Trang giáo viên */}
          <Route path="/homestudent" element={<HomeStudent />} /> {/* Trang giáo viên */}
          
          <Route path="/subjects/:id" element={<Subjects />} /> {/* Lấy userId từ URL */}
        {/* Trang học sinh */}
          <Route path="/questions/:id" element={<Questions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
