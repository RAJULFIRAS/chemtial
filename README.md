# Chemtial

> E-commerce platform untuk kebutuhan laboratorium dan industri kimia — menyediakan bahan kimia, reagen, peralatan gelas, safety equipment, dan jasa pengujian lab.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## Daftar Isi

- [Overview](#overview)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Project](#struktur-project)
- [License](#license)

---

## Overview

**Chemtial** adalah platform e-commerce yang menyediakan kebutuhan laboratorium dan industri kimia di Indonesia. Platform ini melayani baik pelanggan individu (B2C) maupun perusahaan (B2B) dengan katalog lengkap mulai dari bahan kimia dasar, reagen analitik, hingga peralatan laboratorium.

### Problem yang Diselesaikan

- **Fragmentasi supplier:** Pelanggan harus menghubungi banyak supplier untuk kebutuhan berbeda
- **Transparansi harga:** Harga tidak konsisten dan sering perlu nego manual
- **Proses order manual:** Order via WhatsApp/email tidak scalable
- **Kurangnya informasi produk:** CAS number, MSDS, dan spesifikasi teknis sering tidak tersedia

### Solusi

- **One-stop catalog:** 20+ kategori produk kimia dan lab equipment
- **Harga transparan:** Semua produk dengan harga dan stok real-time
- **Self-service order:** Browse, add to cart, checkout, tracking order
- **Informasi lengkap:** Setiap produk dilengkapi CAS number, unit, dan spesifikasi

### Target Audience

- **Primary:** Laboratorium riset, QC/QA lab, universitas
- **Secondary:** Industri manufaktur, pertambangan, farmasi, food & beverage
- **Tertiary:** Pelajar/mahasiswa, hobbyist kimia

---

## Fitur Utama

### Public (Customer)

- **Product Catalog** — Browse produk berdasarkan kategori, brand, atau pencarian
- **Product Detail** — Info lengkap dengan CAS number, harga, stok, unit
- **Search & Filter** — Pencarian real-time, filter kategori dan brand
- **Shopping Cart** — Add/update/remove item dengan persistensi
- **Checkout** — Multi-step checkout dengan validasi alamat
- **Order Tracking** — Riwayat order dan status real-time
- **Authentication** — Register, login, refresh token, logout
- **Multi-language** — Bahasa Indonesia & English
- **Promo & Voucher** — Kode promo dan voucher diskon
- **B2B Inquiry** — Form khusus untuk pembelian bulk

### Admin Panel

- **Dashboard** — Overview statistik (kategori, brand, promo, voucher)
- **Product Management** — CRUD produk dengan upload gambar
- **Category Management** — CRUD kategori dengan icon dan gambar
- **Brand Management** — CRUD brand dengan logo
- **Promo Management** — Kelola promo dengan periode aktif
- **Voucher Management** — Kelola voucher dengan limit per user
- **Banner Management** — Kelola banner homepage
- **Order Management** — Kelola pesanan, update status
- **User Management** — Kelola user dan role
- **Audit Log** — Log semua aksi admin

### Technical Features

- **Type-safe end-to-end** — TypeScript strict mode, no `any`
- **RESTful API** — Standardized response format
- **JWT Authentication** — Access + refresh token rotation
- **Rate Limiting** — 100 req/15 menit (general), 5 req/menit (auth)
- **Security Headers** — Helmet.js (CSP, HSTS, X-Frame-Options)
- **Input Validation** — Zod schema di semua endpoint
- **Error Handling** — Global error handler dengan format konsisten
- **Soft Delete** — Data tidak hilang permanen
- **File Upload** — Multer dengan validasi MIME type dan size
- **Payment Integration** — Stripe (test mode)
- **Download Tracking** — Track download Play Store/App Store

---

## Tech Stack

### Backend

| Layer          | Technology   | Version | Purpose            |
| -------------- | ------------ | ------- | ------------------ |
| **Runtime**    | Node.js      | 20.x    | JavaScript runtime |
| **Language**   | TypeScript   | 5.x     | Type safety        |
| **Framework**  | Express      | 4.x     | HTTP server        |
| **ORM**        | Prisma       | 5.x     | Database access    |
| **Database**   | PostgreSQL   | 15.x    | Primary data store |
| **Cache**      | Redis        | 7.x     | Session & cache    |
| **Validation** | Zod          | 3.x     | Runtime validation |
| **Auth**       | JWT + bcrypt | Latest  | Authentication     |
| **Payment**    | Stripe       | Latest  | Payment gateway    |
| **Upload**     | Multer       | 2.x     | File upload        |
| **Logger**     | Pino         | 8.x     | Structured logging |
| **Security**   | Helmet       | 7.x     | Security headers   |

### Frontend

| Layer             | Technology      | Version | Purpose              |
| ----------------- | --------------- | ------- | -------------------- |
| **Framework**     | React           | 18.x    | UI library           |
| **Build Tool**    | Vite            | 5.x     | Dev server & bundler |
| **Language**      | TypeScript      | 5.x     | Type safety          |
| **State**         | Redux Toolkit   | 2.x     | State management     |
| **Routing**       | React Router    | 7.x     | Client-side routing  |
| **Styling**       | Tailwind CSS    | 3.x     | Utility-first CSS    |
| **i18n**          | i18next         | Latest  | Multi-language       |
| **HTTP**          | Axios           | 1.x     | API client           |
| **Notifications** | react-hot-toast | 2.x     | Toast notifications  |
| **Icons**         | lucide-react    | Latest  | Icon library         |

### DevOps

| Tool               | Purpose                              |
| ------------------ | ------------------------------------ |
| **Docker**         | Containerization (PostgreSQL, Redis) |
| **Docker Compose** | Local dev orchestration              |
| **Prisma Migrate** | Database migrations                  |

---

## Arsitektur

### High-Level Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                  FRONTEND (Vite + React)                 │
│                   http://localhost:5000                  │
│                                                          │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│ │ Public Pages │ │ Auth Pages │ │ Admin Pages    │       │
│ └──────────────┘ └──────────────┘ └──────────────┘       │
│        │                 │                 │             │
│        └─────────────────┼─────────────────┘             │
│                          ▼                               │
│                 ┌──────────────────┐                     │
│                 │ Redux Store      │                     │
│                 │ (auth, cart,     │                     │
│                 │ product, order,  │                     │
│                 │ brand, ui)       │                     │
│                 └──────────────────┘                     │
│                          │                               │
│                          ▼                               │
│                 ┌──────────────────┐                     │
│                 │ Axios HTTP       │                     │
│                 │ Client           │                     │
│                 └──────────────────┘                     │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTP (JSON)
                            ▼
┌──────────────────────────────────────────────────────────┐
│ BACKEND (Express + Node)                                 │
│ http://localhost:3000/api                                │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Presentation Layer                                   │ │
│ │ - Controllers                                        │ │
│ │ - Routes                                             │ │
│ │ - Middlewares (auth, error, rate-limit, upload)      │ │
│ └──────────────────────────────────────────────────────┘ │
│                           ▼                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Application Layer                                    │ │
│ │ - Use Cases (register, login, get-products, dll)     │ │
│ │ - DTOs, Mappers                                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                           ▼                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Domain Layer                                         │ │
│ │ - Entities (User, Product, Order, Cart, dll)         │ │
│ │ - Repository Interfaces                              │ │
│ │ - Value Objects (Email, Password)                    │ │
│ └──────────────────────────────────────────────────────┘ │
│                           ▼                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Infrastructure Layer                                 │ │
│ │ - Prisma Repositories                                │ │
│ │ - JWT Service                                        │ │
│ │ - Stripe Service                                     │ │
│ │ - Logger                                             │ │
│ └──────────────────────────────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────┘
                            │ Prisma Client
                            ▼
┌──────────────────────────────────────────────────────────┐
│ DATA LAYER                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│ │ PostgreSQL   │ │ Redis        │ │ Uploads      │       │
│ │ (Primary)    │ │ (Cache)      │ │ (File Dir)   │       │
│ └──────────────┘ └──────────────┘ └──────────────┘       │
└──────────────────────────────────────────────────────────┘
```

### Clean Architecture Pattern

Project ini menggunakan **Clean Architecture** dengan pemisahan layer:

1. **Domain Layer** — Business rules, entities, value objects. Tidak bergantung pada layer lain.
2. **Application Layer** — Use cases, orchestration. Bergantung pada domain.
3. **Infrastructure Layer** — Implementasi teknis (Prisma, JWT, Stripe). Bergantung pada domain & application.
4. **Presentation Layer** — HTTP handlers. Bergantung pada application.

**Aturan:** Layer bawah tidak boleh tahu layer atas. Domain tidak boleh import Prisma.

---

## Struktur Project

```text
chemtial/
├── chemtial-backend/ # Backend API
│ ├── prisma/
│ │ ├── migrations/ # Database migrations
│ │ ├── schema.prisma # Prisma schema
│ │ └── seed.ts # Database seeder
│ ├── src/
│ │ ├── application/ # Use cases, DTOs, Mappers
│ │ │ ├── dtos/
│ │ │ ├── mappers/
│ │ │ └── use-cases/
│ │ ├── config/ # Config & env validation
│ │ ├── domain/ # Entities, Repositories, VOs
│ │ │ ├── entities/
│ │ │ ├── repositories/
│ │ │ └── value-objects/
│ │ ├── infrastructure/ # External dependencies
│ │ │ ├── auth/
│ │ │ ├── database/
│ │ │ ├── http/ # Controllers, Routes, Middlewares
│ │ │ └── payment/
│ │ ├── shared/ # Shared utilities
│ │ │ ├── exceptions/
│ │ │ └── utils/
│ │ └── server.ts # Entry point
│ ├── uploads/ # Uploaded files
│ ├── docker-compose.yml
│ ├── package.json
│ └── tsconfig.json
│
├── chemtial-frontend/ # Frontend SPA
│ ├── src/
│ │ ├── asset/ # Static assets
│ │ ├── components/ # Reusable components
│ │ │ ├── admin/
│ │ │ ├── cart/
│ │ │ ├── common/
│ │ │ ├── home/
│ │ │ └── layout/
│ │ ├── i18n/ # Internationalization
│ │ ├── pages/ # Page components
│ │ │ ├── admin/
│ │ │ ├── auth/
│ │ │ └── \*.tsx # Public pages
│ │ ├── services/ # API clients
│ │ ├── store/ # Redux store & slices
│ │ ├── types/ # TypeScript types
│ │ ├── utils/ # Utilities
│ │ ├── App.tsx
│ │ ├── main.tsx
│ │ └── index.css
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## License

All rights reserved.

Kontak
Owner: [Nama Anda]
Email: [email Anda]
Repository: [repository URL]
