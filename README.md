# 🎓 GJIMT Placement LMS

A modern **Placement & Internship Management System** developed for **Gian Jyoti Institute of Management & Technology (GJIMT)**.

The platform helps students and placement teams manage student information, internships, placement activities, industry visits, expert talks, and other placement-related data from a centralized system.

---

## 🚀 Features

### 👨‍🎓 Student Management

* Student registration and profile management
* Student information storage
* View and manage student records
* Placement-related student data

### 💼 Internship Management

* Add internship information
* Manage internship records
* Track student internship activities

### 🏢 Placement Management

* Placement records
* Company and placement information
* Student placement tracking

### 🏭 Industry Visits

* Add and manage industry visit information
* Maintain visit records

### 🎤 Expert Talks

* Manage expert/industry talks
* Store talk-related information
* Track industry interaction activities

### 🔐 Authentication

* Firebase Authentication
* Secure user login
* User account management

### ☁️ Cloud Database

The application uses **Firebase Cloud Firestore** for storing application data.

Main collections include:

```text
students
internships
placements
visits
talks
```

---

## 🛠️ Technologies Used

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React.js        | Frontend                          |
| Vite            | Development & Build Tool          |
| JavaScript      | Application Logic                 |
| Firebase        | Authentication & Backend Services |
| Cloud Firestore | Database                          |
| CSS             | UI Styling                        |
| Git & GitHub    | Version Control                   |

---

## 📁 Project Structure

```text
GJIMT-Placement-LMS/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   └── firebase.js
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd GJIMT-Placement-LMS
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env.local` file in the project root.

Add your Firebase configuration according to the variables provided in:

```text
.env.example
```

Example:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Important:** Never upload your real Firebase credentials or `.env.local` file to GitHub.

---

## ▶️ Run the Project

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🗄️ Database

This project uses **Cloud Firestore** as its database.

The application stores placement-related information in collections such as:

```text
students
internships
placements
visits
talks
```

Firebase Authentication is used for user authentication.

---

## 🔒 Security

Sensitive configuration is kept outside the repository using environment variables.

```text
.env.local
```

should **not** be committed to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

## 🎯 Project Objective

The main objective of this project is to provide GJIMT with a centralized digital platform for managing:

* Student placement information
* Internship records
* Placement activities
* Industry visits
* Expert talks
* Student-related placement data

The system reduces manual record management and makes placement information easier to maintain and access.

---

## 🔮 Future Enhancements

Future versions can include:

* 📊 Placement analytics dashboard
* 📄 Resume upload and management
* 📧 Email notifications
* 📱 Fully responsive mobile interface
* 🔎 Advanced search and filtering
* 📈 Placement reports and charts
* 🏢 Company management module
* 📥 Export data to Excel/PDF
* 👨‍💼 Separate Admin and Student dashboards
* 🔔 Internship and placement notifications

---

## 👩‍💻 Developed For

**Gian Jyoti Institute of Management & Technology (GJIMT)**

### Academic Project

**Project:** GJIMT Placement LMS
**Purpose:** Placement & Internship Management
**Database:** Firebase Cloud Firestore
**Authentication:** Firebase Authentication

---

## 📜 License

This project is developed for academic and educational purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
