# MediCore — Hospital Admin Analytics Dashboard

A full-stack hospital intelligence platform with a Next.js frontend and Express backend.

---

## Project Structure

```
HOSPITAL-ADMIN-ANALYTICS-DASHBOARD/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── doctorController.js    # Doctor CRUD + auth + schedule endpoints
│   │   │   └── patientController.js   # Patient, dept, bed, ambulance endpoints
│   │   ├── dal/
│   │   │   ├── doctorDal.js           # Data access layer for doctors
│   │   │   └── patientDal.js          # Data access layer for patients & resources
│   │   ├── models/
│   │   │   ├── doctorDataModel.js     # DOCS[], DOCTOR_SCHEDULE, generateCalendarData
│   │   │   └── patientDataModel.js    # PATIENTS[], DEPTS[], BEDS[], AMBULANCES[]
│   │   └── routes/
│   │       └── index.js               # All REST routes mounted under /api
│   ├── .gitignore
│   ├── main.js                        # Express entry point (port 4000)
│   └── package.json
│
└── frontend/
    └── src/app/
        ├── components/
        │   └── StatsCards.js          # Pill, Counter, Radial, ChartTip, Card, Navbar
        ├── dashboard/
        │   └── page.jsx               # KPIs, charts, workload, AI insights
        ├── heatmap/
        │   └── page.jsx               # NYC SVG patient heatmap
        ├── patients/
        │   └── page.jsx               # Full sortable/filterable patient table
        ├── lib/
        │   ├── api.js                 # All fetch() calls to backend (single source of truth)
        │   └── theme.js               # T = {light, dark} + pct/sevPill/statPill utils
        ├── globals.css
        ├── layout.js                  # Next.js root layout with font injection
        └── page.jsx                   # App shell: routing, auth, theme toggle
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Admin or doctor login |
| GET | `/api/doctors` | List all doctors |
| POST | `/api/doctors` | Add a doctor |
| GET | `/api/doctors/:id` | Get doctor by ID |
| PUT | `/api/doctors/:id` | Update doctor |
| PATCH | `/api/doctors/:id/resolve-overbooking` | Clear overbooked slots |
| GET | `/api/doctors/:name/schedule` | Get daily schedule |
| GET | `/api/doctors/:name/calendar` | Get 30-day appointment calendar |
| GET | `/api/patients` | List patients (search/filter/sort via query params) |
| GET | `/api/patients/by-doctor/:name` | Patients for a specific doctor |
| PATCH | `/api/patients/:id/status` | Update patient status |
| GET | `/api/departments` | List all departments |
| PUT | `/api/departments/:id` | Update department |
| GET | `/api/beds` | List all bed types |
| PUT | `/api/beds/:id` | Update bed record |
| GET | `/api/ambulances` | List drivers + zones |
| PUT | `/api/ambulances/:id` | Update ambulance unit |

---

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev       # nodemon on port 4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Next.js on port 3000
```

### Default Credentials
- **Admin:** `admin@medicore.io` / `admin123`
- **Any Doctor:** password is `doc123`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18 |
| Styling | Inline styles with cinematic theme system |
| Charts | Recharts |
| Backend | Express 4, Node.js |
| Data | In-memory (no DB required) |
