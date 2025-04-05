import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Questions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5001/questions?category=${id}&user_id=${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi khi tải câu hỏi");
        return response.json();
      })
      .then((data) => setQuestions(shuffleArray(data)))
      .catch((err) => console.error("Lỗi:", err));
  }, [id, userId, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleSelect = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });

    const totalScore = (correctCount / 25) * 10;
    setScore(totalScore.toFixed(2));
    setSubmitted(true);

    fetch("http://localhost:5001/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        category_id: id,
        score: totalScore,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Lưu điểm thành công!", data);
        setMessage("✅ Điểm số đã được lưu vào hệ thống!");
      })
      .catch((err) => {
        console.error("Lỗi khi lưu điểm:", err);
        setMessage("❌ Lỗi khi lưu điểm, vui lòng thử lại sau.");
      });
  };

  return (
    <div className="container">
      <h1 className="text-center my-4 text-primary">BÀI TRẮC NGHIỆM</h1>

      {!submitted && (
        <div className="text-center mb-3">
          <h3 className="text-danger">
            ⏳ {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
          </h3>
        </div>
      )}

      <div className="list-group">
        {questions.map((question, index) => (
          <div key={question.id} className="list-group-item">
            <p className="fw-bold">
              Câu {index + 1}: {question.question}
            </p>
            {Object.entries(question.options).map(([key, value]) => (
              <div key={key} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${question.id}`}
                  id={`q${question.id}-${key}`}
                  value={key}
                  disabled={submitted}
                  onChange={() => handleSelect(question.id, key)}
                />
                <label className="form-check-label" htmlFor={`q${question.id}-${key}`}>
                  {key}: {value}
                </label>
              </div>
            ))}
            {submitted && (
              <p
                className={`fw-bold ${
                  answers[question.id] === question.correct_answer
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                Đáp án đúng: {question.correct_answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4" onClick={handleSubmit}>
            Nộp Bài
          </button>
        </div>
      )}

      {submitted && (
        <div className="text-center mt-4">
          <h2 className="text-primary">
            🎯 Điểm của bạn: <span className="text-success">{score}/10</span>
          </h2>
          <p>{message}</p>

          {/* Nút Quay về */}
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/subjects")}>
            ⬅️ Quay về
          </button>
        </div>
      )}
    </div>
  );
}

export default Questions;
