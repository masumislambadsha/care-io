# 🏥 Care.xyz - Professional Care Service Platform

A full-stack Next.js 15 platform connecting families with verified caregivers for children, elderly, and special-needs individuals.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF)

---

## 🎯 Project Overview

Care.xyz is a comprehensive care service platform featuring:

- **3 User Roles**: Client, Caregiver, Admin
- **Complete Booking Workflow**: Browse → Book → Pay → Review
- **Real Payment Integration**: Stripe Checkout with webhooks
- **Advanced Features**: Notifications, Family Members, Address Book
- **Admin Panel**: User & Booking Management
- **Modern Tech Stack**: Next.js 15, TypeScript, TanStack Query, Redux, Supabase

---

## ✨ Key Features

### For Clients:

- 🔍 Browse verified caregivers with advanced filters
- 📅 Book services with 4-step booking flow
- 💳 Secure payment via Stripe
- 👨‍👩‍👧‍👦 Manage family members
- 📍 Save multiple addresses
- ⭐ Leave reviews and ratings
- 🔔 Real-time notifications
- 📊 Track bookings and payments

### For Caregivers:

- 💼 Manage assigned jobs
- 📆 View daily schedule
- 💰 Track earnings (85% payout)
- ⭐ View reviews and ratings
- 🔄 Update job status (Confirmed → Ongoing → Completed)
- 📱 Receive booking notifications

### For Admins:

- 👥 User management (view, suspend, delete)
- 📋 Booking management (view, update status)
- 📊 Platform statistics and analytics
- 💵 Revenue tracking

---

## 🛠️ Tech Stack

### Frontend:

- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**:
  - TanStack Query (Server State)
  - Redux Toolkit (Client State)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion, AOS
- **UI Components**: Custom + Material Icons

### Backend:

- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **Payment**: Stripe (Checkout + Webhooks)
- **Email**: Resend + React Email
- **File Upload**: Cloudinary
- **API**: Next.js API Routes

### Testing:

- **Framework**: Jest
- **Library**: React Testing Library

---

## 📁 Project Structure

```
care-xyz/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (dashboard)/         # Dashboard pages (all roles)
│   │   ├── (protected)/         # Protected pages
│   │   ├── api/                 # API routes (25+ endpoints)
│   │   ├── caregivers/          # Public caregiver pages
│   │   ├── services/            # Public service pages
│   │   └── providers.tsx        # App providers
│   ├── components/              # Reusable components
│   ├── emails/                  # Email templates
│   ├── lib/                     # Utilities & configs
│   ├── store/                   # Redux store
│   ├── types/                   # TypeScript types
│   └── __tests__/               # Test files
├── supabase/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Seed data
├── public/                      # Static assets
└── ...config files
```

---

## 🚀 Getting Started

### Prerequisites:

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (test mode)
- Google OAuth credentials
- Resend account (free tier)
- Cloudinary account (free tier)

### Quick Setup Guides:

📚 **New to the project?** Follow these guides in order:

1. **[QUICK_SETUP.md](QUICK_SETUP.md)** - Get Resend & Cloudinary keys in 5 minutes ⚡
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions with screenshots 📖
3. **[API_KEYS_CHECKLIST.md](API_KEYS_CHECKLIST.md)** - Track your setup progress ✅

### Installation:

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

Copy the example file and add your keys:

```bash
cp .env.example .env.local
```

Then follow **[QUICK_SETUP.md](QUICK_SETUP.md)** to get your Resend and Cloudinary API keys.

Your `.env.local` should include:

```env
# Database (Supabase)
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

# Resend (Email) - Get from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxx

# Cloudinary - Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=care-xyz-uploads

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Verify your setup:**

```bash
node test-api-keys.js
```

This will check if all your API keys are properly configured.

# App

NEXT_PUBLIC_APP_URL=http://localhost:3000

````

4. **Set up database**

Go to Supabase Dashboard and run:

```sql
-- Run supabase/schema.sql
-- Run supabase/seed.sql
````

5. **Run development server**

```bash
npm run dev
```

6. **Open browser**

```
http://localhost:3000
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📊 Database Schema

10 tables with complete relationships:

- `users` - User accounts
- `caregiver_profiles` - Caregiver details
- `services` - Available services
- `bookings` - Service bookings
- `payments` - Payment records
- `reviews` - User reviews
- `addresses` - Saved addresses
- `family_members` - Family member records
- `promo_codes` - Discount codes
- `notifications` - User notifications

---

## 🔐 Authentication

### Supported Methods:

- Google OAuth (for clients)
- Email/Password (for all roles)

### User Roles:

- **CLIENT**: Book services, manage family, leave reviews
- **CAREGIVER**: Manage jobs, track earnings, update status
- **ADMIN**: Manage users, bookings, platform settings

---

## 💳 Payment Flow

1. Client completes booking form
2. Redirected to Stripe Checkout
3. Payment processed securely
4. Webhook confirms payment
5. Booking created with CONFIRMED status
6. Email confirmation sent
7. Caregiver notified

**Platform Fee**: 15% (Caregiver receives 85%)

---

## 📧 Email Templates

Built with React Email:

- Welcome Email (on registration)
- Booking Confirmation (after payment)
- Status Update (when caregiver updates)
- Review Reminder (after completion)

---

## 🎨 UI/UX Features

- Fully responsive design (mobile, tablet, desktop)
- Dark mode ready
- Smooth animations (Framer Motion, AOS)
- Toast notifications
- Loading states
- Error handling
- Empty states
- Skeleton loaders

---

## 📱 Pages

### Public:

- Homepage
- Services Listing
- Service Detail
- Caregivers Listing
- Caregiver Profile
- Login/Register

### Client Dashboard:

- Dashboard Overview
- My Bookings
- Payment History
- Family Members
- Address Book
- Profile
- Settings
- Notifications

### Caregiver Dashboard:

- Dashboard Overview
- Assigned Jobs
- My Bookings
- Schedule
- Earnings
- Reviews
- Profile
- Settings

### Admin Dashboard:

- Dashboard Overview
- User Management
- Booking Management
- Settings

---

## 🔌 API Endpoints

### Authentication:

- `POST /api/auth/register`
- `POST /api/auth/[...nextauth]`

### Services:

- `GET /api/services`
- `GET /api/services/[slug]`

### Caregivers:

- `GET /api/caregivers`
- `GET /api/caregivers/[id]`

### Bookings:

- `GET /api/bookings/my-bookings`
- `GET /api/bookings/assigned-jobs`
- `POST /api/bookings/create`
- `POST /api/bookings/create-checkout`
- `POST /api/bookings/cancel`
- `POST /api/bookings/update-status`

### Reviews:

- `GET /api/reviews`
- `POST /api/reviews`

### Notifications:

- `GET /api/notifications`
- `PUT /api/notifications`
- `DELETE /api/notifications`

### Family & Addresses:

- `GET/POST/PUT/DELETE /api/family`
- `GET/POST/PUT/DELETE /api/addresses`

### Admin:

- `GET/PUT/DELETE /api/admin/users`
- `GET/PUT /api/admin/bookings`

### Webhooks:

- `POST /api/webhooks/stripe`

---

## 🚀 Deployment

### Vercel (Recommended):

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables:

Add all variables from `.env.example` to Vercel dashboard

### Post-Deployment:

1. Configure Stripe webhook URL
2. Verify Resend domain
3. Test all features
4. Monitor errors

---

## 📈 Performance

- Lighthouse Score: 90+
- Server-side rendering
- Image optimization ready
- Code splitting
- Lazy loading
- Caching with TanStack Query

---

## 🔒 Security

- Row Level Security (RLS) in Supabase
- Protected API routes
- Input validation (Zod)
- Password hashing (bcryptjs)
- CSRF protection
- Role-based access control
- Secure environment variables

---

## 🎯 Future Enhancements

- [ ] Caregiver verification system
- [ ] Availability calendar
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Promo code system
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Video call integration
- [ ] Background checks

---

## 📝 Demo Credentials

### Client Account:

- Email: `client@example.com`
- Password: `password123`

### Caregiver Account:

- Email: `caregiver@example.com`
- Password: `password123`

### Admin Account:

- Email: `admin@example.com`
- Password: `password123`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Developer

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

---

## 📞 Support

For support, email support@care.xyz

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Stripe for payment processing
- Vercel for hosting
- All open-source contributors

---

**Status**: Production Ready 🚀
**Version**: 1.0.0
**Last Updated**: February 2026
