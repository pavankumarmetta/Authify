# 🔐 Authify – Full Stack Authentication System

Authify is a full-stack authentication and authorization system built using **Spring Boot**, **React**, **JWT**, and **MySQL**.  
It provides secure user authentication with JWT tokens, email verification using OTP, and password reset functionality.  
This project demonstrates the implementation of modern authentication mechanisms used in real-world applications.

---

## 🚀 Features

### 🔑 Authentication
- User Registration
- User Login using JWT authentication
- Secure password hashing using BCrypt
- Token-based authentication

### 📧 Email Verification
- Email verification using OTP
- OTP sent through SMTP email service
- Account verification status tracking

### 🔄 Password Reset
- Forgot password functionality
- OTP-based password reset
- Secure password update

### 👤 User Profile
- Fetch authenticated user profile
- Account verification status

### 🔐 Security
- JWT based authentication
- Spring Security configuration
- Protected APIs
- Stateless session management

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React.js, Axios, React Router, Bootstrap, React Toastify |
| Backend    | Spring Boot, Spring Security, JWT, Java Mail Sender |
| Database   | MySQL                                   |
| Tools      | Git & GitHub, Postman, Maven            |

---

## 🏗️ System Architecture

```
React Frontend
      |
      | REST APIs
      ▼
Spring Boot Backend
      |
Spring Security + JWT
      |
      ▼
MySQL Database
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | `/api/v1.0/register`  | Register new user |
| POST   | `/api/v1.0/login`     | User login        |
| POST   | `/api/v1.0/logout`    | Logout            |

### Verification

| Method | Endpoint               | Description               |
|--------|------------------------|---------------------------|
| POST   | `/api/v1.0/send-otp`   | Send email verification OTP |
| POST   | `/api/v1.0/verify-otp` | Verify email OTP          |

### Password Reset

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| POST   | `/api/v1.0/send-reset-otp` | Send reset password OTP  |
| POST   | `/api/v1.0/reset-password` | Reset password           |

### Profile

| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| GET    | `/api/v1.0/profile`         | Get user profile        |
| GET    | `/api/v1.0/is-authenticated`| Check login status      |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Authify.git
```

### 2️⃣ Backend Setup

Navigate to the backend project:

```bash
cd backend
```

Configure `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/authify_app
spring.datasource.username=root
spring.datasource.password=yourpassword
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

### 3️⃣ Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

---

## 📸 Application Workflow

1. User registers an account
2. User logs in using email and password
3. JWT token is generated for authentication
4. User verifies email using OTP
5. User can reset password using OTP if forgotten

---

## 🔒 Security Features

- JWT authentication
- Password encryption using BCrypt
- Stateless authentication
- Protected API endpoints
- Email verification system
- OTP expiration mechanism

---

## 📚 What I Learned

Through this project I gained hands-on experience with:

- Implementing JWT authentication
- Securing APIs using Spring Security
- Building RESTful APIs
- Creating a full-stack application with React and Spring Boot
- Integrating email services for OTP verification
- Managing authentication state in frontend using React Context

---

> Built with ❤️ using Spring Boot & React
