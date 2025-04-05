import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/css/Home.css"; // Import file CSS tùy chỉnh

function Home() {
  return (
    <div className="container text-center mt-5">
      <div className="card shadow-lg p-5 bg-custom">
        <h1 className="text-main display-4">Trang Chủ</h1>
        <p className="text-subtle lead">Chào mừng bạn đến với hệ thống thi trắc nghiệm!</p>
        <hr className="my-4" />
        <p className="text-muted">Nền tảng thi trắc nghiệm trực tuyến với hàng ngàn đề thi đa dạng. Hãy đăng ký ngay để trải nghiệm!</p>
      </div>
    </div>
  );
}

export default Home;
