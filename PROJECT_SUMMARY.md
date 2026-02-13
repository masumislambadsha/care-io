# Care.xyz - Complete Care Service Platform

## 🎯 Project Overview

A full-stack Next.js 15 care service platform connecting clients with verified caregivers. Built with TypeScript, Tailwind CSS, Supabase, Stripe, and NextAuth.

## ✅ Completed Features

### 1. Authentication System

- ✅ NextAuth.js with Google OAuth & Credentials
- ✅ Role-based authentication (CLIENT, CAREGIVER, ADMIN)
- ✅ Login page with form validation
- ✅ Registration flow:
  - Role selection page
  - Client registration form
  - Caregiver 3-step registration (Personal Info → Professional Details → Verification)
- ✅ Protected routes with middleware
- ✅ Session management

### 2. Database & Backend

- ✅ Complete PostgreSQL schema (10 tables)
- ✅ Supabase integration with Row Level Security
- ✅ Tables: users, caregiver_profiles, services, bookings, payments, reviews, addresses, family_members, promo_codes, notifications
- ✅ Seed data for testing
- ✅ API routes for all operations

### 3. Service Management

- ✅ Services listing page with category filters
- ✅ Service detail pages (dynamic routes by slug)
- ✅ Service cards with pricing, features, images
- ✅ Fetching from Supabase database
- ✅ Responsive design with animations

### 4. Caregiver Management

- ✅ Caregivers listing page
- ✅ Advanced filtering system:
  - Search by name/service
  - Filter by service type
  - Filter by minimum rating
  - Filter by max hourly rate
  - Filter by experience years
- ✅ Caregiver detail pages with full profiles
- ✅ Rating and review display
- ✅ Fetching from Supabase database

### 5. Booking System

- ✅ 4-step booking flow:
  1. Choose Caregiver
  2. Schedule (date/time picker with increment/decrement)
  3. Location (cascading dropdowns: Division → District → City → Area)
  4. Review & Pay
- ✅ Session storage for booking data
- ✅ Booking creation API
- ✅ Booking validation

### 6. Payment Integration

- ✅ Stripe Checkout integration
- ✅ Payment success page with countdown redirect
- ✅ Webhook handler for payment confirmation
- ✅ Payment status tracking
- ✅ Booking creation after successful payment

### 7. Dashboard System

- ✅ Separate layout with collapsible sidebar
- ✅ Role-based menu items (CLIENT vs CAREGIVER)
- ✅ Dashboard page with stats:
  - Total bookings
  - Active bookings
  - Completed bookings
  - Total spent/earned
- ✅ Recent bookings display
- ✅ Quick actions section

### 8. My Bookings Page

- ✅ Bookings list with filtering (all, confirmed, ongoing, completed, cancelled)
- ✅ Booking details modal
- ✅ Review modal with star rating
- ✅ Cancel booking modal with refund policy
- ✅ Status badges and color coding
- ✅ Booking information display

### 9. Profile Management

- ✅ Profile page with edit functionality
- ✅ Update name, phone, profile image
- ✅ API endpoint for profile updates
- ✅ Real-time session updates
- ✅ Loading states and error handling

### 10. Settings Page

- ✅ Notification preferences:
  - Email notifications
  - SMS notifications
  - Booking reminders
  - Marketing emails
- ✅ Security settings:
  - Two-factor authentication (placeholder)
  - Change password (placeholder)
- ✅ Danger zone (delete account)
- ✅ Save functionality with toast notifications

### 11. Payment History

- ✅ Payment history page
- ✅ Transaction table with:
  - Date, Service, Caregiver, Transaction ID, Amount, Status
- ✅ Filter by payment status
- ✅ Stats cards (Total Spent, Successful Payments, Total Transactions)
- ✅ Responsive table design

### 12. Reviews System

- ✅ Review submission API
- ✅ Star rating (1-5 stars)
- ✅ Written review comments
- ✅ Automatic caregiver rating updates
- ✅ Duplicate review prevention
- ✅ Only for completed bookings

### 13. Booking Cancellation

- ✅ Cancel booking API
- ✅ Smart refund policy:
  - 100% refund: 24+ hours before
  - 50% refund: 12-24 hours before
  - No refund: Less than 12 hours
- ✅ Cancellation reason tracking
- ✅ Automatic notifications

### 14. Notifications System

- ✅ Notifications API (GET, PUT)
- ✅ Mark as read functionality
- ✅ Mark all as read option
- ✅ Unread count tracking
- ✅ Notification types (booking, payment, cancellation)

### 15. UI/UX Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Framer Motion animations
- ✅ AOS (Animate On Scroll)
- ✅ Toast notifications (react-hot-toast)
- ✅ Loading states
- ✅ Error handling
- ✅ Material Icons
- ✅ DaisyUI components
- ✅ Tailwind CSS styling

## 📁 Project Structure

```
care-xyz/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── my-bookings/
│   │   │   ├── payments/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── (protected)/
│   │   │   └── booking/[serviceId]/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   ├── caregivers/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── reviews/
│   │   │   ├── services/
│   │   │   └── settings/
│   │   ├── booking/success/
│   │   ├── caregivers/
│   │   ├── services/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── supabase.ts
│   │   └── validators/
│   ├── middleware.ts
│   └── types/
├── supabase/
│   ├── schema.sql
│   ├── seed.sql
│   └── add_user_preferences.sql
├── public/
├── .env.local
├── package.json
└── README.md
```

## 🔧 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Animations**: Framer Motion, AOS
- **Forms**: React Hook Form, Zod
- **State**: React Hooks
- **Notifications**: React Hot Toast

### Backend

- **Database**: PostgreSQL (Supabase)
- **ORM**: Supabase Client
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Payment**: Stripe

### DevOps

- **Hosting**: Vercel (recommended)
- **Database**: Supabase Cloud
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Google OAuth credentials

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd care-xyz
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create `.env.local`:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

4. **Set up database**

- Go to Supabase Dashboard
- Run `supabase/schema.sql` in SQL Editor
- Run `supabase/seed.sql` for test data
- (Optional) Run `supabase/add_user_preferences.sql` for settings persistence

5. **Run development server**

```bash
npm run dev
```

6. **Open browser**

```
http://localhost:3000
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Services

- `GET /api/services` - List all services
- `GET /api/services/[slug]` - Get service by slug

### Caregivers

- `GET /api/caregivers` - List all caregivers
- `GET /api/caregivers/[id]` - Get caregiver by ID

### Bookings

- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/create` - Create booking
- `POST /api/bookings/create-checkout` - Create Stripe checkout
- `POST /api/bookings/cancel` - Cancel booking

### Reviews

- `POST /api/reviews` - Submit review
- `GET /api/reviews?caregiverId=xxx` - Get caregiver reviews

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Settings

- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Notifications

- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark as read

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

## 🎨 Design Features

### Color Scheme

- Primary: Teal (#0d9488)
- Secondary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Background: Slate (#f8fafc)

### Typography

- Font: System fonts (sans-serif)
- Headings: Bold, large sizes
- Body: Regular, readable sizes

### Components

- Cards with shadows and hover effects
- Buttons with transitions
- Forms with validation
- Modals with backdrop
- Toast notifications
- Loading spinners
- Empty states

## 🔐 Security Features

- ✅ Row Level Security (RLS) in Supabase
- ✅ Protected API routes with session checks
- ✅ Input validation with Zod
- ✅ Password hashing with bcryptjs
- ✅ CSRF protection
- ✅ Secure environment variables
- ✅ Role-based access control

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Touch-friendly UI
- ✅ Optimized images
- ✅ Fast loading times

## 🐛 Known Issues & Future Enhancements

### To Fix

- Settings persistence (requires DB migration)
- Notification bell icon integration
- Real-time updates with Supabase Realtime

### Future Features

- [ ] Real-time chat between client and caregiver
- [ ] Video call integration
- [ ] Advanced availability calendar
- [ ] Promo code system
- [ ] Family member management
- [ ] Address book
- [ ] Caregiver earnings dashboard
- [ ] Admin panel
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export booking history (PDF/CSV)
- [ ] Advanced analytics
- [ ] Background checks integration
- [ ] Insurance verification

## 📄 License

This project is private and proprietary.

## 👥 Team

- Developer: [Your Name]
- Project: Care Service Platform
- Date: February 2026

## 📞 Support

For support, email support@care.xyz or join our Slack channel.

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
