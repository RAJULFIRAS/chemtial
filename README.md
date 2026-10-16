<div align="center">

# Chemtial — Chemical & Laboratory E-Commerce Platform

**A production-oriented fullstack e-commerce system for laboratory and chemical industry needs — built with a free-tier-first architecture**

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://chemtial.vercel.app)
[![API Status](https://img.shields.io/badge/API-healthy-brightgreen?style=for-the-badge)](https://chemtial-backend.vercel.app/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)

_Self-initiated product project — a real B2B/B2C e-commerce concept for the chemical industry_

[Live Demo](https://chemtial.vercel.app) · [Report Bug](https://github.com/RAJULFIRAS/chemtial/issues)

</div>

---

## About This Project

**Chemtial** is a fullstack e-commerce platform built to serve the chemical and laboratory industry in Indonesia — providing chemicals, reagents, glassware, safety equipment, and lab testing services in one place.

This is a **self-initiated product project** built to demonstrate:

1. **End-to-end product engineering** — from business logic, architecture, database modeling, to deployment
2. **Cost-aware architecture** — a production-ready system that launches at **$0 infrastructure cost**, with a clear upgrade path
3. **Reference architecture** for founders and SMBs in the chemical/lab supply chain who want to go digital without committing to expensive infrastructure upfront

> **Note:** This is not client work. It is a concept project designed and built as part of a portfolio.

---

## Why This Stack? — Free-Tier-First Architecture

This is a **deliberate decision**, not a constraint.

### Philosophy

Production-grade systems don't have to be expensive at the start. For MVPs, pre-seed startups, and SMBs going digital, **capital efficiency** matters more than premature scaling.

Every component in this stack:

- **Free at entry tier** — launch with $0 infrastructure cost
- **Production-ready from day one** — not a "trial version"
- **Has a clear upgrade path** — migrate when the business actually needs it
- **Modern and battle-tested** — used by unicorn startups and enterprises

### Why Not X?

| Alternative        | Why Not Chosen                                              |
| ------------------ | ----------------------------------------------------------- |
| **Heroku**         | Discontinued free tier, less edge coverage                  |
| **AWS (full DIY)** | Overkill for MVP, requires DevOps expertise                 |
| **Firebase**       | NoSQL doesn't fit transactional order + inventory integrity |
| **Shopify**        | Not flexible enough for B2B bulk pricing & custom workflows |
| **WooCommerce**    | Requires server maintenance, not serverless-friendly        |

### Stack Breakdown & Upgrade Path

| Component             | Free Tier         | Paid Tier      | When to Upgrade             |
| --------------------- | ----------------- | -------------- | --------------------------- |
| **Vercel (Frontend)** | 100 GB bandwidth  | Pro $20/mo     | >100 GB or team features    |
| **Vercel (Backend)**  | 100 GB-hr compute | Pro $20/mo     | High API traffic            |
| **Vercel Blob**       | 1 GB storage      | Pro $20/mo     | >1 GB product image storage |
| **Neon PostgreSQL**   | 500 MB storage    | Launch $19/mo  | >500 MB data                |
| **Total (Free)**      | **$0/month**      | —              | —                           |
| **Total (Scaled)**    | —                 | **~$59/month** | ~10,000+ active customers   |

### Why This Matters

For **founders, SMBs, and early-stage chemical suppliers**:

- Launch today without infrastructure commitment
- Validate business model before paying for scale
- Upgrade only when revenue justifies it
- No vendor lock-in — each component can migrate independently

**This isn't a "cheap" stack. It's a _capital-efficient_ stack** — designed to survive the transition from MVP to real business.

### Monorepo Structure

This project uses a **monorepo** for strategic reasons:

- **Shared types** between frontend & backend — consistency, fewer bugs
- **Single deploy pipeline** — Vercel auto-detects both projects
- **Centralized environment** — unified secret management
- **Easy to fork** — clients can deploy their own instance in minutes

---

## Scaling Roadmap

The system is designed to grow with the business. Here's the concrete path from MVP to enterprise.

### Stage 1 — MVP Launch (Current)

**Target:** 0–100 active users · 0–50 orders/day

| Aspect                  | Current State                     |
| ----------------------- | --------------------------------- |
| **Infrastructure cost** | $0/month                          |
| **Hosting**             | Vercel Hobby (frontend + backend) |
| **Database**            | Neon Free (500 MB)                |
| **Storage**             | Vercel Blob Free (1 GB)           |
| **Email**               | Mailtrap (dev) / manual (prod)    |
| **Monitoring**          | Vercel logs + basic health check  |
| **Expected bottleneck** | None                              |

**Action:** Launch, gather feedback, validate product-market fit.

---

### Stage 2 — Early Traction

**Target:** 100–1,000 active users · 50–500 orders/day

| Aspect                  | Action Required                                        |
| ----------------------- | ------------------------------------------------------ |
| **Infrastructure cost** | ~$20–40/month                                          |
| **Hosting**             | Upgrade Vercel Pro (better function limits, analytics) |
| **Database**            | Still Neon Free (500 MB ≈ 50,000 orders)               |
| **Storage**             | Still Vercel Blob Free (<1 GB images)                  |
| **Email**               | Add **Resend** or **SendGrid** (free: 100 emails/day)  |
| **Monitoring**          | Add **Sentry** (free tier) for error tracking          |
| **Analytics**           | Add Vercel Analytics or Plausible                      |
| **Expected bottleneck** | Email delivery, error visibility                       |

**Migration triggers:**

- Vercel bandwidth >80 GB/month
- Want analytics & advanced logging

**Action:** Automate order confirmation emails, add monitoring, tune rate limits.

---

### Stage 3 — Growth

**Target:** 1,000–10,000 active users · 500–5,000 orders/day

| Aspect                  | Action Required                                             |
| ----------------------- | ----------------------------------------------------------- |
| **Infrastructure cost** | ~$100–200/month                                             |
| **Hosting**             | Vercel Pro + consider dedicated compute for heavy endpoints |
| **Database**            | Upgrade Neon Launch ($19/mo) → 10 GB, more compute          |
| **Storage**             | Upgrade Vercel Blob Pro ($20/mo) → 100 GB, 1 TB bandwidth   |
| **Email**               | Paid tier Resend/SendGrid (~$20/mo)                         |
| **Monitoring**          | Sentry Team tier + uptime monitoring (BetterStack)          |
| **Caching**             | Add Redis (Upstash free → paid as needed)                   |
| **Search**              | Add Postgres full-text search or Meilisearch                |
| **Payments**            | Add Stripe billing for B2B invoices                         |
| **Expected bottleneck** | Database queries, file bandwidth, concurrent checkout       |

**Migration triggers:**

- Database >400 MB
- Blob >800 MB
- API latency >500ms p95
- Concurrent order conflicts

**Action:** Add caching layer, optimize queries, consider read replicas.

---

### Stage 4 — Scale

**Target:** 10,000+ active users · multi-region B2B supply

| Aspect                  | Action Required                                                                |
| ----------------------- | ------------------------------------------------------------------------------ |
| **Infrastructure cost** | $300–1,000+/month                                                              |
| **Hosting**             | Vercel Enterprise or migrate backend to dedicated infra (Railway, Fly.io, AWS) |
| **Database**            | Neon Scale or migrate to AWS RDS / Supabase Pro with read replicas             |
| **Storage**             | CDN-optimized storage (Cloudflare R2, AWS S3 + CloudFront)                     |
| **Email**               | Dedicated email service (AWS SES, Postmark)                                    |
| **Monitoring**          | Full observability stack (Datadog, Grafana, or New Relic)                      |
| **Auth**                | Consider Auth0, Clerk, or custom OAuth/OIDC                                    |
| **Payments**            | Stripe Billing for B2B invoices, integrate with ERP                            |
| **Search**              | Dedicated search (Algolia, Elasticsearch)                                      |
| **Expected bottleneck** | Multi-region latency, cost optimization, compliance (GMP, ISO)                 |

**Migration triggers:**

- Multi-region expansion
- SLA/compliance requirements (GMP, ISO 17025, GDPR)
- Enterprise B2B customers demanding dedicated infra

**Action:** Multi-region deployment, database sharding, dedicated support.

---

### Cost Projection

| Monthly Traffic | Active Users | Est. Cost |
| --------------- | ------------ | --------- |
| <10K            | <100         | $0        |
| 10K–100K        | 100–1K       | ~$20–40   |
| 100K–1M         | 1K–10K       | ~$100–200 |
| >1M             | 10K+         | $300+     |

---

### Scaling Principles

Whatever stage the business is in, these principles stay constant:

1. **Migrate on trigger, not on schedule** — upgrade only when a real bottleneck appears
2. **Keep components independent** — each service can be swapped without rewriting the app
3. **Measure before optimizing** — add analytics before adding infrastructure
4. **Favor managed services** — no servers to maintain until scale demands it
5. **Design for the next stage, not the final one** — architecture should support 10x growth, not 1000x

### What Doesn't Change

Even at scale, these architectural decisions stay the same:

- **TypeScript everywhere** — type safety across the stack
- **Prisma ORM** — migration history, type-safe queries
- **JWT + refresh rotation** — stateless, revocable auth
- **Zod validation** — schema-first input validation
- **REST API contract** — stable interface for clients
- **Clean Architecture** — domain, application, infrastructure, presentation layers
- **Monorepo** — shared types, unified tooling

---

## Key Features

<table>
<tr>
<td width="50%">

**For Customers (B2C & B2B)**

- Browse 20+ chemical & lab equipment categories
- Product detail with CAS number, MSDS, unit variants
- Real-time search, filter by category & brand
- Shopping cart with voucher & promo support
- Multi-step checkout with address validation
- Order tracking with status timeline
- Product reviews (verified purchase only)
- Multi-language (ID / EN / ZH / HI / RU / AR)
- B2B bulk inquiry form
- COD, bank transfer, e-wallet payment

</td>
<td width="50%">

**For Admins & Managers**

- Dashboard with live statistics
- CRUD products with multi-image & multi-unit
- CRUD categories (6-language support)
- CRUD brands, promos, banners, vouchers
- Order management with status workflow
- COD confirmation workflow for couriers
- Revenue report & accounting dashboard
- App download tracker with analytics
- Role-based access (manager / admin / courier)
- JWT auth with refresh token rotation
- Audit log for all admin actions

</td>
</tr>
</table>

---

## Architecture & Engineering Decisions

```mermaid
graph TB
    subgraph Client["🖥️ Client Browser"]
        UI[React SPA]
    end

    subgraph Vercel["☁️ Vercel Edge Network"]
        FE[Frontend<br/>chemtial.vercel.app]
        BE[Backend API<br/>Serverless Functions]
        BLOB[(Vercel Blob<br/>Image Storage)]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[(PostgreSQL<br/>Neon Serverless)]
    end

    subgraph External["🔌 External Services"]
        STRIPE[Stripe<br/>Payments]
        SMTP[SMTP<br/>Email]
    end

    UI -->|HTTPS| FE
    FE -->|REST API| BE
    BE -->|Prisma Client| DB
    BE -->|Upload / Delete| BLOB
    BE -->|Payment Intent| STRIPE
    BE -->|Reset Password| SMTP
    BLOB -.->|Public URL| UI

    style UI fill:#61DAFB,color:#000
    style FE fill:#000,color:#fff
    style BE fill:#000,color:#fff
    style BLOB fill:#FFB800,color:#000
    style DB fill:#4169E1,color:#fff
    style STRIPE fill:#635BFF,color:#fff
    style SMTP fill:#EA4335,color:#fff
```

## Clean Architecture Layers

This project uses Clean Architecture with strict separation:

Domain Layer — business rules, entities, value objects. No external dependencies.

Application Layer — use cases, DTOs, mappers. Depends on domain only.

Infrastructure Layer — Prisma, JWT, Stripe, email. Depends on domain & application.

Presentation Layer — HTTP controllers, routes, middleware. Depends on application.

Rule: Inner layers never import outer layers. Domain never imports Prisma.

### Engineering Decisions

Decision Rationale Trade-off
PostgreSQL over MongoDB ACID transactions required for order + inventory Stricter schema migrations
Prisma over raw SQL Type-safe queries, migration history Slight overhead vs raw SQL
JWT + refresh rotation Stateless auth, revocable sessions Requires secure client storage
Clean Architecture Business logic independent of framework More files, initial boilerplate
Vercel Blob over local disk Serverless filesystem is ephemeral Extra service dependency
Vercel Blob over S3 Native Vercel integration, 1-click setup Minor vendor lock-in
Monorepo over multi-repo Shared types, single deploy pipeline Requires Vercel Root Directory config
Zod over manual validation Schema-first, runtime safety Initial learning curve
Multi-language DB fields No join table for translations, simpler queries Schema less normalized
Soft delete everywhere Data recovery, audit compliance Requires deletedAt: null filter

### Security & Production Considerations

Rate limiting — 200 req/15min global, 5 req/min for auth, per-user when authenticated

Helmet — CSP, HSTS, frameguard, referrer policy

Zod validation — all inputs validated at the boundary

JWT rotation — refresh token rotated to prevent replay attacks

CORS whitelist — only registered origins allowed

Bcrypt password hashing — cost factor 12

Structured logging — Pino with context (user, path, method)

Soft delete — data is not permanently removed

Audit log — every admin action is recorded

Upload validation — MIME type + extension + size limits

Integration tests — critical paths are covered

### Tech Stack

<table> <tr> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/react/61DAFB" width="48" height="48" alt="React" /> <br><sub><b>React 18</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/typescript/3178C6" width="48" height="48" alt="TypeScript" /> <br><sub><b>TypeScript</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/vite/646CFF" width="48" height="48" alt="Vite" /> <br><sub><b>Vite</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/redux/764ABC" width="48" height="48" alt="Redux" /> <br><sub><b>Redux Toolkit</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="48" height="48" alt="Tailwind" /> <br><sub><b>Tailwind CSS</b></sub> </td> </tr> <tr> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/nodedotjs/339933" width="48" height="48" alt="Node.js" /> <br><sub><b>Node.js 20</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/express/000000" width="48" height="48" alt="Express" /> <br><sub><b>Express</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/prisma/2D3748" width="48" height="48" alt="Prisma" /> <br><sub><b>Prisma</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/postgresql/4169E1" width="48" height="48" alt="PostgreSQL" /> <br><sub><b>PostgreSQL</b></sub> </td> <td align="center" width="96"> <img src="https://cdn.simpleicons.org/vercel/000000" width="48" height="48" alt="Vercel" /> <br><sub><b>Vercel</b></sub> </td> </tr> </table>

#### Detail

Layer Technology
Frontend React 18 · TypeScript · Vite · Redux Toolkit · React Router 7 · Tailwind CSS · i18next · Axios
Backend Node.js 20 · Express 4 · TypeScript · Prisma ORM · Zod · JWT · bcrypt · Multer · Pino
Database PostgreSQL 15 (Neon Serverless)
Storage Vercel Blob (cloud file storage)
Payments Stripe (test mode)
Email Nodemailer (SMTP — Mailtrap for dev)
Testing Vitest · Supertest · Testing Library
Tooling ESLint · tsx · Rimraf · cross-env
Deployment Vercel (frontend & backend) · Neon (database) · Vercel Blob (storage)

## Quick Start

### Prerequisites

```bash
node --version # v20.x or newer
npm --version # v10.x or newer
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/RAJULFIRAS/chemtial.git
cd chemtial
### 2️⃣ Start Database (Docker)
bash
cd chemtial-backend
docker-compose up -d
```

This starts PostgreSQL on port 1976 and Redis on 6379.

### 3️⃣ Setup Backend

```bash
cd chemtial-backend
npm install
cp .env.example .env

# Edit .env — fill DATABASE_URL, JWT_SECRET, REFRESH_SECRET, BLOB_READ_WRITE_TOKEN, etc.

npx prisma migrate deploy
npx prisma db seed
npm run db:create-manager -- --email=manager@chemtial.com --password=YourPass123! --name="Manager"
npm run dev
```

Backend runs at http://localhost:3000/api.

### 4️⃣ Setup Frontend

```bash
cd ../chemtial-frontend
npm install
cp .env.example .env

# Edit .env — set VITE_API_BASE_URL=http://localhost:3000/api

npm run dev
```

Frontend runs at http://localhost:5000.

### 5️⃣ Login as Manager

```text
Email: manager@chemtial.com
Password: (as configured in step 3)
```

Access admin panel at http://localhost:5000/admin.

## API Documentation

### Resource URL

Health Check http://localhost:3000/health
Postman Collection chemtial-backend/postman-collection.json

### Main Endpoints

<details> <summary><b>Public Endpoints</b></summary>
Method	Endpoint	Description
GET	/api/products	List products with filters
GET	/api/products/:id	Get product detail
GET	/api/categories	List categories (6 languages)
GET	/api/brands	List brands
GET	/api/promos	List active promos
GET	/api/vouchers	List active vouchers
GET	/api/banners	List homepage banners
GET	/api/reviews/product/:id	List product reviews
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
POST	/api/auth/refresh	Refresh access token
POST	/api/auth/forgot-password	Request password reset
POST	/api/auth/reset-password	Reset password with token
POST	/api/downloads/track	Track app download click
</details><details> <summary><b>Customer Endpoints</b> (requires JWT)</summary>
Method	Endpoint	Description
GET	/api/cart	Get current user's cart
POST	/api/cart/items	Add item to cart
PATCH	/api/cart/items/:id	Update cart item quantity
DELETE	/api/cart/items/:id	Remove cart item
POST	/api/orders	Create order from cart
GET	/api/orders	Get user's order history
GET	/api/orders/:id	Get order detail
GET	/api/orders/:id/history	Get order status timeline
PATCH	/api/orders/:id/cancel	Cancel own order
POST	/api/vouchers/:id/claim	Claim a voucher
GET	/api/vouchers/my-vouchers	List claimed vouchers
POST	/api/vouchers/validate	Validate voucher usage
POST	/api/reviews	Submit product review
GET	/api/reviews/my-reviews	Get own reviews
POST	/api/payment/create-checkout-session	Create Stripe checkout session
</details><details> <summary><b>Admin Endpoints</b> (requires JWT + admin/manager role)</summary>
Method	Endpoint	Description
POST	/api/products	Create product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Soft delete product
POST	/api/categories	Create category
PUT	/api/categories/:id	Update category
DELETE	/api/categories/:id	Soft delete category
POST	/api/brands	Create brand
PUT	/api/brands/:id	Update brand
DELETE	/api/brands/:id	Soft delete brand
POST	/api/promos	Create promo
PUT	/api/promos/:id	Update promo
DELETE	/api/promos/:id	Soft delete promo
POST	/api/vouchers	Create voucher
PUT	/api/vouchers/:id	Update voucher
DELETE	/api/vouchers/:id	Soft delete voucher
POST	/api/banners	Create banner
PUT	/api/banners/:id	Update banner
DELETE	/api/banners/:id	Soft delete banner
GET	/api/orders/admin/all	List all orders (paginated)
GET	/api/orders/admin/stats	Order statistics summary
GET	/api/orders/admin/revenue	Revenue report (manager only)
PATCH	/api/orders/:id/status	Update order status
GET	/api/orders/cod/pending	List COD orders awaiting payment
PATCH	/api/orders/cod/:id/confirm	Confirm COD payment received
POST	/api/upload/product	Upload product image
POST	/api/upload/brand	Upload brand logo
POST	/api/upload/banner	Upload banner (image/video)
GET	/api/users	List users (manager + admin)
PATCH	/api/users/:id/role	Update user role (manager only)
DELETE	/api/users/:id	Delete user
GET	/api/downloads/stats	App download stats
GET	/api/downloads/analytics	App download analytics
</details>
## Environment Variables
<details> <summary><b>Backend (.env)</b></summary>
```env
# Application
NODE_ENV=development
PORT=3000

# Database (Neon PostgreSQL)

DATABASE_URL=postgresql://user:pass@localhost:1976/chemtial
DIRECT_URL=postgresql://user:pass@localhost:1976/chemtial

# JWT — minimum 32 characters!

JWT_SECRET=your-super-secret-key-at-least-32-chars
REFRESH_SECRET=your-refresh-secret-at-least-32-chars-different
JWT_EXPIRY=1d
REFRESH_EXPIRY=7d

# CORS

CORS_ORIGIN=http://localhost:5000,https://chemtial.vercel.app

# Rate limiting (ms / requests)

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_WINDOW=900000
AUTH_RATE_LIMIT_MAX=5
CHECKOUT_RATE_LIMIT_WINDOW=300000
CHECKOUT_RATE_LIMIT_MAX=20

# Logging

LOG_LEVEL=info

# Vercel Blob (image upload)

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxx

# Upload

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
BASE_URL=http://localhost:3000

# Shipping / currency

DEFAULT_SHIPPING_COST=3.00
DEFAULT_CURRENCY=USD
MIN_PURCHASE_FOR_FREE_SHIPPING=50.00

# SMTP (Mailtrap for dev)

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=xxxxxxxxxxxx
SMTP_PASS=xxxxxxxxxxxx
SMTP_FROM_NAME=Chemtial Dev
SMTP_FROM_EMAIL=noreply@chemtial.dev
FRONTEND_URL=http://localhost:5000

# Company info

SUPPORT_PHONE=+62 852-7717-3823
WHATSAPP=+62 852-7717-3823
SUPPORT_EMAIL=inbox@chemtial.com
B2B_EMAIL=b2b@chemtial.com
CAREER_EMAIL=career@chemtial.com
COMPANY_ADDRESS=D St, Boston, MA 02210, United States
LEGAL_NAME=Chemtial LLC

# Bank info (for bank transfer)

BANK_NAME=Bank of America
BANK_ACCOUNT_NAME=Chemtial LLC
BANK_ACCOUNT_NUMBER=1234567890
BANK_ROUTING_NUMBER=026009593

# Stripe (optional)

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

````

</details><details> <summary><b>Frontend (.env)</b></summary>
```env
VITE_API_BASE_URL=http://localhost:3000/api

# Support contacts

VITE_SUPPORT_PHONE=+62 852-7717-3823
VITE_WHATSAPP=+62 852-7717-3823
VITE_SUPPORT_EMAIL=inbox@chemtial.com
VITE_CAREER_EMAIL=career@chemtial.com
VITE_B2B_EMAIL=b2b@chemtial.com

# Company info

VITE_COMPANY_ADDRESS=D St, Boston, MA 02210, United States
VITE_OFFICE_LOCATION=Boston, MA
VITE_LEGAL_NAME=Chemtial LLC
VITE_TIMEZONE=EST

# Shipping / currency

VITE_MIN_PURCHASE=50.00
VITE_SHIPPING_COST=3.00
VITE_CURRENCY=USD

# Bank info

VITE_BANK_NAME=Bank of America
VITE_BANK_ACCOUNT_NAME=Chemtial LLC
VITE_BANK_ACCOUNT_NUMBER=1234567890
VITE_BANK_ROUTING_NUMBER=026009593
````

</details>
⚠️ After changing env vars on Vercel, you must redeploy. Vite inlines VITE_* at build time, not runtime.

## Testing

### Backend — Unit + Integration Tests

Test Suite Coverage Focus
Authentication & Authorization Login, register, JWT, refresh rotation, RBAC
Product Use Cases Get products, create/update/delete
Order Lifecycle Status transitions (COD & non-COD)
Voucher Validation Percentage, fixed, free shipping, min purchase
Domain Value Objects Email, Password validation
Run backend tests:

```bash
cd chemtial-backend
npm test # All tests
npm run test:watch # Watch mode
npm run test:ui # Interactive UI
npm run test:coverage # With coverage report
### Frontend — Unit Tests
Test Suite Coverage Focus
Component Tests Button, Input, ConfirmDialog, DataTable
Hook Tests useDebounce, useDebouncedCallback
Store Tests authSlice, cartSlice
Utility Tests format, i18n-content, image
Run frontend tests:

bash
cd chemtial-frontend
npm test
npm run test:coverage
### Testing Strategy
Layered approach:

Unit tests — isolated logic, edge cases (Vitest)

Integration tests — API endpoints, database, validation (Supertest)

Component tests — UI behavior (Testing Library)

Focus: Critical paths over blanket coverage:

Authentication boundary

Order lifecycle (especially COD flow)

Voucher validation logic

Input validation (XSS, SQL injection)

Security hardening (rate limiting, CORS)
```

## Deployment

### Deploy Backend

```bash
cd chemtial-backend
vercel --prod
Environment Variables on Vercel:

Variable Description
DATABASE*URL Neon connection string (pooled)
DIRECT_URL Neon direct connection
JWT_SECRET Minimum 32 characters
REFRESH_SECRET Minimum 32 characters
CORS_ORIGIN Production frontend URL(s)
BASE_URL Production backend URL
NODE_ENV production
BLOB_READ_WRITE_TOKEN From Vercel Blob
STRIPE_SECRET_KEY From Stripe (optional)
STRIPE_WEBHOOK_SECRET From Stripe (optional)
SMTP*\* SMTP credentials
### Deploy Frontend
bash
cd chemtial-frontend
vercel --prod
Environment Variables:

Variable Value
VITE_API_BASE_URL https://chemtial-backend.vercel.app/api
### Setup Vercel Blob
Vercel Dashboard → Project → Storage

Create Database → Blob

Name: chemtial-images

Region: Singapore (sin1)

Access: Public (required for public product images)

Token is auto-added to env vars as BLOB_READ_WRITE_TOKEN

Redeploy backend

```

⚠️ Important: BLOB_READ_WRITE_TOKEN is required for image upload. Without it, all upload endpoints will return 400.

## Project Structure

```text
chemtial/
├── 📂 chemtial-backend/
│ ├── 📂 prisma/
│ │ ├── schema.prisma
│ │ ├── seed.ts
│ │ └── migrations/
│ ├── 📂 src/
│ │ ├── 📂 application/ # Use cases, DTOs, mappers
│ │ │ ├── dtos/
│ │ │ ├── mappers/
│ │ │ └── use-cases/
│ │ ├── 📂 config/ # Env validation, load-env
│ │ ├── 📂 domain/ # Entities, repositories, VOs
│ │ │ ├── entities/
│ │ │ ├── repositories/
│ │ │ └── value-objects/
│ │ ├── 📂 infrastructure/ # External dependencies
│ │ │ ├── auth/ # JWT, password service
│ │ │ ├── database/ # Prisma client + repositories
│ │ │ ├── email/ # Nodemailer service
│ │ │ ├── http/ # Controllers, routes, middleware
│ │ │ └── payment/ # Stripe service
│ │ ├── 📂 shared/ # Exceptions, logger, constants
│ │ ├── dev-server.ts
│ │ └── server.ts
│ ├── docker-compose.yml
│ └── vercel.json
│
├── 📂 chemtial-frontend/
│ ├── 📂 public/
│ ├── 📂 src/
│ │ ├── 📂 asset/
│ │ ├── 📂 components/
│ │ │ ├── admin/
│ │ │ ├── cart/
│ │ │ ├── common/
│ │ │ ├── home/
│ │ │ ├── layout/
│ │ │ ├── order/
│ │ │ └── voucher/
│ │ ├── 📂 hooks/
│ │ ├── 📂 i18n/ # 6 languages
│ │ ├── 📂 pages/
│ │ │ ├── admin/
│ │ │ ├── auth/
│ │ │ └── \*.tsx
│ │ ├── 📂 services/ # API clients
│ │ ├── 📂 store/ # Redux Toolkit slices
│ │ ├── 📂 types/
│ │ ├── 📂 utils/
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── vercel.json
│
└── README.md
```

## Lessons Learned

### Key insights from building this project:

Serverless ≠ traditional server — filesystem is read-only, so cloud storage (Vercel Blob) is required for file uploads

Vite inlines env vars at build time — not runtime, so a redeploy is required when they change

Vite doesn't bundle src/ assets referenced as string paths — use ES imports or public/ folder, not string paths in index.html

CORS needs credentials: true when using cookies/auth headers — origin: "\*" won't work

JWT refresh tokens should be rotated for maximum security

Prisma schema is the single source of truth — always run migrate dev after schema changes

Soft delete requires discipline — every query needs deletedAt: null filter, easy to forget

COD flow is complex — status transitions differ from online payments; needs its own workflow

Multi-language DB fields are simpler than join tables but less normalized

Production testing ≠ local testing — many bugs only appear in production

Cost-aware architecture — pick free tier for MVP, prepare upgrade path for scale

## Roadmap

☑ Product catalog with 20+ categories
☑ Multi-language support (6 languages)
☑ Shopping cart with voucher support
☑ Multi-step checkout
☑ Order management + status timeline
☑ COD payment workflow
☑ Admin dashboard with CRUD for all entities
☑ Multi-image upload & multi-unit pricing
☑ Product reviews (verified purchase)
☑ B2B bulk inquiry form
☑ Revenue report & accounting dashboard
☑ App download tracker
☑ Audit log for admin actions
☑ Auto-deploy to Vercel
□ Email confirmation for orders
□ WhatsApp notification integration
□ Advanced analytics dashboard with charts
□ Bulk product import (CSV/Excel)
□ MSDS document upload per product
□ Accessibility audit (WCAG 2.1)
□ Mobile app (React Native)
□ B2B tiered pricing (customer-specific rates)
License
All rights reserved.

## Author

<div align="center">
Rajul Firas

Software Engineer | System Designer

I use AI for implementation speed, but I verify every output against my own engineering standards — architecture, security, cost, performance, testing, production readiness, and monitoring. AI accelerates the typing; I own the decisions.

[![GitHub](https://img.shields.io/badge/GitHub-RAJULFIRAS-181717?style=for-the-badge&logo=github)](https://github.com/RAJULFIRAS)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/rajul-firas/)

[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:rajulviras@gmail.com)

</div>
<div align="center">
If this project is useful, consider giving it a star!
Built with engineering discipline and AI-assisted workflows

</div>
