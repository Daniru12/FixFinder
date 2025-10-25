

# FixFinder: Team Roles & Sprint Responsibilities

👥 **Team Members:** (Replace with your actual names)

🔁 **Project:** 5-Sprint Agile Development (Sprint 0 + 4 dev sprints)

🎯 **Goal:** Build a Minimum Viable Product (MVP) for connecting customers with verified service providers (plumbers, electricians, appliance repair, etc.), including booking, service management, and authentication.

---

## 🧩 Overview: Team Roles & Responsibilities

| Role                   | General Responsibilities                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Product Owner (PO)** | Define the vision, refine the backlog, prioritize features based on stakeholder feedback.                                   |
| **Scrum Master (SM)**  | Facilitate sprint events (planning, daily standups, review, retro), support the team, remove blockers, enforce Scrum rules. |
| **Backend Dev**        | Implement Spring Boot APIs (Auth, Users, Services, Bookings), handle DB (MySQL/Mongo), integrate JWT & validation.          |
| **Frontend Dev**       | Build React UI (Signup/Login, Booking, Service listings), consume APIs, manage state and UI polish.                         |
| **QA/Tester**          | Write test cases, verify booking/auth flows, ensure usability, validate acceptance criteria.                                |

---

## 🔁 Role Rotation & Handover

* **PO** and **SM** rotate per sprint for shared ownership.
* Outgoing PO/SM writes **handover notes**: blockers, pending decisions, tech debts (in ClickUp/Trello).

---

## 🔌 REST API Endpoints (Developed)

Perfect 👍 — here’s your **updated API endpoints table**, now including your new **ProductController** routes, written in the same consistent documentation style.



| Method       | Path                                    | Purpose                            | Auth   |
| ------------ | --------------------------------------- | ---------------------------------- | ------ |
| **Auth**     |                                         |                                    |        |
| POST         | `/auth/register`                        | Register user                      | Public |
| POST         | `/auth/login`                           | Login → JWT + role                 | Public |
| **Users**    |                                         |                                    |        |
| GET          | `/users/admin`                          | Get all users                      | Admin  |
| GET          | `/users/{id}`                           | Get user by ID                     | JWT    |
| GET          | `/users/username/{username}`            | Get user by username               | JWT    |
| PUT          | `/users/{id}`                           | Update user                        | JWT    |
| DELETE       | `/users/admin/{id}`                     | Delete user                        | Admin  |
| **Services** |                                         |                                    |        |
| POST         | `/services/admin/add`                   | Add service                        | Admin  |
| GET          | `/services/user/all`                    | List all services                  | Public |
| GET          | `/services/user/{id}`                   | Get service by ID                  | Public |
| GET          | `/services/user/my-services`            | Provider’s services                | JWT    |
| PUT          | `/services/admin/{id}`                  | Update service                     | Admin  |
| DELETE       | `/services/admin/{id}`                  | Delete service                     | Admin  |
| **Bookings** |                                         |                                    |        |
| POST         | `/api/bookings`                         | Create booking                     | JWT    |
| GET          | `/api/bookings`                         | List all bookings                  | Admin  |
| GET          | `/api/bookings/{id}`                    | Get booking by ID                  | JWT    |
| GET          | `/api/bookings/customer/{id}`           | Get bookings by customer           | JWT    |
| GET          | `/api/bookings/service/{id}`            | Get bookings by service            | JWT    |
| PUT          | `/api/bookings/{id}`                    | Update booking                     | JWT    |
| DELETE       | `/api/bookings/{id}`                    | Delete booking                     | JWT    |
| **Reviews**  |                                         |                                    |        |
| POST         | `/reviews/add`                          | Add a new review                   | JWT    |
| GET          | `/reviews`                              | Get all reviews                    | Public |
| GET          | `/reviews/{id}`                         | Get review by ID                   | Public |
| PUT          | `/reviews/{id}`                         | Update review                      | JWT    |
| DELETE       | `/reviews/admin/{id}`                   | Delete review                      | Admin  |
| GET          | `/reviews/service/{serviceId}`          | Get reviews for a service          | Public |
| GET          | `/reviews/user/{userId}`                | Get reviews by user                | JWT    |
| GET          | `/reviews/service/{serviceId}/average`  | Get average rating for a service   | Public |
| GET          | `/reviews/admin/all`                    | Get all reviews (Admin panel)      | Admin  |
| **Products** |                                         |                                    |        |
| POST         | `/products/create`                      | Create product (Admin or Provider) | JWT    |
| GET          | `/products`                             | Get all active products            | Public |
| GET          | `/products/all`                         | Get all products (active/inactive) | Admin  |
| GET          | `/products/{id}`                        | Get product by ID                  | Public |
| GET          | `/products/category/{category}`         | Get products by category           | Public |
| GET          | `/products/search?name={name}`          | Search products by name            | Public |
| GET          | `/products/my-products`                 | Get provider’s own products        | JWT    |
| PUT          | `/products/{id}`                        | Update product                     | JWT    |
| PUT          | `/products/{id}/stock?stock={quantity}` | Update product stock quantity      | JWT    |
| DELETE       | `/products/{id}`                        | Delete product                     | JWT    |
| GET          | `/products/admin/all`                   | Get all products (Admin)           | Admin  |
| GET          | `/products/admin/provider/{providerId}` | Get products by provider (Admin)   | Admin  |


---

## 🗓️ Sprint Plans

### 🗓️ Sprint 0 — Setup & Planning

**PO = X | SM = Y**

* Spring Boot skeleton, MySQL schema, React init with Tailwind.
* CI/CD pipelines (GitHub Actions).
* Backlog creation & prioritization.

**Deliverables:** Working skeleton (BE + FE), backlog in ClickUp, environments ready.

---

### 🗓️ Sprint 1 — Authentication & User Management

* Implement `/auth/register`, `/auth/login` with JWT.
* User CRUD endpoints.
* Frontend signup/login forms, session storage.

**Deliverables:** Register/login/logout works end-to-end.

---

### 🗓️ Sprint 2 — Service Management

* Add/list/update/delete services (`/services/*`).
* Provider can manage their own services.
* FE pages: Service catalog, My Services.

**Deliverables:** Service CRUD + UI integration.

---

### 🗓️ Sprint 3 — Bookings & Scheduling

* Booking API (create, list, update, cancel).
* FE: Booking form, My Bookings page.
* Role-based access: customers vs providers vs admin.

**Deliverables:** Booking flow integrated.

---

### 🗓️ Sprint 4 — Polish, QA & Demo

* Profile page, booking summary, service history.
* Error handling, validations, responsive design.
* QA testing, documentation, and demo prep.

**Deliverables:** MVP complete + demo ready.

---

## ✅ Definition of Done (DoD)

* Code merged to `main` via PR with review.
* Passing unit/integration tests.
* API tested via Postman.
* FE validated across browsers/devices.
* Deployed to staging.
* Docs updated (README, API docs).

---

## 🧭 Risks & Mitigations

* **Unverified providers:** Require admin approval for new services.
* **Booking conflicts:** Validate overlapping time slots.
* **JWT security:** Refresh tokens, expiry handling.
* **Scaling:** Pagination for services/bookings.

---

## 🚫 Out of Scope (v1)

* Payment gateway integration.
* Push/email notifications.
* Review/rating system.
* Advanced analytics.
