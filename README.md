
# FixFinder

> A web platform that connects customers with verified, nearby service providers (plumbers, electricians, appliance repair, etc.) and streamlines bookings.

## 🧠 Problem

Finding reliable providers is slow and uncertain; comparing price, quality, and availability is hard. Providers struggle to reach new customers and manage bookings.

## ✅ Solution

FixFinder lets customers browse services, compare providers, make bookings, and manage appointments. Providers can list services and track bookings. Admins can moderate users/services.

---

## 🚀 Tech Stack

* **Backend:** Spring Boot (Java), REST, JWT auth
* **Database:** MySQL / PostgreSQL (pick one)
* **Frontend:** Next.js 14+ (App Router), Tailwind CSS
* **Build/CI:** Maven/Gradle, GitHub Actions (suggested)
* **Testing/Docs:** JUnit, Postman

---

## 📦 Monorepo Structure (suggested)

```
fixfinder/
├─ backend/
│  ├─ src/main/java/com/example/BGF/
│  │  ├─ controller/        # AuthController, UserController, ServiceController, BookingController
│  │  ├─ models/            # User, AppService, Booking, enums
│  │  ├─ repository/        # Spring Data JPA repos
│  │  ├─ service/           # UserService, ServiceService, BookingService
│  │  ├─ security/          # JwtUtil, filters, WebSecurityConfig
│  │  └─ FixFinderApplication.java
│  └─ src/main/resources/
│     ├─ application.yml
│     └─ data.sql / schema.sql (optional seeds)
└─ frontend/                 # Next.js App Router
   ├─ app/
   │  ├─ admin-dashboard/    # admin-only UI (protected)
   │  ├─ contact/            # contact page (if any)
   │  ├─ Home/
   │  │  └─ page.jsx         # Home landing
   │  ├─ login/
   │  │  └─ page.jsx         # Login
   │  ├─ register/
   │  │  └─ page.jsx         # Signup
   │  ├─ layout.js           # Root layout
   │  └─ page.jsx            # (optional) root route
   ├─ components/
   │  ├─ CTASection.jsx
   │  ├─ FeaturedServices.jsx
   │  ├─ Footer.jsx
   │  ├─ Header.jsx
   │  ├─ Hero.jsx
   │  ├─ Navbar.jsx
   │  ├─ ServiceCard.jsx
   │  ├─ TestimonialSection.jsx
   │  └─ TrustIndicators.jsx
   ├─ context/
   │  └─ (AuthContext / AppContext files)
   ├─ utils/
   │  └─ (api helpers, fetch wrappers)
   ├─ public/
   ├─ globals.css
   ├─ next.config.mjs
   └─ jsconfig.json
```

---

## 🔐 Roles

* **CUSTOMER** – browses services, creates & manages bookings
* **PROVIDER** – manages their services, views bookings for their services
* **ADMIN** – moderates users/services, can view all bookings and perform admin tasks

---

## ⚙️ Backend Setup

Create `backend/src/main/resources/application.yml`:

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
```

**Run:**

```bash
cd backend
# Maven
mvn clean spring-boot:run
# OR Gradle
./gradlew bootRun
```

---

## 🌐 Frontend (Next.js) Setup

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8080
# If you host backend elsewhere, update this URL.
```

**Install & Run:**

```bash
cd frontend
npm install
npm run dev
# Default: http://localhost:3000
```

**Tailwind (if you haven’t added yet):**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🔌 REST API (as implemented)

### Auth

| Method | Path             | Purpose                   | Auth   |
| -----: | ---------------- | ------------------------- | ------ |
|   POST | `/auth/register` | Register user             | Public |
|   POST | `/auth/login`    | Login → `{ token, role }` | Public |

### Users

| Method | Path                         | Purpose               | Auth         |
| -----: | ---------------------------- | --------------------- | ------------ |
|    GET | `/users/admin`               | Get all users         | ADMIN        |
|    GET | `/users/{id}`                | Get user by ID        | JWT          |
|    GET | `/users/username/{username}` | Get user by username  | JWT          |
|   POST | `/users`                     | Create user (service) | Public/JWT\* |
|    PUT | `/users/{id}`                | Update user           | JWT          |
| DELETE | `/users/admin/{id}`          | Delete user           | ADMIN        |

> You already have `/auth/register`; keep `/users` `POST` for admin/internal flows to avoid duplication.

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

---

## 🧰 Frontend Integration Notes (Next.js App Router)

### 1) Fetch helper (frontend/utils/api.js)

```js
// frontend/utils/api.js
export const API = process.env.NEXT_PUBLIC_API_BASE;

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    // IMPORTANT for Next.js fetch caching:
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json().catch(() => ({}));
}
```

### 2) Auth Context (frontend/context/AuthContext.jsx)

```jsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('fx_token');
    const r = localStorage.getItem('fx_role');
    if (t) setToken(t);
    if (r) setRole(r);
  }, []);

  const login = ({ token, role }) => {
    localStorage.setItem('fx_token', token);
    localStorage.setItem('fx_role', role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('fx_token');
    localStorage.removeItem('fx_role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthCtx.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
```

### 3) Wire up provider (frontend/app/layout.js)

```jsx
import './globals.css';
import AuthProvider from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 4) Login page (frontend/app/login/page.jsx)

```jsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: form,
      });
      login(data); // {token, role}
      router.push('/Home'); // or dashboard
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded"
               placeholder="Username"
               value={form.username}
               onChange={e=>setForm({...form, username:e.target.value})}/>
        <input className="w-full border p-2 rounded"
               placeholder="Password" type="password"
               value={form.password}
               onChange={e=>setForm({...form, password:e.target.value})}/>
        {error && <p className="text-red-600">{error}</p>}
        <button className="px-4 py-2 bg-black text-white rounded">Login</button>
      </form>
    </div>
  );
}
```

### 5) Protected server actions (example usage)

When calling protected endpoints from client components, pass the token from `useAuth()`:

```jsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/utils/api';
import { useEffect, useState } from 'react';

export default function MyServicesPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!token) return;
    apiFetch('/services/user/my-services', { token })
      .then(setRows)
      .catch(console.error);
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Services</h1>
      <ul className="space-y-2">
        {rows.map(s => (
          <li key={s.id} className="border p-3 rounded">{s.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 6) Admin route protection (simple client guard)

```jsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardLayout({ children }) {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push('/login');
    else if (role !== 'ADMIN') router.push('/Home');
  }, [token, role, router]);

  return <>{children}</>;
}
```

> For stricter protection, add a `middleware.ts` to check cookies and redirect on the **edge**. If you keep tokens in `localStorage`, client guards like above are fine for v1; later, move to **HttpOnly cookies via Next.js Route Handlers** for better security.

---

## ▶️ Quick Start

1. **Backend**

   * Configure `application.yml` (DB + JWT secret)
   * `mvn spring-boot:run` (or `./gradlew bootRun`)

2. **Frontend**

   * Set `NEXT_PUBLIC_API_BASE` in `.env.local`
   * `npm install && npm run dev`

3. **Login & test flows**

   * Register via `/auth/register` or seed an ADMIN in `data.sql`
   * Login at `/login` → token saved
   * Browse services, create bookings, try the admin dashboard

---

## 🧪 Testing

* **Backend:** JUnit & Spring Boot Test (auth negative/positive, role gates, booking overlap rules if implemented)
* **Manual API:** Postman collection (generate from endpoints)
* **Frontend:** Exercise flows (login, list services, provider “my services”, booking create/update)

---

## 🔒 Security Checklist

* Store **BCrypt** password hashes
* Gate admin routes with Spring Security (`@PreAuthorize` / config)
* Set sensible JWT expiry; consider refresh tokens later
* Validate DTOs with `@Valid`
* CORS allow only your frontend origin in production

---

## 🧭 Roadmap

* **Sprint 0:** scaffolding & CI
* **Sprint 1:** Auth + Users
* **Sprint 2:** Services
* **Sprint 3:** Bookings
* **Sprint 4:** Profile, polish, demo

See `RESPONSIBILITIES.md` for PO/SM rotation and sprint deliverables.

---

## 🤝 Contributing

1. Create a feature branch
2. Commit with conventional messages
3. Open a PR to `main` with description & screenshots
4. CI must pass; at least one review required

---

## 📄 License

MIT (or your preferred)

---

### Appendix: Common API Calls (copy-ready)

**Register**

```http
POST /auth/register
Content-Type: application/json

{ "username": "alice", "password": "pass", "role": "CUSTOMER" }
```

**Login**

```http
POST /auth/login
Content-Type: application/json

{ "username": "alice", "password": "pass" }
```

*Response*

```json
{ "token": "JWT...", "role": "CUSTOMER" }
```

**List services (public)**

```http
GET /services/user/all
```

**Provider’s services (JWT)**

```http
GET /services/user/my-services
Authorization: Bearer <JWT>
```

**Create booking (JWT)**

```http
POST /api/bookings
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "serviceId": 12,
  "customerId": 34,
  "scheduledAt": "2025-09-10T10:00:00",
  "notes": "Washing machine not spinning"
}
```

include them exactly as code files.
