# 📋 Care.xyz — Requirement Document

**Baby Sitting & Elderly Care Service Platform**
Version: 1.0 | Date: February 2026 | Type: Portfolio-Ready Full-Stack Web Application

---

## 🎯 Project Vision

Care.xyz is a web application that connects families with trusted, verified caregivers for children, elderly, and special-needs individuals. Unlike a basic CRUD assignment, this platform demonstrates real-world architecture, security, and UX thinking — the exact qualities that make recruiters say "hire this person."

---

## 🏗️ Technical Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15+ (App Router, Server Components, Server Actions, SSR/CSR/SSG) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + daisyUI + shadcn/ui |
| Database | PostgreSQL (Supabase) |
| Authentication | NextAuth.js- Credintial Login,Logout (Google OAuth) |
| Payment | Stripe Checkout (test mode) |
| Email | Resend + React Email |
| File Upload | Cloudinary |
| Server State | TanStack Query |
| Client State | Redux |
| Forms | React Hook Form + Zod |
| Testing | React Testing Library |
| Deployment | Vercel (manual) |

---

## 👥 User Roles & Permissions

### Role 1: Client (Family)

- Register / Login via Google
- Browse & search caregivers
- Book services
- Pay via Stripe Checkout
- Manage bookings (view, cancel, reschedule)
- Leave reviews & ratings
- Manage profile & family members

### Role 2: Caregiver

- Register with professional details
- Manage profile (bio, certifications, availability, hourly rate)
- Accept / decline booking requests
- View assigned bookings & earnings
- Receive ratings & reviews

### Role 3: Admin

- Dashboard with analytics (revenue, bookings, users)
- Approve / reject caregiver applications
- Manage all users (view, suspend, delete)
- Manage services & categories
- View payment history
- Content management (testimonials, FAQ)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── page.tsx                      # Homepage
│   │   ├── services/page.tsx             # All services
│   │   ├── services/[serviceId]/page.tsx # Service detail
│   │   ├── caregivers/page.tsx           # Browse caregivers
│   │   ├── caregivers/[id]/page.tsx      # Caregiver profile
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── booking/[serviceId]/page.tsx  # Booking flow
│   │   ├── my-bookings/page.tsx          # Client bookings
│   │   ├── my-bookings/[id]/page.tsx     # Booking detail
│   │   ├── profile/page.tsx              # User profile
│   │   ├── profile/family/page.tsx       # Family members
│   │   └── layout.tsx                    # Auth guard wrapper
│   ├── (caregiver)/
│   │   ├── dashboard/page.tsx            # Caregiver dashboard
│   │   ├── assignments/page.tsx          # Assigned bookings
│   │   ├── earnings/page.tsx             # Earnings tracker
│   │   ├── availability/page.tsx         # Calendar management
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── dashboard/page.tsx            # Admin overview
│   │   ├── users/page.tsx                # User management
│   │   ├── caregivers/pending/page.tsx   # Caregiver approvals
│   │   ├── bookings/page.tsx             # All bookings
│   │   ├── payments/page.tsx             # Payment history
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── stripe/checkout/route.ts      # Create Checkout session
│   ├── not-found.tsx                     # Custom 404
│   ├── error.tsx                         # Global error boundary
│   ├── loading.tsx                       # Global loading
│   └── layout.tsx                        # Root layout + providers
├── components/
│   ├── ui/                               # shadcn/ui primitives
│   ├── layout/                           # Navbar, Footer, Sidebar
│   ├── booking/                          # Booking-related components
│   ├── caregiver/                        # Caregiver cards, profiles
│   ├── forms/                            # Form components
│   └── shared/                           # Reusable (Rating, StatusBadge)
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── supabase.ts                       # Supabase client
│   ├── stripe.ts                         # Stripe helpers
│   ├── email.ts                          # Resend helpers
│   ├── validators/                       # Zod schemas
│   ├── utils.ts                          # Helper functions
│   └── constants.ts                      # App-wide constants
├── server/
│   └── actions/                          # Server Actions
│       ├── auth.actions.ts
│       ├── booking.actions.ts
│       ├── caregiver.actions.ts
│       ├── payment.actions.ts
│       └── review.actions.ts
├── store/                                # Redux slices & store setup
├── hooks/                                # Custom React hooks
├── types/                                # TypeScript types/interfaces
├── emails/                               # React Email templates
│   ├── BookingConfirmation.tsx
│   └── WelcomeEmail.tsx
└── tests/                                # React Testing Library tests
```

---

## 📄 Pages & Routes — Detailed Requirements

### PAGE 1: Homepage (`/`)

**Purpose:** First impression — must immediately communicate trust, professionalism, and ease of use.

**Section 1.1 — Hero Banner**

- Compelling headline (e.g., "Trusted Care for Your Loved Ones")
- Subheadline explaining the platform's value proposition
- Quick Search Bar: Select service type (Baby Care / Elderly Care / Special Care) + Location → redirects to `/caregivers?type=X&location=Y`
- Primary CTA: "Find a Caregiver" → `/caregivers`
- Secondary CTA: "Become a Caregiver" → `/register?role=caregiver`
- Background: high-quality image

**Section 1.2 — How It Works**

- 3-step visual process:
  1. **Search** — Find caregivers by service type and location
  2. **Book** — Choose your caregiver, select dates, and pay securely
  3. **Relax** — Your loved one is in trusted hands
- Each step: icon + title + one-line description

**Section 1.3 — Services Overview**

- 3 service cards (Baby Care, Elderly Care, Special/Sick Care)
- Each card: icon/illustration, title, short description, starting price, "Learn More" link → `/services/[serviceId]`
- Hover effect with subtle scale/shadow transition

**Section 1.4 — Why Choose Us / Trust Signals**

- Stats counter section:
  - "500+ Verified Caregivers"
  - "10,000+ Bookings Completed"
  - "4.8★ Average Rating"
  - "24/7 Support"
- Each stat with a relevant icon (seed database with demo numbers)

**Section 1.5 — Featured Caregivers**

- Horizontal scroll / carousel of top-rated caregivers
- Each card: photo, name, specialization, rating, years of experience, hourly rate
- "View Profile" button → `/caregivers/[id]`
- Only show caregivers with "Verified" status

**Section 1.6 — Testimonials**

- Client testimonials carousel (auto-play with pause on hover)
- Each testimonial: client photo, name, rating stars, quote text, service used
- Seed with 6–8 realistic testimonials

**Section 1.7 — CTA Banner**

- Full-width section: "Ready to find the perfect caregiver?"
- Dual buttons: "Book Now" + "Join as Caregiver"

**Section 1.8 — Footer**

- Site links organized in columns (Services, Company, Support, Legal)
- Social media icons
- Contact info (email, phone)
- Newsletter subscription input
- "© 2026 Care.xyz. All rights reserved."

**Homepage Technical Requirements:**

- SEO Metadata: Dynamic `<title>`, `<meta description>`, Open Graph tags
- Performance: Hero image optimized with `next/image`, lazy-load below-the-fold sections
- Server Component: Entire page is a Server Component (no `"use client"` at page level)
- Data: Featured caregivers fetched server-side from Supabase

---

### PAGE 2: Services Listing (`/services`)

- Grid of all available service categories
- Each card: image, title, description, number of available caregivers, price range
- Filter sidebar or top bar: service type, price range
- Breadcrumb navigation

---

### PAGE 3: Service Detail (`/services/[serviceId]`)

**Purpose:** Convince the user to book this specific service.

**Content:**

- Hero: Service title, large cover image, rating, number of bookings
- Description: Detailed description of what the service includes
- What's Included: Checklist of features (e.g., "Meal preparation", "Medication reminders")
- Pricing: Starting hourly rate, daily rate, pricing tiers
- Available Caregivers: Grid of top caregivers for this service type (3–6 cards)
- FAQ: Collapsible accordion of common questions
- Reviews: Recent reviews from clients who used this service
- CTA: Sticky "Book This Service" button → if logged in: `/booking/[serviceId]`, else: `/login?callbackUrl=/booking/[serviceId]`

**Technical:**

- Dynamic Metadata: `generateMetadata()` for SEO — service name in title, description
- Static Generation: Use `generateStaticParams()` for known service IDs

---

### PAGE 4: Browse Caregivers (`/caregivers`)

**Purpose:** Allow families to discover and compare caregivers.

**Features:**

- Search bar with text search (name, keyword)
- Filter Panel (sidebar on desktop, bottom sheet on mobile):
  - Service type (multi-select checkboxes)
  - Location: Division → District → City (cascading dropdowns)
  - Price range: slider (min/max)
  - Rating: minimum star rating
  - Experience: years of experience range
  - Gender preference
  - Languages spoken
  - Verification status: "Verified Only" toggle
- Sort by: Rating (high→low), Price (low→high), Experience, Newest
- View toggle: Grid view / List view
- Caregiver cards showing: profile photo, name + verified badge ✅, specialization tags, star rating + review count, hourly rate, location (district), short bio (truncated), "View Profile" button
- Pagination: Load More button or page numbers
- Empty state: Friendly message + suggestion to broaden filters
- URL state: All filters reflected in URL query params (shareable, bookmarkable)

**Technical:**

- Server Component with `searchParams`
- Supabase query with filtering, sorting, pagination
- Debounced search input (300ms)
- Skeleton loading states during data fetch
- TanStack Query for client-side filter updates

---

### PAGE 5: Caregiver Profile (`/caregivers/[id]`)

**Purpose:** Full profile to help families make a hiring decision.

**Content:**

- Profile Header: Large photo, full name, verification badges, "Available Now" indicator, location, member since date
- Bio Section: Caregiver's personal description, experience summary
- Details Grid: Services offered (with individual rates), years of experience, languages spoken, certifications (CPR, First Aid, etc.), education, age
- Availability Calendar: Week view showing available time slots (read-only for client)
- Reviews Section: Overall rating breakdown (5★: XX%, 4★: XX%, etc.), individual reviews with client name/date/rating/text, pagination for reviews
- CTA: "Book [Name]" button → `/booking/[serviceId]?caregiver=[id]`
- Share: Copy link / share to social media

**Technical:**

- `generateMetadata()` with caregiver name
- Server Component with data fetching from Supabase

---

### PAGE 6: Booking Flow (`/booking/[serviceId]`) — 🔒 Private Route

**Purpose:** Multi-step booking process that feels smooth and professional.

**Step 1: Select Service & Caregiver**

- If `?caregiver=[id]` is in URL, pre-select that caregiver
- Otherwise: show top 5 recommended caregivers for this service
- Caregiver card with: photo, name, rate, rating
- Allow changing selection

**Step 2: Schedule**

- Date picker: Select start date (disable past dates, respect caregiver availability)
- Duration selector:
  - Type: Hourly / Daily / Weekly
  - Hourly: select time slots (e.g., 9 AM – 1 PM)
  - Daily: select number of days
  - Weekly: select number of weeks
- Show caregiver's availability

**Step 3: Location**

- Division → District → City → Area: Cascading dependent dropdowns (seeded Bangladesh geo data)
- Detailed Address: Text input for house/road details
- Special Instructions: Textarea for additional notes
- Save Address: Checkbox to save for future bookings

**Step 4: Review & Pay**

- Booking Summary Card:
  - Service type, caregiver name & photo, date & time, duration, location
  - Breakdown: Base rate: ৳X × Y hours = ৳Z, Platform fee (5%): ৳A, Total: ৳B
- Promo Code: Input field + "Apply" button (validate via server action)
- Terms checkbox: "I agree to the Terms of Service and Cancellation Policy"
- "Confirm & Pay" button → redirects to Stripe Checkout

**On Successful Payment:**

1. Stripe Checkout success URL hit
2. Create booking in database with status = `CONFIRMED`
3. Create payment record
4. Send email to client: booking confirmation (Resend + React Email)
5. Redirect to `/my-bookings/[bookingId]` with success toast

**If payment cancelled:**

- Redirect back to booking page with message

**Technical:**

- Multi-step form with React Hook Form + Zod per step
- Progress indicator (Step 1 of 4, Step 2 of 4…)
- Form state managed in Redux (persist across steps, survives navigation)
- Dynamic cost calculation on the client side
- Server Action for booking creation + Stripe Checkout session creation
- Loading states per step

---

### PAGE 7: My Bookings (`/my-bookings`) — 🔒 Private Route

**Features:**

- Tabs: Upcoming | Ongoing | Completed | Cancelled
- Booking Card: Service type icon + name, caregiver photo + name, date & time, duration, location (short), total cost
- Status Badge: color-coded — PENDING → Yellow, CONFIRMED → Blue, ONGOING → Green pulse, COMPLETED → Gray, CANCELLED → Red
- Actions:
  - "View Details" → `/my-bookings/[id]`
  - "Cancel" → Confirmation modal with cancellation reason
  - "Reschedule" → Date/time picker modal (only for CONFIRMED bookings, 24h+ before service)
  - "Leave Review" → Review modal (only for COMPLETED bookings)
- Empty states for each tab with relevant illustrations
- Sort: by date (newest first / oldest first)
- Search: search bookings by caregiver name or booking ID

---

### PAGE 8: Booking Detail (`/my-bookings/[id]`) — 🔒 Private Route

- Full booking information:
  - Booking ID (formatted: BK-XXXXXX)
  - Service details
  - Caregiver full info with link to profile
  - Schedule (date, time, duration)
  - Location (full address)
  - Special instructions
  - Status with timeline (Created → Confirmed → Ongoing → Completed)
  - Payment breakdown
  - Cancellation policy text
- Actions based on status:
  - CONFIRMED: Cancel, Reschedule
  - COMPLETED: Leave Review, Rebook Same Caregiver
  - CANCELLED: View status

---

### PAGE 9: Authentication

**Login Page (`/login`)**

- Google OAuth button ("Continue with Google") — primary method
- "Don't have an account? Register" link
- Redirect to intended page after login (use `callbackUrl`)

**Registration Page (`/register`)**

- Step 1 — Account Type: "I'm looking for care" / "I want to provide care"
- Step 2 — Personal Info:
  - Full Name (required)
  - Email (required, unique validation)
  - Phone Number (required, BD format validation)
  - NID Number (required for caregivers)
  - Profile Photo upload via Cloudinary (optional for clients, required for caregivers)
- Step 3 — Security:
  - Password with real-time strength indicator
  - Validation: 6+ characters, 1 uppercase, 1 lowercase, 1 number
  - Confirm Password (must match)
- Step 4 (Caregivers only) — Professional Info:
  - Services offered (multi-select)
  - Years of experience
  - Certifications (file upload via Cloudinary)
  - Hourly rate
  - Bio / About me
  - Availability (weekly calendar)
- On Submit:
  - Client: Create account → send welcome email → redirect to homepage
  - Caregiver: Create account with status: `PENDING_APPROVAL` → send welcome email → redirect to "Awaiting Approval" page
- Validation: All fields validated with Zod on both client and server
- Google OAuth: Auto-create account on first Google login, prompt for role selection

**Auth Guard Requirements:**

- Private routes wrapped in auth middleware — redirect to `/login?callbackUrl=...`
- Logged-in users should NOT see login/register pages → redirect to homepage
- Role-based access: Admin routes only for admin users, caregiver routes only for caregivers
- Session persistence: User stays logged in on page refresh

---

### PAGE 10: User Profile (`/profile`) — 🔒 Private Route

- View/Edit mode toggle
- Personal Info: Name, email, phone, profile photo, NID
- Saved Addresses: List of saved locations (add/edit/delete)
- Family Members: Add family members with name, age, relationship, special needs (used during booking)
- Account Actions: Change password, Delete account (with confirmation)

---

### PAGE 11: Caregiver Dashboard (`/caregiver/dashboard`) — 🔒 Caregiver Route

- Overview Cards: Total earnings (this month), upcoming bookings count, average rating, completion rate
- Upcoming Assignments: Next 5 bookings with quick details
- Recent Reviews: Last 3 reviews received
- Quick Actions: "Update Availability", "Edit Profile", "View Earnings"

---

### PAGE 12: Caregiver Assignments (`/caregiver/assignments`)

- Tabs: Pending (accept/decline), Upcoming, Ongoing, Completed
- Each booking card: client name, service, date, location, pay amount
- Accept: Booking status → `CONFIRMED`, notify client
- Decline: Booking status → `CANCELLED`, notify client

---

### PAGE 13: Caregiver Earnings (`/caregiver/earnings`)

- Total earnings with period selector (this week / month / year / all time)
- Earnings chart (line graph by month) — simple chart
- Transaction history table: booking ID, date, service, amount, status (paid/pending)

---

### PAGE 14: Caregiver Availability (`/caregiver/availability`)

- Interactive weekly calendar
- Click time slots to toggle available/unavailable
- Bulk actions: "Mark entire day available/unavailable"
- Save with Server Action → updates database
- Vacation mode: Block out date ranges

---

### PAGE 15: Admin Dashboard (`/admin/dashboard`) — 🔒 Admin Route

**Analytics Overview:**

- KPI Cards: Total Revenue, Total Bookings, Active Users, Active Caregivers
- Charts: Revenue trend (line chart), bookings by service type (donut chart)
- Recent Activity Feed: Latest bookings, registrations, reviews

**Admin Sub-Pages:**

- **User Management (`/admin/users`):** Table with Name, Email, Role, Status, Joined, Actions. Search & filter by role/status. Actions: View, Suspend, Delete.
- **Caregiver Approvals (`/admin/caregivers/pending`):** List of pending applications. Each card: Photo, name, services, experience, certifications. Actions: Approve ✅ / Reject ❌ (with reason). On approval: update status, send email. On rejection: send email with reason.
- **Booking Management (`/admin/bookings`):** Table of all bookings with filters (status, date range, service type). Actions: View details, update status.
- **Payment History (`/admin/payments`):** Table: Booking ID, Client, Caregiver, Amount, Platform Fee, Status, Date. Filters: date range, status.

---

### PAGE 16: Error Page (404 — `not-found.tsx`)

- Custom illustration (caring/friendly theme)
- "Oops! This page doesn't exist" message
- "Go Back Home" button

---

### PAGE 17: Error Boundary (`error.tsx`)

- Friendly error message
- "Try Again" button (reset error boundary)
- "Go Home" fallback button

---

## 🗄️ Database Schema

Supabase tables (conceptual — adapt column names as needed):

```sql
-- ENUMS
-- Role: CLIENT, CAREGIVER, ADMIN
-- UserStatus: ACTIVE, SUSPENDED, DELETED
-- VerificationStatus: PENDING, APPROVED, REJECTED
-- BookingStatus: PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED, PAYMENT_FAILED
-- PaymentStatus: UNPAID, PAID, REFUNDED
-- DurationType: HOURLY, DAILY, WEEKLY
-- DiscountType: PERCENTAGE, FIXED

-- TABLES

users (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  email_verified  TIMESTAMPTZ,
  phone           TEXT,
  nid_number      TEXT,
  image           TEXT,
  password        TEXT,
  role            TEXT DEFAULT 'CLIENT',
  status          TEXT DEFAULT 'ACTIVE',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
)

caregiver_profiles (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio                 TEXT,
  experience          INT DEFAULT 0,
  hourly_rate         FLOAT NOT NULL,
  certifications      TEXT[],
  languages           TEXT[],
  services_offered    TEXT[],
  verification_status TEXT DEFAULT 'PENDING',
  availability        JSONB,
  avg_rating          FLOAT DEFAULT 0,
  total_reviews       INT DEFAULT 0,
  total_bookings      INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
)

services (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  short_description   TEXT,
  image               TEXT,
  base_hourly_rate    FLOAT,
  base_daily_rate     FLOAT,
  features            TEXT[],
  faqs                JSONB,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
)

bookings (
  id                    TEXT PRIMARY KEY,
  booking_number        TEXT UNIQUE NOT NULL,
  client_id             TEXT REFERENCES users(id),
  caregiver_id          TEXT REFERENCES users(id),
  service_id            TEXT REFERENCES services(id),
  start_date            TIMESTAMPTZ NOT NULL,
  end_date              TIMESTAMPTZ NOT NULL,
  duration_type         TEXT NOT NULL,
  duration_value        INT NOT NULL,
  division              TEXT,
  district              TEXT,
  city                  TEXT,
  area                  TEXT,
  address               TEXT,
  special_instructions  TEXT,
  base_amount           FLOAT NOT NULL,
  platform_fee          FLOAT NOT NULL,
  discount              FLOAT DEFAULT 0,
  total_amount          FLOAT NOT NULL,
  status                TEXT DEFAULT 'PENDING',
  payment_status        TEXT DEFAULT 'UNPAID',
  stripe_payment_id     TEXT,
  promo_code            TEXT,
  cancelled_at          TIMESTAMPTZ,
  cancel_reason         TEXT,
  completed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
)

payments (
  id                        TEXT PRIMARY KEY,
  booking_id                TEXT UNIQUE REFERENCES bookings(id),
  stripe_payment_intent_id  TEXT UNIQUE,
  amount                    FLOAT NOT NULL,
  platform_fee              FLOAT NOT NULL,
  caregiver_payout          FLOAT NOT NULL,
  currency                  TEXT DEFAULT 'bdt',
  status                    TEXT NOT NULL,
  created_at                TIMESTAMPTZ DEFAULT NOW()
)

reviews (
  id          TEXT PRIMARY KEY,
  booking_id  TEXT UNIQUE REFERENCES bookings(id),
  author_id   TEXT REFERENCES users(id),
  target_id   TEXT REFERENCES users(id),
  rating      INT NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)

addresses (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  division    TEXT,
  district    TEXT,
  city        TEXT,
  area        TEXT,
  address     TEXT,
  is_default  BOOLEAN DEFAULT FALSE
)

family_members (
  id            TEXT PRIMARY KEY,
  user_id       TEXT REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  age           INT NOT NULL,
  relationship  TEXT NOT NULL,
  special_needs TEXT
)

promo_codes (
  id              TEXT PRIMARY KEY,
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT NOT NULL,
  discount_value  FLOAT NOT NULL,
  max_uses        INT,
  current_uses    INT DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  link        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 🔐 Security Requirements

**Authentication & Authorization**

- NextAuth.js with JWT strategy
- Google OAuth as primary login method
- Role-based middleware: check `session.user.role` before rendering protected routes

**Validation & Data Safety**

- All Server Actions validate input with Zod schemas
- Environment variables for all secrets (NEVER hardcode)
- Supabase Row Level Security (RLS) where applicable
- File upload validation: type whitelist (jpg, png, pdf), max size 5MB

---

## 📧 Email System (Resend + React Email)

**Implement these emails:**

1. **Welcome Email** — On registration (both roles)
2. **Booking Confirmation (Client)** — Service details + invoice-style summary

**Optional / later:**

3. New Assignment notification to caregiver
4. Caregiver Approved / Rejected emails

**Email Template Design:**

- Responsive HTML emails using React Email components
- Consistent branding (logo, colors)

---

## 💳 Payment System (Stripe Checkout)

**Flow:**

1. User completes booking form → Server Action creates **Stripe Checkout Session**
2. User is redirected to Stripe-hosted Checkout page
3. On success URL → mark booking as `CONFIRMED`, create Payment record, send email
4. On cancel URL → redirect back to booking page with message

**Details:**

- Platform fee calculation (5% of booking amount)
- Test mode for development (Stripe test keys)
- Payment record stored in `payments` table

---

## 🎨 UI/UX Requirements

**Design System**

| Element | Value |
| --- | --- |
| Styling | Tailwind CSS + daisyUI themes + shadcn/ui components |
| Typography | Inter (body) + Plus Jakarta Sans (headings) via `next/font` |
| Border Radius | 8px default, 12px cards, full for avatars |
| Dark Mode | Full support using Tailwind `dark:` classes + `next-themes` |

**Responsive Breakpoints:**

- Mobile: 320px – 767px
- Tablet: 768px – 1023px
- Desktop: 1024px+
- Mobile-first approach

**Accessibility (WCAG 2.1 AA)**

- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1
- Alt text on all images
- Font sizing: minimum 16px body, scalable with `rem`
- Touch targets: minimum 44x44px on mobile
- Elderly-friendly: Large tap targets, clear labels

**Animations & Feedback:**

- Skeleton loading screens (not just spinners)
- Toast notifications (success, error, info) using `sonner`
- Micro-interactions on buttons, cards (hover, active states)
- Reduced motion: respect `prefers-reduced-motion`

---

## 🧪 Testing Requirements

**Tools:** React Testing Library

**What to test (priority order):**

1. Booking form validation (React Hook Form + Zod)
2. Price calculation utility (duration × rate + platform fee)
3. Key components render correctly (CaregiverCard, BookingCard, StatusBadge)
4. Protected route behavior (redirect when unauthenticated)

**Goal:** Demonstrate understanding of component testing with a few focused, meaningful tests.

---

## 🚀 Performance Requirements

- **Lighthouse Score:** Aim for 90+ on Performance, Accessibility, Best Practices, SEO
- **Image Optimization:** All images via `next/image` with proper `width`, `height`, `sizes`, `priority` for above-the-fold
- **Caching:** Static pages with ISR + revalidation where appropriate (homepage: 60s, service pages: 300s)

---

## 📦 Environment Variables

```env
# Supabase
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe (test keys)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Resend (Email)
RESEND_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 🏆 What Makes This Stand Out to Recruiters

| Basic Assignment | This Version |
| --- | --- |
| Single user role | 3 roles with RBAC (Client, Caregiver, Admin) |
| Basic email/password auth | NextAuth + Google OAuth + role-based guards |
| Simple booking form | Multi-step booking with real-time pricing + Stripe |
| Static service list | Dynamic services with reviews, ratings, search, filters |
| No tests | React Testing Library tests on key components |
| No error handling | Custom error boundaries + toast notifications |
| Basic CSS | Tailwind + daisyUI + shadcn/ui + dark mode + accessibility |
| No payment | Stripe Checkout integration |
| Console.log emails | Resend + React Email with booking confirmation |
| No admin | Admin dashboard with analytics and user management |
| Minimal README | Professional README with screenshots and demo credentials |

---

## 📅 Suggested Build Order

### Phase 1 — Foundation

- [ ] Project setup (Next.js 15, TypeScript, Tailwind, daisyUI, shadcn/ui)
- [ ] Supabase project + database tables + seed data
- [ ] Redux store setup
- [ ] NextAuth with Google provider
- [ ] Layout components (Navbar, Footer, Sidebar)
- [ ] Homepage (all 8 sections)

### Phase 2 — Core Features

- [ ] Service listing + detail pages
- [ ] Caregiver browse + profile pages (with TanStack Query)
- [ ] Booking flow (4-step form with React Hook Form + Zod)
- [ ] My Bookings page + booking detail
- [ ] Location cascading dropdowns (Bangladesh geo data)

### Phase 3 — Integrations

- [ ] Stripe Checkout integration
- [ ] Resend + React Email (booking confirmation + welcome email)
- [ ] Cloudinary upload for caregiver photos/documents

### Phase 4 — Dashboards & Polish

- [ ] Caregiver dashboard (assignments, earnings, availability)
- [ ] Admin dashboard + caregiver approvals + user/booking management
- [ ] Review & rating system
- [ ] Dark mode
- [ ] Responsive design pass (mobile/tablet)
- [ ] Accessibility pass
- [ ] Write React Testing Library tests
- [ ] Prepare demo accounts & seed data
- [ ] Deploy to Vercel
- [ ] Professional README with screenshots
