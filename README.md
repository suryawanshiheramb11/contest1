# 🚀 Coding Assessment Platform

A robust, full-stack coding assessment platform built with **Spring Boot** and **React**. Designed for conducting coding contests, technical interviews, and practice sessions with real-time code evaluation powered by AI.

---

## ✨ Features

### 👨‍💻 For Students
- **Interactive Code Editor:** Syntax highlighting and auto-completion.
- **Real-time Evaluation:** Instant feedback on code correctness and efficiency.
- **AI-Powered Hints:** Get subtle hints without giving away the solution (powered by Gemini AI).
- **Time-Released Questions:** Questions become available at scheduled times.
- **Test Case Validation:** Run your code against multiple test cases.

### 🛡️ For Admins
- **Dashboard:** Manage questions and view system status.
- **CRUD Operations:** Create, Read, Update, and Delete coding problems.
- **Secure Access:** Role-based authentication (Admin/Student).

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Java, Spring Boot, Spring Security, JPA, H2 Database |
| **Frontend** | React, Vite, Tailwind CSS, Monaco Editor |
| **AI Integration** | Google Gemini API |
| **Deployment** | Render (Backend), Vercel/Render (Frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven

### 🔧 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`.

### 🎨 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `frontend` directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 🔑 Default Credentials

The system comes seeded with a default admin user:
- **Username:** `heramb`
- **Password:** `123456`

> ⚠️ **Note:** Change these credentials in production!

---

## 🌐 Deployment

### Backend (Render)
- **Repo:** Connect your GitHub repo to Render.
- **Type:** Web Service.
- **Runtime:** Docker (Dockerfile provided).
- **Environment Variables:** None required for H2 (file-based).

### Frontend (Vercel/Render)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_GEMINI_API_KEY`: Your AI API key.
  - `VITE_API_BASE_URL`: (Optional) URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
