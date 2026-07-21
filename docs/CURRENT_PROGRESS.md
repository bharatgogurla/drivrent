# Current Progress - DrivRent

This document details the development status of DrivRent, highlighting completed elements, design limitations, technical debt, and candidate roadmap items designed to elevate the project to a premium, production-grade standard.

---

## Completed Features

- **User Authentication, Profiles & RBAC:**
  - Standard user registration and password hashing using bcrypt.
  - Role selection tab ("User" or "Owner") during login and registration, sending role parameters in payload.
  - Server-side login validation verifying that user's selected login role matches database records exactly.
  - Automatic role-based post-login redirection: Users are sent to `/`, and Owners are sent to `/owner`.
  - Removed outdated "List Cars" / "Dashboard" navbar role switching controls, establishing clean routing boundaries.
  - JWT token generation upon login and registration, stored in browser local storage.
  - Cryptographic verification of JWT signatures using `jwt.verify` against `JWT_SECRET` for secure authentication.
  - Role-based authorization: `verifyOwner` middleware guarding all backend `/api/owner/*` routes.
  - Route guards on the frontend: using a unified `loading` state (which resets on token changes) to preserve dashboard authentication and state on page refreshes and prevent premature route redirection bugs.
  - Automatic URL redirection and interactive Login modal triggers when non-owners or guests navigate to `/owner/*` sub-routes manually, ensuring the Login modal closes properly after success.
  - Profile image uploads and optimizations hosted on ImageKit.
  - Role promotion: ability to switch roles from a standard user to a car owner instantly.
- **Authentication Navigation & History Security (Production-Ready):**
  - Browser Back button behavior is fixed; history entries are replaced on successful login, preventing owners and users from navigating back to unauthenticated screens.
  - Public routes automatically redirect authenticated owners back to the owner dashboard (`/owner`) to enforce complete visual separation.
  - Improved route guards with unified `PublicRoute`, `RenterProtectedRoute`, and `OwnerProtectedRoute` wrappers in `App.jsx`.
  - History replacement (`replace: true`) is implemented across all login redirects and protected route redirections to avoid history bloat and back-button vulnerabilities.
  - Session refresh persistence remains fully intact; route evaluation is deferred using the loading overlay during token verification.
- **Car Browsing & Filtering:**
  - Main landing pages displaying hero search forms, featured vehicles, and testimonial items.
  - List-view page with search keywords matching brand, model, category, or transmission type.
  - Specific location and date availability checking.
- **Booking Management:**
  - Detail page for individual vehicles showing capacity, fuel, transmission, and daily price.
  - Booking creation with automatic calculation of total cost based on the number of days between pickup and return.
  - User booking dashboard to list booking items.
- **Owner Dashboard Panel:**
  - Owner metrics displaying Total Cars, Total Bookings, Pending/Confirmed bookings count, and Total Revenue.
  - Listing tool to add a new car (supports multipart upload with file attachment and JSON parameters).
  - Toggles for active/inactive car availability.
  - Actions to confirm (approve) or cancel bookings.

---

## Features In Progress

- **Interactive Status UI:**
  - Currently, booking statuses exist as `"pending"`, `"confirmed"`, and `"cancelled"`. However, the frontend layout in `MyBooking.jsx` uses a binary ternary check:
    ```javascript
    booking.status === "confirmed" ? "bg-green-400/15 text-green-600" : "bg-red-400/15 text-red-600"
    ```
    This leaves `"pending"` bookings colored in red (giving users the incorrect impression of a cancellation). A dedicated warning/pending badge styling is partially missing in the UI.

---

## Planned Features

- **User-Side Booking Cancellation:**
  - Allow renters to request cancellation or directly cancel bookings that are still in the `"pending"` state.
- **Payment Gateway Integration:**
  - Integrate Stripe or Razorpay to process actual transactions before confirming bookings.
- **Renter & Owner Ratings:**
  - Add rating stars and written reviews for individual cars and owners.
- **Enhanced Search Filters:**
  - Add filter sliders for price range, car type, seating capacity, and fuel types directly on the search results page.

---

## Known Limitations & Technical Debt

- **Soft Delete Inconsistency:**
  - Removing a vehicle (`deleteCar`) sets `owner = null` and `isAvailable = false` in MongoDB:
    ```javascript
    car.owner = null;
    car.isAvailable = false;
    ```
    *Impact:* If the car has active bookings, trying to populate references to the owner or car on those bookings may lead to null pointer exceptions or broken layouts in both the user's booking history and the owner's log.
- **API Error Handling Conventions:**
  - Backend controller functions catch errors and send them back using HTTP Status 200 with `{ success: false, message: error.message }` rather than responding with standard semantic status codes (e.g. 400 Bad Request, 401 Unauthorized, 500 Server Error).
- **Hardcoded Relative Paths in Assets:**
  - The API call in `Sidebar.jsx` uses a relative path `api/owner/update-image` instead of `/api/owner/update-image` (missing starting forward slash), which could cause issues depending on route nestings if the baseURL config fails.

---

## Possible Improvements

- **Database Indexes:**
  - Implement indexes on `Car.location` and `Car.isAvailable` to optimize database lookup speed as the listings grow.
  - Create compound indexes on `Booking.pickupDate` and `Booking.returnDate` to speed up the availability checking queries.
- **Global Toast Refinement:**
  - Standardize error message responses to prevent raw database system exceptions (like duplicate key errors) from showing up directly to end-users in toast notifications.
- **Date Check Validations:**
  - Add client-side and server-side validation to block choosing return dates that occur prior to the pickup date, or booking dates in the past.

---

## Recruiter-Level Features (Interview Boosters)

- **Real-Time WebSockets Integration:**
  - Use Socket.io to notify owners in real-time when new bookings are placed, and to notify users instantly when an owner confirms or rejects their rental.
- **Interactive Map Search (Google Maps / Mapbox):**
  - Render an interactive map on the `/cars` search view, plotting pins for each vehicle to allow geographic searches.
- **Automated Booking Status Transitions (Cron Jobs):**
  - Implement a daily cron runner (using `node-cron` or BullMQ) to automatically mark bookings as "completed" once the return date passes, releasing the vehicle back to availability.
- **Comprehensive Unit & Integration Testing Suite:**
  - Write backend tests using Jest/Supertest and frontend component tests using Vitest/Playwright to demonstrate code reliability and test-driven development practices.

---

## Next Milestones

1. **API Status Standardisation:** Refactor controller responses to emit correct HTTP Status Codes (400, 401, 403, 404, 500) and standard JSON error formats.
2. **Pending UI Status Styling Fix:** Correct the ternary formatting in the frontend `MyBooking.jsx` file to properly render `"pending"` badges with a distinct yellow/orange style.
3. **Date Validation Safeguards:** Block booking requests that have negative durations or booking windows set in the past.
4. **Database Soft Delete Cascading:** Update delete handlers to resolve or cancel active bookings for soft-deleted cars.
