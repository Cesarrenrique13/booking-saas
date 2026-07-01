# Booking SaaS API

A robust REST API for a multi-business booking and appointment scheduling platform built with **NestJS 11** and **PostgreSQL 17**.

This system is engineered following **Clean Architecture** principles, implementing the **Repository Pattern** to decouple business logic from the ORM, strict **Ownership Verification (IDOR Prevention)**, and **JWT Authentication with Role-Based Access Control (RBAC)**.

---

## 🛠️ Tech Stack

| Layer / Component | Technology / Framework |
| :--- | :--- |
| **Framework** | NestJS 11 |
| **ORM** | TypeORM 0.3 |
| **Database** | PostgreSQL 17 |
| **Authentication** | JWT (Passport) + Role-Based Access Control (RBAC) |
| **Documentation** | Swagger (OpenAPI) |
| **Containerization** | Docker & Docker Compose |
| **Language** | TypeScript (Strict Mode) |

---

## 🚀 Features

- **Secure Authentication:** JWT-based auth flow with user registration, login, and token refresh via auth status check.
- **Role-Based Access Control (RBAC):** Granular user roles: `user`, `admin`, and `super-user`.
- **Business Multi-Tenancy:** Full CRUD operations managing Users, Businesses, and Services.
- **Bookings Engine:** Concurrent booking creation with manual ACID transactions to prevent race conditions / double-booking.
- **Unified Pagination:** Standardized global pagination across all listing endpoints.
- **Data Longevity:** Soft deletes implemented globally across all database entities.
- **IDOR Prevention:** Dynamic ownership validation ensures users can only access, modify, or delete their own resources.
- **Decoupled Architecture:** Custom repository pattern across domain modules separating core business rules from data persistence.
- **Interactive Documentation:** Automated OpenAPI generation exposed via Swagger UI at `/api`.
- **Database Seeding:** Included CLI seeding command populated with 300 mock users + an admin account for instant testing.

---

## 📐 System Architecture

```
Client ──> Controller ──> Service ──> Repository ──> TypeORM ──> PostgreSQL
                                  │
                                  ├──> DTO Validation (class-validator)
                                  │
                                  └──> Auth Guard + Role Guard + Ownership Verification
```

Domain modules (Users, Businesses, Services, Bookings) follow the decoupled **Controller → Service → Repository** flow:

| Layer | Core Responsibility |
| :--- | :--- |
| **Controller** | Handles incoming HTTP requests, binds data transfer objects (DTOs), and enforces Guards/Pipes. |
| **Service** | Core domain business logic execution and granular resource ownership validation. |
| **Repository** | Data persistence layer isolating custom SQL queries and TypeORM operations. |

---

## ⏱️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Cesarrenrique13/booking-saas
cd booking-saas
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
```bash
cp .env.template .env
# Open .env and populate it with your local environment values
```

### 4. Spin up the Database Container
```bash
docker compose up -d
```

### 5. Seed the Database (Optional)
```bash
pnpm seed
```

### 6. Run the Application in Development Mode
```bash
pnpm start:dev
```

### 7. Explore the API Documentation
Open your browser and navigate to: `http://localhost:3000/api` to interact with the Swagger UI.

---

## 💻 Available Commands

| Command | Description |
| --- | --- |
| `pnpm start:dev` | Starts the application with hot-reload enabled. |
| `pnpm build` | Compiles the TypeScript application into production-ready code inside `/dist`. |
| `pnpm lint` | Runs ESLint and Prettier auto-formatting across the codebase. |
| `pnpm test` | Executes unit test suites using Jest. |
| `pnpm test:e2e` | Runs end-to-end (E2E) integration test suites. |
| `pnpm seed` | Populates the PostgreSQL database with mock testing data. |

---

## 🛣️ Main Endpoints

| Method | Route | Auth Required? | Description |
| --- | --- | --- | --- |
| **POST** | `/booking/auth/register` | ❌ No | Registers a new user account. |
| **POST** | `/booking/auth/login` | ❌ No | Authenticates a user and returns a JWT token. |
| **GET** | `/booking/auth/check-status` | 🔒 Yes | Returns authenticated user data along with a fresh JWT token. |
| **GET** | `/booking/users` | ❌ No | Lists all registered users (paginated). |
| **GET** | `/booking/users/:term` | ❌ No | Finds a user by UUID, email, or phone. |
| **PATCH** | `/booking/users/:id` | ❌ No | Updates a user's profile information. |
| **DELETE** | `/booking/users/:id` | ❌ No | Soft-deletes a user record. |
| **POST** | `/booking/businesses` | 🔒 Yes | Creates a new business entity. |
| **GET** | `/booking/businesses` | ❌ No | Lists all available businesses (paginated). |
| **GET** | `/booking/businesses/:term` | ❌ No | Searches a business by UUID or slug. |
| **PATCH** | `/booking/businesses/:id` | 🔒 Yes | Updates business details (Ownership enforced). |
| **DELETE** | `/booking/businesses/:id` | 🔒 Yes | Soft-deletes a business (Ownership enforced). |
| **POST** | `/booking/services/:businessId` | 🔒 Yes | Appends a service to a specific business (Owner only). |
| **GET** | `/booking/services` | ❌ No | Lists all available services globally. |
| **GET** | `/booking/services/:term` | ❌ No | Searches a service by UUID or name. |
| **PATCH** | `/booking/services/:id` | 🔒 Yes | Updates service details (Ownership enforced). |
| **DELETE** | `/booking/services/:id` | 🔒 Yes | Soft-deletes a service (Ownership enforced). |
| **POST** | `/booking/bookings` | 🔒 Yes | Creates a new booking (atomic transaction). |
| **GET** | `/booking/bookings` | 🔒 Yes | Lists user's or business's bookings (paginated). |
| **GET** | `/booking/bookings/:id` | 🔒 Yes | Gets a specific booking by ID. |
| **PATCH** | `/booking/bookings/:id` | 🔒 Yes | Updates booking status (Ownership enforced). |
| **DELETE** | `/booking/bookings/:id` | 🔒 Yes | Cancels a booking (Ownership enforced). |

---

## 📦 Module Status

- [x] `auth/` — Fully functional (JWT + Custom Guards)
- [x] `users/` — Fully functional (Repository Pattern)
- [x] `businesses/` — Fully functional (Repository + Ownership Verification)
- [x] `services/` — Fully functional (Repository + Ownership Verification)
- [x] `bookings/` — Fully functional (Transactions + Ownership + Concurrency Control)
- [x] `seed/` — Fully functional (CLI Data Seeding)
- [x] `common/` — Fully functional (Pagination DTO + Interface + DB error handling)
- [ ] `payments/` — Not yet implemented (Stripe integration pending)

---

## 🗺️ Roadmap / Upcoming Steps

- [ ] Complete robust Unit and Integration testing layers (Jest).
- [ ] Establish automated CI/CD pipelines via GitHub Actions.
- [ ] Integrate Stripe API payment gateway.
- [ ] Multi-region cloud deployment.

---

## 👤 Author

**César Salazar** — Backend Developer

- **LinkedIn:** [linkedin.com/in/CesarSalazar](https://www.linkedin.com/in/cesar-salazar-223956368/)
- **GitHub:** [github.com/Cesarrenrique13](https://github.com/Cesarrenrique13)
