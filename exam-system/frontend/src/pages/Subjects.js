import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/css/Subjects.css";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(loggedInUser));
    }

    fetch("http://localhost:5001/subjects")
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
        return response.json();
      })
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (error) return <p className="alert alert-danger text-center">{error}</p>;

  return (
    <div className="container mt-5">
   

      <div className="row">
        {subjects.map((subject) => (
          <div key={subject.id} className="col-md-4 mb-4">
            <Link to={`/questions/${subject.id}`} className="text-decoration-none">
              <div className="card shadow-sm p-3 transition rounded-3">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary fw-bold">{subject.name}</h5>
                  <p className="card-text text-muted">{subject.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subjects;
