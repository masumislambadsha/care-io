# Quick Start Guide - Care.xyz

Get Care.xyz up and running in 10 minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git

## 📦 Installation

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd care-xyz

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

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

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Run the SQL from `supabase/schema.sql`
4. Run the SQL from `supabase/seed.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Quick Test

### Test Accounts

**Admin:**

- Email: `admin@example.com`
- Password: `password123`

**Client:**

- Email: `client@example.com`
- Password: `password123`

**Caregiver:**

- Email: `caregiver@example.com`
- Password: `password123`

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🎨 Toggle Dark Mode

Click the theme toggle button in the dashboard header!

## 📚 Next Steps

1. **Read Documentation**
   - [TESTING.md](TESTING.md) - Testing guide
   - [DARK_MODE.md](DARK_MODE.md) - Dark mode guide
   - [ACCESSIBILITY.md](ACCESSIBILITY.md) - Accessibility guide

2. **Explore Features**
   - Browse caregivers
   - Create a booking
   - Test payment flow (Stripe test mode)
   - Try promo codes
   - Check admin dashboard

3. **Development**
   - Add new components
   - Write tests
   - Customize styling
   - Add features

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run linter
npm run lint:fix        # Fix linting issues
npm run type-check      # Check TypeScript types

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Maintenance
npm run clean           # Clean build artifacts
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Database Connection Issues

- Check Supabase credentials
- Verify project is active
- Check network connection

### Stripe Webhook Issues

- Use Stripe CLI for local testing
- Verify webhook secret
- Check endpoint URL

## 📞 Need Help?

- Check [README.md](README.md) for detailed setup
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- Check [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md)

## 🎉 You're Ready!

Start building amazing features on Care.xyz! 🚀
