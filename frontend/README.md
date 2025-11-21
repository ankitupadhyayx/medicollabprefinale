# MediCollab – Transparent Medical Collaboration Platform

**MediCollab** is a modern, role-based healthcare application designed to bridge the gap between Patients, Hospitals, and Administrators. It focuses on transparency, security, and AI-enhanced insights for medical records.

![MediCollab Banner](https://via.placeholder.com/1200x400/2563EB/ffffff?text=MediCollab+Healthcare+Platform)

---

## 🖥️ VS Code Setup & Installation

If you are running this project in **Visual Studio Code**, follow these steps to get started immediately.

### 1. Prerequisites
*   **Node.js**: Download and install the LTS version from [nodejs.org](https://nodejs.org/).
*   **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).

### 2. Recommended VS Code Extensions
Install these extensions for the best development experience:
*   **Tailwind CSS IntelliSense**: For class name autocompletion.
*   **Prettier - Code formatter**: To format your code automatically.
*   **ES7+ React/Redux/React-Native snippets**: For quick React boilerplate.
*   **Auto Import**: Automatically finds, parses, and provides code actions and code completion for all available imports.

### 3. Installation Steps
Open your terminal in VS Code (`Ctrl + \``) and run:

1.  **Install Dependencies**
    ```bash
    npm install
    ```
    *This downloads all the libraries listed in `package.json` (React, Tailwind, Lucide icons, etc.) into a `node_modules` folder.*

2.  **Start the Frontend Server**
    ```bash
    npm run dev
    ```
    *This starts the Vite development server usually at `http://localhost:5173`.*

3.  **Open in Browser**
    Ctrl+Click the link shown in the terminal to open the app.

---

## 🚀 Features Overview

### 👤 Patient Portal
*   **Health Timeline**: A secure, feed-style locker for all approved medical records (Prescriptions, Labs, Imaging).
*   **Approvals System**: Patients must explicitly approve or reject records uploaded by hospitals.
*   **AI Insights**: Generative AI analysis of health trends and risk assessments.
*   **Appointment Booking**: Schedule visits with registered hospitals.

### 🏥 Hospital / Doctor Portal
*   **Secure Uploads**: Encrypted document upload workflow.
*   **Patient Directory**: Manage active patients and statuses.
*   **Billing & Invoices**: Track revenue and pending payments.

### 🛡️ Admin Portal
*   **Hospital Registry**: Verify/Suspend hospital registrations.
*   **Dispute Resolution**: Review flagged records using AI suggestions.
*   **System Analytics**: Monitor platform growth.
*   **Audit Trail**: Immutable security logs.

---

## 🛣️ Backend Development Roadmap

Currently, the project is **Frontend Only** (using mock data). To make it a full-stack application using VS Code, follow this roadmap.

### Phase 1: Server Setup (Node.js + Express)
1.  Create a `backend` folder outside the current `src` folder.
2.  Initialize project: `npm init -y`.
3.  Install core packages:
    ```bash
    npm install express cors dotenv mongoose nodemon
    ```
4.  Create `server.js`: Set up a basic Express server running on port 5000.

### Phase 2: Database (MongoDB)
1.  Create a free account on **MongoDB Atlas**.
2.  Connect your Node.js app to MongoDB using `mongoose.connect()`.
3.  **Define Schemas**:
    *   `UserSchema` (Name, Email, Password, Role)
    *   `RecordSchema` (PatientID, HospitalID, FileURL, Status)
    *   `AppointmentSchema` (Date, Time, Reason, Status)

### Phase 3: Authentication (JWT)
1.  Install packages: `npm install jsonwebtoken bcryptjs`.
2.  Create `authController.js`:
    *   **Register**: Hash password with bcrypt, save user.
    *   **Login**: Validate password, generate JWT token.
3.  Create `authMiddleware.js` to protect routes (verify token).

### Phase 4: API Development
1.  **Patient APIs**:
    *   `GET /api/patients/:id/records` (Fetch timeline)
    *   `PUT /api/records/:id/approve` (Approve record)
2.  **Hospital APIs**:
    *   `POST /api/upload` (Upload record metadata)
    *   `GET /api/patients` (Search patients)
3.  **Admin APIs**:
    *   `GET /api/admin/stats` (Dashboard data)

### Phase 5: File Storage & AI
1.  **File Storage**: Use **Multer** + **Cloudinary** (or AWS S3) to handle PDF/Image uploads.
2.  **AI Integration**: Move the Google Gemini API calls from the frontend (`src/services/geminiService.ts`) to the backend to hide your API Key.

---

## 📂 Project Folder Structure (Frontend)

```
src/
├── api/                 # (Future) Axios instances for Backend API
├── assets/              # Images and static files
├── components/          # Reusable UI components
│   ├── ui/              # Small components (Buttons, Inputs)
│   └── Layout.tsx       # Main layout wrapper (Sidebar/Navbar)
├── context/             # AuthContext (manages User Login state)
├── pages/               # All Application Screens
│   ├── admin/           # Admin Dashboards
│   ├── hospital/        # Hospital Dashboards
│   ├── patient/         # Patient Dashboards
│   ├── Landing.tsx      # Home Page
│   └── Login.tsx        # Auth Page
├── services/            # Google Gemini AI Service
├── types.ts             # TypeScript Interfaces
├── constants.ts         # Mock Data (Replace this with API calls later)
└── App.tsx              # Routing & Main Entry
```

## 🔐 Authentication (Mock Mode)

The app currently uses a simulated login system for demonstration.
*   **Patient**: Select "Patient" on login (Default: `patient@example.com`)
*   **Hospital**: Select "Hospital" (Default: `admin@hospital.com`)
*   **Admin**: Select "Admin" (Default: `admin@medicollab.com`)
*   **Password**: Any string (e.g., `123456`) works.

## 🎨 UI Theme

*   **Primary Blue**: `#2563EB`
*   **Medical Purple**: `#6366F1`
*   **AI Accent**: `#A78BFA`

---

© 2025 MediCollab. Built with ❤️ for better healthcare.
