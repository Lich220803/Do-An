import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages/css/Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", { email, password });

      const users = response.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(users));
      localStorage.setItem("user_id", users.id); // Lưu ID người dùng vào localStorage
      localStorage.setItem("user_email", users.email); // Lưu email người dùng vào localStorage

      if (users.role === "student") {
        navigate("/homestudent");
      } else if (users.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Lỗi đăng nhập!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center login-container">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center text-primary">Đăng Nhập</h2>
        {errorMessage && <p className="text-center text-danger">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 login-btn">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
