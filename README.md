
# FixFinder

> A web platform that connects customers with nearby, verified service providers (plumbers, electricians, appliance repair, etc.) and streamlines bookings.

## 🧠 Problem

Finding reliable providers is slow and uncertain; comparing price, quality, and availability is hard. Providers struggle to reach new customers and manage bookings.

## ✅ Solution

FixFinder lets customers search services, compare providers, make bookings, and manage appointments. Providers can list services, manage their offerings, and track bookings. Admins moderate users/services.

---

## 🚀 Tech Stack

* **Backend:** Spring Boot (Java), REST, JWT auth
* **Database:** (choose one) MySQL / PostgreSQL
* **Frontend:** React (recommended)
* **Build/CI:** Maven or Gradle, GitHub Actions (suggested)
* **Docs/Testing:** JUnit, Postman

---

## 📁 Project Structure (suggested)

```
fixfinder/
├─ backend/
│  ├─ src/main/java/com/example/BGF/
│  │  ├─ controller/        # AuthController, UserController, ServiceController, BookingController
│  │  ├─ models/            # User, AppService, Booking, roles/enums
│  │  ├─ repository/        # Spring Data JPA repos
│  │  ├─ service/           # UserService, ServiceService, BookingService
│  │  ├─ security/          # JwtUtil, filters, WebSecurityConfig
│  │  └─ FixFinderApplication.java
│  └─ src/main/resources/
│     ├─ application.yml
│     └─ data.sql / schema.sql (optional seeds)
└─ frontend/                 # React app (if in monorepo)
```

---

## 🔐 Roles

* **CUSTOMER** – browses services, creates & manages bookings
* **PROVIDER** – manages their services, sees bookings for their services
* **ADMIN** – moderates users/services, can view all bookings and perform admin tasks

---

## 🔧 Environment Variables

Create `backend/src/main/resources/application.yml` (or use `application.properties`) and a local `.env` for secrets.

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/fixfinder?useSSL=false&serverTimezone=UTC
    username: YOUR_DB_USER
    password: YOUR_DB_PASS
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080

app:
  jwt:
    secret: YOUR_SUPER_SECRET_KEY
    expirationMs: 86400000   # 1 day

# CORS (adjust for your frontend origin)
fixfinder:
  cors:
    allowed-origins: "http://localhost:5173,http://localhost:3000"
```

**Required keys**

* `app.jwt.secret` – HMAC secret for signing JWTs
* DB credentials & JDBC URL for MySQL/Postgres
* (Optional) CORS origins

---

## ▶️ Run Locally

### Backend

```bash
cd backend
# Maven
mvn clean spring-boot:run
# OR Gradle
./gradlew bootRun
```

### Frontend (if using React)

```bash
cd frontend
npm install
npm run dev   # or npm start / yarn dev depending on setup
```

Backend will serve on `http://localhost:8080`.
Frontend on `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

---

## 🔌 REST API (current controllers)

### Auth

| Method | Path             | Purpose                         | Auth   |
| -----: | ---------------- | ------------------------------- | ------ |
|   POST | `/auth/register` | Register user                   | Public |
|   POST | `/auth/login`    | Login → returns `{token, role}` | Public |

**Sample: Login**

```http
POST /auth/login
Content-Type: application/json

{
  "username": "alice",
  "password": "password123"
}
```

**Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "CUSTOMER"
}
```

### Users

| Method | Path                         | Purpose               | Auth         |
| -----: | ---------------------------- | --------------------- | ------------ |
|    GET | `/users/admin`               | Get all users         | ADMIN        |
|    GET | `/users/{id}`                | Get user by ID        | JWT          |
|    GET | `/users/username/{username}` | Get user by username  | JWT          |
|   POST | `/users`                     | Create user (service) | Public/JWT\* |
|    PUT | `/users/{id}`                | Update user           | JWT          |
| DELETE | `/users/admin/{id}`          | Delete user           | ADMIN        |

> \*You already have `/auth/register`. Keep `/users` create for admin or internal flows only to avoid duplication.

### Services (AppService)

| Method | Path                         | Purpose             | Auth   |
| -----: | ---------------------------- | ------------------- | ------ |
|   POST | `/services/admin/add`        | Add service         | ADMIN  |
|    GET | `/services/user/all`         | List all services   | Public |
|    GET | `/services/user/{id}`        | Get service by ID   | Public |
|    GET | `/services/user/my-services` | Provider’s services | JWT    |
|    PUT | `/services/admin/{id}`       | Update service      | ADMIN  |
| DELETE | `/services/admin/{id}`       | Delete service      | ADMIN  |

### Bookings

| Method | Path                                  | Purpose              | Auth  |
| -----: | ------------------------------------- | -------------------- | ----- |
|   POST | `/api/bookings`                       | Create booking       | JWT   |
|    GET | `/api/bookings`                       | List all bookings    | ADMIN |
|    GET | `/api/bookings/{id}`                  | Get booking by ID    | JWT   |
|    GET | `/api/bookings/customer/{customerId}` | Bookings by customer | JWT   |
|    GET | `/api/bookings/service/{serviceId}`   | Bookings by service  | JWT   |
|    PUT | `/api/bookings/{id}`                  | Update booking       | JWT   |
| DELETE | `/api/bookings/{id}`                  | Delete booking       | JWT   |

**Sample: Create Booking**

```http
POST /api/bookings
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "serviceId": 12,
  "customerId": 34,
  "scheduledAt": "2025-09-10T10:00:00",
  "notes": "Please check the washing machine spin cycle."
}
```

---

## 🧪 Testing

* **Unit/Integration:** JUnit + Spring Boot Test
* **Manual API tests:** Import the Postman collection (create one from the endpoints above)
* **Suggested checks:**

  * Auth happy/negative paths (wrong pass, expired token)
  * Role-based access (ADMIN vs CUSTOMER vs PROVIDER)
  * Booking overlap rules (if implemented)
  * Service ownership checks for providers

---

## 🔒 Security Notes

* Store hashed passwords (BCrypt).
* Use `@PreAuthorize` or filter chains for role gates (ADMIN endpoints).
* Set sensible JWT expiry; consider refresh tokens later.
* Validate request DTOs (`@Valid`) to prevent bad data.

---

## 📦 Seeds (optional)

Add `schema.sql` and/or `data.sql` for development:

* Sample **ADMIN**, **PROVIDER**, **CUSTOMER**
* A few **AppService** rows (Plumber, Electrician…)
* Example **Booking** rows

---

## 🧭 Roadmap (match with RESPONSIBILITIES.md)

* **Sprint 0:** setup & CI
* **Sprint 1:** Auth & Users
* **Sprint 2:** Services
* **Sprint 3:** Bookings
* **Sprint 4:** Polish & Demo

See `RESPONSIBILITIES.md` for PO/SM rotation, deliverables, and DoD.

---

## 🤝 Contributing

1. Fork & create a feature branch
2. Commit with conventional messages
3. Open a PR to `main` with description & screenshots
4. CI must pass; at least one review required

---

## 📄 License

MIT (or your preferred license)

---


