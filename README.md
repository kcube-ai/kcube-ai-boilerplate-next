# KCube AI Boilerplate

**KCube AI Boilerplate** is a foundational application designed to showcase AI-driven solutions for clients. It’s fully customizable — you can easily toggle features and apply unique color themes to match client branding.

---

## 🧩 Tech Stack

**Backend:** FastAPI + SQLAlchemy  
**Frontend:** React (TypeScript) + Tailwind CSS  
**Database:** PostgreSQL  

---

## ⚙️ Local Setup

1. Open your terminal in the project root directory.  
2. Run the following command to start the application:

   ```bash
   docker compose up
   ```

   or, to run it in the background:

   ```bash
   docker compose up -d
   ```

> 💡 The Docker Compose configuration automatically sets up a local PostgreSQL database.

---

## 🔁 Rebuild Guide

If you need to rebuild the containers:

1. Navigate to the project root directory.  
2. Run:

   ```bash
   docker compose down --rmi local
   docker compose up
   ```

---

## 📘 Notes

This boilerplate serves as a flexible starting point for client-specific AI applications. You can easily extend or modify both backend and frontend components as needed.

---

**© KCube AI**
