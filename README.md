# MediCollab - Healthcare Collaboration Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🏥 Overview

MediCollab is a comprehensive healthcare collaboration platform designed to streamline communication and data management between doctors, patients, and hospitals. The platform facilitates secure medical record sharing, appointment scheduling, and collaborative healthcare delivery.

### Key Objectives
- Enable seamless communication between healthcare providers and patients
- Secure storage and sharing of medical records
- Efficient appointment and request management
- Role-based access control for data security
- Real-time collaboration features

## ✨ Features

### For Patients
- 🔐 Secure patient registration and authentication
- 📱 Personal health dashboard
- 📄 Upload and manage medical documents
- 🏥 Request appointments with doctors/hospitals
- 📊 View medical history and reports
- 💬 Communication with healthcare providers
- 🔔 Notification system for updates

### For Doctors
- 👨‍⚕️ Professional profile management
- 📋 Patient request management
- 📂 Access to patient medical records (with permission)
- 📝 Upload prescriptions and reports
- 📅 Appointment scheduling
- 🔍 Patient search and filtering
- 📊 Dashboard with analytics

### For Hospitals
- 🏥 Hospital profile and department management
- 👥 Staff management system
- 📊 Patient admission tracking
- 📈 Analytics and reporting
- 🗂️ Medical records management
- 🔄 Integration with doctor profiles
- 📋 Request and appointment handling

### For Admins
- ⚙️ System-wide configuration
- 👤 User management (doctors, patients, hospitals)
- 📊 Analytics and monitoring
- 🔒 Security and access control
- 📧 System notifications management

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Validation**: express-validator
- **API Documentation**: Swagger/OpenAPI (optional)

### Frontend (if applicable)
- React.js / Vue.js / Angular
- State Management: Redux / Vuex
- UI Framework: Material-UI / Bootstrap / Tailwind CSS

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Environment Management**: dotenv
- **API Testing**: Postman / Thunder Client
- **Database GUI**: MongoDB Compass
- **Process Manager**: PM2 (production)

## 🏗️ System Architecture

```
┌─────────────────┐
│   Client Side   │
│  (Web/Mobile)   │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   API Gateway   │
│   (Express.js)  │
└────────┬────────┘
         │
         ├──────────┬──────────┬──────────┐
         │          │          │          │
    ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
    │ Auth   │ │Patient │ │Doctor  │ │Hospital│
    │Service │ │Service │ │Service │ │Service │
    └────┬───┘ └───┬────┘ └───┬────┘ └───┬────┘
         │         │          │          │
         └─────────┴──────────┴──────────┘
                   │
              ┌────▼─────┐
              │ MongoDB  │
              │ Database │
              └──────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** (v6.x or higher) or **yarn** (v1.22.x or higher)
- **MongoDB** (v4.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** - VS Code recommended

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/medicollabprefinale.git
cd medicollabprefinale
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend (if separate)
```bash
cd frontend
npm install
```

### 3. Install MongoDB

**Windows:**
- Download MongoDB Community Server
- Install and run MongoDB as a service
- Default connection: `mongodb://localhost:27017`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/medicollab
DB_NAME=medicollab

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# File Upload
MAX_FILE_SIZE=10485760
FILE_UPLOAD_PATH=./uploads

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@medicollab.com
ADMIN_PASSWORD=Admin@123
```

### 2. Database Seeding

Seed initial admin user:

```bash
npm run seed
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

### Production Mode

```bash
# Backend
npm run start

# Or with PM2
pm2 start server.js --name medicollab-api
```

### Concurrent Development (Backend + Frontend)

```bash
npm run dev:all
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "patient"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Patient Endpoints

#### Get Patient Profile
```http
GET /api/patients/:id
Authorization: Bearer <token>
```

#### Update Patient Profile
```http
PUT /api/patients/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "1234567890",
  "address": "123 Main St",
  "bloodGroup": "O+",
  "dateOfBirth": "1990-01-01"
}
```

#### Upload Medical Document
```http
POST /api/patients/:id/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
documentType: "lab_report"
description: "Blood test results"
```

### Doctor Endpoints

#### Get All Doctors
```http
GET /api/doctors
Query Parameters:
  - specialization: string
  - location: string
  - page: number
  - limit: number
```

#### Create Doctor Request
```http
POST /api/doctors/:id/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Need consultation",
  "urgency": "high",
  "appointmentDate": "2025-12-10T10:00:00Z"
}
```

### Hospital Endpoints

#### Get Hospital Details
```http
GET /api/hospitals/:id
```

#### Create Hospital Request
```http
POST /api/hospitals/:id/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "department": "Cardiology",
  "message": "Need emergency consultation",
  "urgency": "high"
}
```

### Request Management

#### Get User Requests
```http
GET /api/requests
Authorization: Bearer <token>
Query Parameters:
  - status: pending|accepted|rejected
  - type: doctor|hospital
```

#### Update Request Status
```http
PUT /api/requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "response": "Appointment confirmed"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['patient', 'doctor', 'hospital', 'admin'],
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model
```javascript
{
  user: ObjectId (ref: User),
  phone: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  documents: [{
    fileName: String,
    fileUrl: String,
    documentType: String,
    uploadDate: Date
  }]
}
```

### Doctor Model
```javascript
{
  user: ObjectId (ref: User),
  specialization: String,
  qualification: String,
  experience: Number,
  licenseNumber: String,
  phone: String,
  consultationFee: Number,
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  hospital: ObjectId (ref: Hospital),
  rating: Number,
  reviews: [{
    patient: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }]
}
```

### Hospital Model
```javascript
{
  user: ObjectId (ref: User),
  hospitalName: String,
  registrationNumber: String,
  phone: String,
  address: String,
  departments: [String],
  facilities: [String],
  emergencyServices: Boolean,
  operatingHours: {
    start: String,
    end: String
  },
  doctors: [ObjectId (ref: Doctor)]
}
```

### Request Model
```javascript
{
  patient: ObjectId (ref: Patient),
  doctor: ObjectId (ref: Doctor),
  hospital: ObjectId (ref: Hospital),
  type: ['doctor', 'hospital'],
  message: String,
  urgency: ['low', 'medium', 'high'],
  status: ['pending', 'accepted', 'rejected', 'completed'],
  appointmentDate: Date,
  response: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 👥 User Roles

### Admin
- Full system access
- User management
- System configuration
- Analytics and reporting

### Doctor
- Profile management
- Patient request handling
- Medical records access (authorized)
- Prescription management

### Patient
- Personal health records
- Appointment requests
- Document upload
- Communication with providers

### Hospital
- Hospital profile management
- Staff management
- Department management
- Patient admission tracking

## 📁 Project Structure

```
medicollabprefinale/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── hospitalController.js
│   │   └── requestController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Hospital.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── hospitals.js
│   │   └── requests.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── uploads/
│   ├── seeds/
│   │   └── adminSeed.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Specific Module
```bash
npm test -- controllers/authController.test.js
```

## 🚀 Deployment

### Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku
```bash
heroku login
```

3. Create Heroku App
```bash
heroku create medicollab-app
```

4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
```

5. Deploy
```bash
git push heroku main
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t medicollab .
docker run -p 5000:5000 medicollab
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint configuration
- Follow Airbnb JavaScript Style Guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ankit Upadhyay**
- Email: ankitupadhyayx@gmail.com
- GitHub: [@ankitupadhyay](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern healthcare needs
- Built with ❤️ for better healthcare collaboration

## 📞 Support

For support, email ankitupadhyayx@gmail.com or create an issue in the repository.

---

**Last Updated**: December 3, 2025
**Version**: 1.0.0


hos prof work
git reset --hard 0f58f391ffbdc4545f8336d4c115e623475e4e35

patient and hospital done
git reset --hard d24fb5167a09c30af31a0059087ec87bf9251930