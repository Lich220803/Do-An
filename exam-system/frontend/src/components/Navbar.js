import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Điều hướng về trang đăng nhập sau khi đăng xuất
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">THI TRẮC NGHIỆM</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto"> {/* "ms-auto" để căn phải */}
            {user ? ( // Kiểm tra xem có người dùng đăng nhập hay không
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Xin chào, {user.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Đăng Xuất</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Đăng Nhập</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Đăng Ký</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
