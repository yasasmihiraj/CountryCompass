
### 📖 **README.md – Country Details App-Country Compass**
```md
# 🌍 Country Details App

## ✨ Overview

The **Country Details App** is a full-stack web application that provides detailed information about different countries. Users must log in to access country-specific data, ensuring **secure access and authentication**. 

This application is designed for those who want to explore **geographical, political, and cultural details** about countries in an interactive way. Built using modern technologies like **React, Tailwind CSS, Node.js, and Express**, it delivers a **smooth and dynamic experience**.

---

## 🔥 Features

- 🔐 **User Authentication** – Secure login and registration process.
- 🌎 **Detailed Country Data** – Population, region, languages, capital, and flags.
- 🎨 **Modern UI** – Clean and visually appealing interface with Tailwind CSS.
- ⚡ **Fast Performance** – Optimized API calls and efficient state management.
- 🚀 **Responsive Design** – Works seamlessly across all devices.

---

## 🛠️ Tech Stack

| Layer      | Technologies                        |
|------------|------------------------------------|
| **Frontend** | React, Tailwind CSS, React Router |
| **Backend**  | Node.js, Express.js, MongoDB      |
| **Authentication** | JSON Web Tokens (JWT)         |
| **API**      | RESTful API for country data      |
| **Hosting**  |Render (Frontend), Render (Backend) |

---

## 📡 API Endpoints

Your backend provides RESTful API endpoints for managing authentication and country details.

| Method | Route                | Description                |
|--------|----------------------|----------------------------|
| POST   | `/api/auth/login`    | User login                 |
| POST   | `/api/auth/register` | User registration          |
| POST   | `/api/auth/logout`   | User logout                |
| GET    | `/api/countries/:code` | Get country details by code |

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**
```sh
git clone (https://github.com/yasasmihiraj/CountryCompass.git)
cd country-details-app
```

### **2️⃣ Backend Setup (Node.js & Express)**
```sh
cd backend
npm install
```
- Create a `.env` file and add:
  ```env
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_secret_key
  PORT=5000
  ```
- Start the backend server:
  ```sh
  npm run dev
  ```
- Your backend will be running at `http://localhost:5000`.

### **3️⃣ Frontend Setup (React & Tailwind)**
```sh
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` to view the app in your browser.

---

## 🌍 Deployment Guide

### ✅ **Frontend Deployment on Render**
Netlify is an easy-to-use service for hosting static frontend applications.

1. **Push your frontend code to GitHub**.
2. **Create an account** at [Render](https://countrycompass-frontend.onrender.com/)) and connect your GitHub repository.
3. **Set deployment settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build/`
4. **Click “Deploy”** and Netlify will host your frontend.

Your frontend will be accessible at:
```sh
(https://countrycompass-frontend.onrender.com/)
```

---

### ✅ **Backend Deployment on Render**
Render is a simple way to host Node.js applications with a free plan.

1. **Push your backend code to GitHub**.
2. **Create an account** at [Render](https://render.com/) and set up a new **Web Service**.
3. **Connect your repository** and select **Node.js environment**.
4. **Set build settings**:
   ```sh
   npm install
   npm start
   ```
5. **Render will generate a live backend URL**, such as:
   ```sh
   (https://countrycompass-backend.onrender.com)
   ```

---

## 🔗 Connecting Frontend & Backend

Once deployed, update **API URLs** in your frontend:

```js
const API_BASE_URL = "(https://countrycompass-backend.onrender.com)";
```

Modify the backend to allow cross-origin requests:

```ts
import cors from "cors";
app.use(cors());
```

Test authentication and API calls to ensure everything works correctly.

---

## 🎨 UI & Styling

The frontend is designed using **Tailwind CSS**, ensuring **responsive and modern design**.

Example component styling:
```tsx
<div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-4 shadow-lg rounded">
  Welcome to Country Details App!
</div>
```

---

## 📝 Contribution Guidelines

Want to improve this app? Feel free to contribute! Follow these steps:

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your changes.
3. **Make improvements**, then commit changes:
   ```sh
   git add .
   git commit -m "Added new feature"
   git push origin your-branch-name
   ```
4. **Create a Pull Request (PR)** and submit for review.

---

## 📜 License

This project is **MIT Licensed**, meaning you're free to **modify and distribute** it.

---

## 📩 Contact

For questions or improvements:
- GitHub: [yasasmihiraj](https://github.com/yasasmihiraj)
- Email: **mihirajyasas@gmail.com**

---

