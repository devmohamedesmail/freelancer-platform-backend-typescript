# Freelancer Platform Backend

This is a **Freelancer Platform Backend** built with **TypeScript**, **Express.js**, and **Prisma ORM**. The platform allows users to create accounts, post gigs, manage categories and subcategories, and handle orders and reviews similar to platforms like Fiverr, but in a simplified and clean architecture.

---

## Table of Contents

- [Features](#features)
- [Advanced Features](#advanced-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Migrations](#migrations)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Management**: Register, login, and manage roles (Admin, User).  
- **Categories & Subcategories**: Create and manage categories with multilingual support (`title_ar`, `title_en`).  
- **Gigs**: Users can create gigs/services under categories and subcategories.  
- **Orders**: Buyers can order gigs and track the status (pending, in_progress, completed, cancelled).  
- **Reviews**: Users can review gigs they purchased.  
- **JWT Authentication**: Protected routes for sensitive actions like create, update, delete.  
- **Validation**: Request validation using **Joi** for robust input handling.  
- **TypeScript**: Strong typing for safer and scalable codebase.  
- **Prisma ORM**: Simplifies database operations with type-safe queries.

---

## Advanced Features

- **Multilingual Support**: Categories and subcategories support both Arabic and English titles.  
- **Structured Data Relationships**: Proper relations between users, gigs, categories, subcategories, orders, and reviews.  
- **Clean Architecture**: Separate controllers, routes, validations, and middleware for maintainable code.  
- **Shadow Database (Prisma Migrate)**: Supports safe schema migrations in development.  
- **Extensible**: Easily add features like promotions, featured gigs, file uploads, or notifications.  
- **Real-time Ready**: Designed to integrate with WebSockets for real-time notifications or chat between users.  
- **Secure**: JWT authentication and role-based access control for sensitive endpoints.  

---

## Tech Stack

- **Node.js**  
- **TypeScript**  
- **Express.js**  
- **Prisma ORM**  
- **MySQL** (or MariaDB)  
- **Joi** for request validation  
- **JWT** for authentication  

---

## Getting Started

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/freelancer-backend.git
cd freelancer-backend

# freelancer-platform-backend-typescript
