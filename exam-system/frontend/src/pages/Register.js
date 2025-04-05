// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/css/Register.css"; // Import file CSS tùy chỉnh

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");  // Thông báo thành công
  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng ký

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Xóa thông báo cũ
    setSuccessMessage(""); // Xóa thông báo thành công trước khi gửi yêu cầu mới

    // Xác định role theo email
    let role = "";
    if (email.endsWith("@student.com")) {
      role = "student";
    } else if (email.endsWith("@teacher.com")) {
      role = "teacher";
    } else {
      setMessage("Email phải có đuôi @student.com hoặc @teacher.com!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/register", {
        name,
        email,
        password,
        role,
      });

      // Hiển thị thông báo thành công
      setSuccessMessage("Đăng ký thành công! Bạn sẽ được chuyển hướng trong giây lát.");

      // Chuyển hướng về trang chủ sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Lỗi đăng ký!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center register-container">
      <div className="card p-4 shadow-lg register-card">
        <h2 className="text-center text-primary">Đăng Ký</h2>

        {/* Hiển thị thông báo thành công nếu có */}
        {successMessage && <p className="text-center text-success">{successMessage}</p>}

        {/* Hiển thị thông báo lỗi nếu có */}
        {message && <p className="text-center text-danger">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ và Tên</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 register-btn">
            Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
