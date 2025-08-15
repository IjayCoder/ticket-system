---
## 🎯 Ticket Management System – Backend

### 📌 Overview

This is the backend API for the **Ticket Management System**, built with **Node.js, Express, Prisma, and TypeScript**.
It handles authentication, ticket CRUD operations, role-based access control, notifications, and various security measures.
---

### 🚀 Features

- **User Authentication** (JWT + Cookies with `credentials: include`)
- **Role-based access control** (Admin, Developer, Client)
- **Ticket CRUD operations**
- **Notification system** (in-app + email via SMTP)
- **Security measures** (validation, sanitization, rate limiting, XSS protection, helmet)

- **Environment-based configuration**

---

### 🛠️ Tech Stack

- **Node.js** + **Express** – REST API framework
- **TypeScript** – Type safety
- **Prisma ORM** – Database queries
- **PostgreSQL** – Relational database
- **Zod** – Input validation
- **Helmet** – Secure HTTP headers
- **Rate Limiting** – Brute force prevention
- **Nodemailer** – Email sending
- **Cookie-based Auth** – Secure session handling

---

### 📂 Project Structure

```
backend/
│── src/
│   ├── app.ts        # Routes & middlewares
│   ├── server.ts     # Server bootstrap
│   ├── controllers/  # Business logic
│   ├── services/     # Services (notifications, email, etc.)
│   ├── validation/   # Zod schemas
│   ├── middlewares/  # Auth, rate limit, error handling
│   ├── prisma/       # Database schema
│
│── .env              # Environment variables
│── package.json
```

---

### ⚙️ Environment Variables

Create a `.env` file in the backend root with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ticketsystem

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_password
SMTP_FROM="Ticket System <no-reply@domain.com>"

CLIENT_URL=http://localhost:3000
```

---

### 🔐 Security Measures Implemented

- **Data validation** – Zod schemas for all inputs
- **Sanitization** – Prevent XSS attacks
- **Helmet** – Secure HTTP headers
- **Rate limiting** – Prevent brute force & spam
- **CSRF protection** – Token-based
- **Error security** – No stack trace in production

---

### 📦 Installation & Usage

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

### 📧 Email & Notifications

- Emails are sent via **SMTP** (Hostinger in this case).
- Notifications are stored in the database and displayed in the frontend.

---
