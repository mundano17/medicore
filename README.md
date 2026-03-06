# MediCore – Hospital Admin Analytics Dashboard

MediCore is a **hospital administration analytics dashboard** designed to help healthcare administrators monitor hospital operations, analyze patient and doctor data, and visualize insights through an interactive dashboard.

The platform provides tools for **patient management, doctor information access, analytics dashboards, and heatmap visualizations** to support better decision-making in healthcare management.

---

## 🚀 Features

* **Admin Dashboard**

  * Overview of hospital data
  * Key statistics and analytics
  * Visual charts for better insights

* **Doctor Management**

  * View doctor profiles
  * Access doctor-related data
  * Doctor selection component

* **Patient Management**

  * View patient records
  * Patient data analytics

* **Heatmap Visualization**

  * Data visualization for hospital analytics
  * Identify patterns in healthcare data

* **Interactive Charts**

  * Built using **Recharts**
  * Dynamic statistics cards

* **Full Stack Architecture**

  * Frontend: Next.js + React
  * Backend: Express.js API

---

## 🏗️ Project Architecture

```
medicore
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── dal
│   │   └── routes
│   ├── main.js
│   └── package.json
│
├── frontend
│   ├── src/app
│   │   ├── admin
│   │   ├── dashboard
│   │   ├── doctor
│   │   ├── patients
│   │   ├── heatmap
│   │   └── components
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 14**
* **React 18**
* **Recharts** (data visualization)
* **CSS**

### Backend

* **Node.js**
* **Express.js**
* **CORS**

### Development Tools

* Nodemon
* ESLint

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mundano/medicore.git
cd medicore
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Run the backend server:

```bash
npm run dev
```

Server will start on:

```
http://localhost:4000
```

---

### 3️⃣ Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## 📊 Pages in the Application

| Page         | Description                  |
| ------------ | ---------------------------- |
| `/dashboard` | Main analytics dashboard     |
| `/admin`     | Administrative control panel |
| `/doctor`    | Doctor profiles and data     |
| `/patients`  | Patient data management      |
| `/heatmap`   | Data heatmap visualization   |

---

## 📡 API Structure

The backend follows a **layered architecture**:

* **Routes** → API endpoints
* **Controllers** → Request handling logic
* **DAL (Data Access Layer)** → Database interaction
* **Models** → Data structure definitions

Example endpoints:

```
GET /patients
GET /doctors
POST /patients
POST /doctors
```

---

## 🎯 Future Improvements

* Authentication and role-based access
* Real-time hospital analytics
* Integration with hospital databases
* Advanced predictive healthcare analytics
* Deployment with Docker & cloud services
