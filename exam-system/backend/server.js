const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const { translateText } = require('./translate'); 

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend kết nối
app.use(bodyParser.json());  
const SECRET_KEY = "my_secret_key"; // Khóa bí mật để ký JWT

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Thay bằng mật khẩu MySQL của bạn
    database: 'quiz_database'
});

// Kiểm tra kết nối MySQL
db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        process.exit(1); // Thoát nếu không kết nối được
    } else {
        console.log('Kết nối MySQL thành công!');
    }
});
  
  app.get('/student/:categoryId', (req, res) => {
    const { categoryId } = req.params;
  
    // Lọc câu hỏi theo categoryId
    const subjectQuestions = questions.filter(q => q.categoryId == categoryId);
  
    // Random các câu hỏi (ví dụ: lấy 10 câu hỏi ngẫu nhiên)
    const randomQuestions = subjectQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
  
    res.json(randomQuestions);
  });
  

app.post('/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;
  
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Thiếu thông tin văn bản hoặc ngôn ngữ đích' });
    }
  
    try {
      const translatedText = await translateText(text, targetLanguage);
      res.json({ translatedText });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Route test server
app.get('/', (req, res) => {
    res.send('Backend hệ thống thi trắc nghiệm đang chạy!');
});

// API ĐĂNG KÝ


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Xác định role
    let role = email.endsWith("@teacher.com") ? "teacher" : "student";

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu

        db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) {
                    console.error("Lỗi database:", err);
                    return res.status(500).json({ error: "Lỗi server khi đăng ký" });
                }
                res.json({ message: "Đăng ký thành công!", userId: result.insertId });
            }
        );
    } catch (error) {
        console.error("Lỗi mã hóa mật khẩu:", error);
        res.status(500).json({ error: "Lỗi khi xử lý mật khẩu!" });
    }
});

// API ĐĂNG NHẬP
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            console.error("Lỗi database:", err);
            return res.status(500).json({ error: "Lỗi server" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Email không tồn tại!" });
        }

        const users = results[0];

        try {
            if (!users.password.startsWith("$2b$")) {
                return res.status(500).json({ error: "Mật khẩu trong CSDL chưa được mã hóa!" });
            }

            const match = await bcrypt.compare(password, users.password);
            if (!match) {
                return res.status(401).json({ error: "Sai mật khẩu!" });
            }

            // 🛠 Lưu user_id vào token JWT
            const token = jwt.sign({ user_id: users.id }, SECRET_KEY, { expiresIn: "1h" });


            // Xác định trang cần chuyển hướng
            let redirectPage = "";
            if (email.endsWith("@student.com")) {
                redirectPage = "/homeStudent";
            } else if (email.endsWith("@teacher.com")) {
                redirectPage = "/homeTeacher";
            }

            res.json({
                message: "Đăng nhập thành công!",
                user: {
                    id: users.id,
                    email: users.email,  // Gửi email về frontend
                    role: users.role
                },
                token
            });
        } catch (bcryptError) {
            console.error("Lỗi bcrypt:", bcryptError);
            res.status(500).json({ error: "Lỗi xử lý mật khẩu!" });
        }
    });
});


app.post('/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Thiếu thông tin văn bản hoặc ngôn ngữ đích' });
    }

    try {
        // Dịch tất cả các văn bản trong mảng
        const translatedText = await Promise.all(text.map(t => translateText(t, targetLanguage)));
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// API lấy danh sách người dùng
app.get("/users", (req, res) => {
    db.query("SELECT id, name, email, role FROM users", (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn users:", err);
            return res.status(500).json({ error: "Lỗi truy vấn database" });
        }
        res.json(result);
    });
});

// API lấy danh sách đề thi
app.get("/exams", (req, res) => {
    db.query("SELECT * FROM exams", (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn exams:", err);
            return res.status(500).json({ error: "Lỗi truy vấn database" });
        }
        res.json(result);
    });
});
app.get("/subjects", (req, res) => {
    db.query("SELECT id, name FROM subjects", (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn subjects:", err);
            return res.status(500).json({ error: "Lỗi truy vấn database" });
        }
        res.json(result);
    });
});
app.get("/questions", (req, res) => {
    const category = req.query.category; // Lấy category từ query params
  
    if (!category) {
      return res.status(400).json({ error: "Thiếu category" });
    }
  
    const sql = "SELECT * FROM questions WHERE category = ?";
    db.query(sql, [category], (err, result) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }
      res.json(result);
    });
  });
  // API nhận điểm từ frontend và lưu vào database
app.post("/submit-score", (req, res) => {
  const { user_id, category_id, score } = req.body;
  
  const sql = "INSERT INTO scores (user_id, category_id, score) VALUES (?, ?, ?)";
  db.query(sql, [user_id, category_id, score], (err, result) => {
    if (err) {
      console.error("Lỗi lưu điểm:", err);
      return res.status(500).json({ message: "Lỗi khi lưu điểm!" });
    }
    res.status(200).json({ message: "Lưu điểm thành công!", result });
  });
});


// Lắng nghe trên PORT
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
