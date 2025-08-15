---
## 🎯 Ticket Management System

### 📌 Overview

A full-stack **Ticket Management System** with role-based dashboards, secure authentication, real-time notifications, and email integration.
Built with **Next.js**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.
---

## 🚀 Features

- **Role-based dashboards** (Admin, Developer, Client)
- **Ticket management** (create, update, assign, track)
- **Notification system** (in-app + email)
- **Secure authentication** with JWT + HTTP-only cookies
- **Responsive UI** with TailwindCSS
- **Advanced statistics** filtered by user role
- **Environment-based configuration**

---

## 🛠️ Tech Stack

**Frontend**

- **Next.js** + **TypeScript**
- **TailwindCSS** for styling
- **React Query** for API state management

**Backend**

- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **Zod** for validation
- **Nodemailer** for email sending

**Security**

- Input validation & sanitization
- Rate limiting
- Helmet for secure HTTP headers
- No stack trace exposure in production

---

## 📂 Architecture

```
project/
│── frontend/         # Next.js app
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── styles/
│
│── backend/          # Express API
│   ├── app.ts        # Routes & middlewares
│   ├── server.ts     # Server bootstrap
│   ├── controllers/  # Business logic
│   ├── services/     # Email, notifications
│   ├── validation/   # Zod schemas
│   └── middlewares/  # Auth, security
```

---

## ⚙️ Environment Variables

**Backend `.env`**

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

**Frontend `.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📦 Installation & Usage

**Backend**

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## 📧 Email & Notifications

- Notifications can be sent **by admins to clients or assigned developers**, and **by developers to clients**.
- Email notifications sent via **SMTP (Hostinger)**.
- All notifications are stored in the database for in-app display.

---

## 🔒 Security Highlights

- **Validation & Sanitization** with Zod
- **Rate limiting** on sensitive routes
- **Helmet** for secure headers
- **Error stack traces hidden** in production

---
