import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate từ react-router-dom

function HomeStudent() {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const userId = JSON.parse(localStorage.getItem("user"))?.id; // Lấy ID người dùng từ localStorage

  const handleGoToSubjects = () => {
    if (userId) {
      navigate(`/subjects/${userId}`); // Chuyển đến trang subjects với ID người dùng
    }
  };

  return (
    <div>
      <h1>Trang Học Sinh</h1>

      {/* Hai ô chọn: Ôn luyện và Thi */}
      <div className="row mt-5">
        <div className="col-6">
          <button className="btn btn-primary w-100" style={{ height: '200px' }}>
            Ôn Luyện
          </button>
        </div>
        <div className="col-6">
          <button
            className="btn btn-success w-100"
            style={{ height: '200px' }}
            onClick={handleGoToSubjects} // Khi bấm vào sẽ chuyển đến subjects.js với ID trong URL
          >
            Thi
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeStudent;
