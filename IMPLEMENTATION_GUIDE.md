# Performance Optimization Implementation Guide

## ✅ Already Completed (Quick Wins)

### 1. Disabled SmoothScroll Component

- **Impact:** +5-10 points
- **File:** `src/app/layout.tsx`
- **Change:** Commented out `<SmoothScroll />`

### 2. Added API Response Caching

- **Impact:** +3-5 points
- **Files:**
  - `src/app/api/services/route.ts`
  - `src/app/api/caregivers/route.ts`
- **Change:** Added `export const revalidate = 300;`

### 3. Added Resource Hints

- **Impact:** +2-3 points
- **File:** `src/app/layout.tsx`
- **Change:** Added preconnect for images.unsplash.com, ui-avatars.com, lh3.googleusercontent.com

### 4. Optimized Data Fetching

- **Impact:** +2-3 points
- **File:** `src/app/page.tsx`
- **Change:** Changed to parallel fetching with `Promise.all()`

**Total Quick Wins Impact:** +12-21 points
**Expected Current Score:** 76-85 (from 64)

---

## 🔥 Next Critical Steps (Do These Next)

### Step 1: Convert Home Page to Server-Side Rendering (SSR)

**Impact:** +15-20 points (BIGGEST IMPACT)

#### 1.1 Create Client Component

Create `src/app/home-client.tsx`:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import CustomButton from "@/components/CustomButtons";
import Navbar from "@/components/Navbar";

const motion = dynamic(() => import("framer-motion").then(mod => ({ default: mod.motion })), { ssr: false });
const Swiper = dynamic(() => import("swiper/react").then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import("swiper/react").then(mod => mod.SwiperSlide), { ssr: false });

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image: string;
  base_hourly_rate: number;
  base_daily_rate: number;
  features: string[];
  is_active: boolean;
};

type Caregiver = {
  id: string;
  name: string;
  image: string;
  bio: string;
  experience: number;
  hourly_rate: number;
  certifications: string[];
  languages: string[];
  services_offered: string[];
  verification_status: string;
  avg_rating: number;
  total_reviews: number;
  total_bookings: number;
};

interface HomeClientProps {
  initialServices: Service[];
  initialCaregivers: Caregiver[];
}

export default function HomeClient({ initialServices, initialCaregivers }: HomeClientProps) {
  const [services] = useState<Service[]>(initialServices);
  const [caregivers] = useState<Caregiver[]>(initialCaregivers);

  // Move all your existing JSX here (everything from the return statement)
  // Keep all the helper functions (getServiceIcon, getServiceColor, heroSlides)

  return (
    // Your existing JSX
  );
}
```

#### 1.2 Update Home Page to Server Component

Update `src/app/page.tsx`:

```tsx
import { Suspense } from "react";
import HomeClient from "./home-client";
import HomePageSkeleton from "@/components/HomePageSkeleton";

async function getServices() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/services`, {
    next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    cache: "force-cache",
  });

  if (!res.ok) {
    return { services: [] };
  }

  return res.json();
}

async function getCaregivers() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/caregivers`, {
    next: { revalidate: 300 },
    cache: "force-cache",
  });

  if (!res.ok) {
    return { caregivers: [] };
  }

  return res.json();
}

export default async function HomePage() {
  // Parallel data fetching on server
  const [servicesData, caregiversData] = await Promise.all([
    getServices(),
    getCaregivers(),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeClient
        initialServices={servicesData.services || []}
        initialCaregivers={caregiversData.caregivers || []}
      />
    </Suspense>
  );
}
```

#### 1.3 Create Loading Skeleton

Create `src/components/HomePageSkeleton.tsx`:

```tsx
export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <div className="h-[700px] bg-slate-200 animate-pulse" />

      {/* Services Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-slate-200 rounded w-48 mb-12 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

#### 1.4 Add Environment Variable

Add to `.env.local`:

```
NEXT_PUBLIC_URL=http://localhost:3000
```

For production (Vercel):

```
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```

---

### Step 2: Add More API Caching

Add `export const revalidate = 300;` to these API routes:

1. `src/app/api/services/[slug]/route.ts`
2. `src/app/api/caregivers/[id]/route.ts`
3. `src/app/api/reviews/route.ts`

Example:

```tsx
import { NextResponse } from "next/server";

export const revalidate = 300; // Add this line

export async function GET(request: Request) {
  // Your existing code
}
```

**Impact:** +3-5 points

---

### Step 3: Optimize Other Pages with SSR

Apply the same pattern to:

#### 3.1 Services Page (`src/app/services/page.tsx`)

```tsx
// Convert to server component
async function getServices() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/services`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function ServicesPage() {
  const { services } = await getServices();

  return <ServicesClient initialServices={services} />;
}
```

#### 3.2 Caregivers Page (`src/app/caregivers/page.tsx`)

```tsx
// Same pattern as services page
```

#### 3.3 Service Detail Page (`src/app/services/[slug]/page.tsx`)

```tsx
async function getService(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/services/${slug}`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getService(params.slug);

  return <ServiceDetailClient initialService={service} />;
}

// Add this for static generation
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/services`);
  const { services } = await res.json();

  return services.map((service: any) => ({
    slug: service.slug,
  }));
}
```

**Impact:** +10-15 points

---

### Step 4: Add Database Indexes

If using Prisma, update `schema.prisma`:

````prisma
model Service {
  id String @id @default(cuid())
  slug String @unique
  is_active Boolean @default(true)
  name String

  @@index([is_active])
  @@index([slug])
  @@index([name])
}

model User {
  id String @id @default(cuid())
  email String @unique
  role String
  status String

  @@index([email])
  @@index([role])
  @@index([status])
  @@index([role,
```tsx
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const { data: caregivers, error, count } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        caregiver_profile:caregiver_profiles(*)
      `, { count: 'exact' })
      .eq("role", "CAREGIVER")
      .eq("status", "ACTIVE")
      .not("caregiver_profile", "is", null)
      .range(skip, skip + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch caregivers" },
        { status: 500 }
      );
    }

    const transformedCaregivers = caregivers.map((caregiver: any) => ({
      // Your existing transformation
    }));

    return NextResponse.json({
      caregivers: transformedCaregivers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
````

#### 5.2 Update Client Component

Add pagination UI to caregivers page.

**Impact:** +5-10 points

---

## 📊 Expected Results After All Steps

| Step                | Current Score | Expected Score | Improvement |
| ------------------- | ------------- | -------------- | ----------- |
| Initial             | 64            | 64             | -           |
| Quick Wins          | 64            | 76-85          | +12-21      |
| Step 1 (SSR Home)   | 76-85         | 91-100         | +15-20      |
| Step 2 (API Cache)  | 91-100        | 94-100         | +3-5        |
| Step 3 (SSR Pages)  | 94-100        | 96-100         | +2-5        |
| Step 4 (DB Indexes) | 96-100        | 97-100         | +1-3        |
| Step 5 (Pagination) | 97-100        | 98-100         | +1-2        |

**Final Expected Score: 98-100**

---

## 🧪 Testing After Each Step

```bash
# 1. Build
npm run build

# 2. Start production server
npm run start

# 3. Run Lighthouse
# Open Chrome DevTools > Lighthouse > Run audit

# 4. Check specific metrics
# - LCP should be < 2.5s
# - FCP should be < 1.8s
# - TBT should be < 300ms
# - CLS should be < 0.1
```

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] All environment variables set in Vercel
- [ ] `NEXT_PUBLIC_URL` set to production domain
- [ ] Database indexes applied
- [ ] Build completes without errors
- [ ] Test locally with production build

After deploying:

- [ ] Run Lighthouse on production URL
- [ ] Check Vercel Analytics
- [ ] Monitor error logs
- [ ] Test on mobile devices
- [ ] Test on slow 3G connection

---

## 📈 Monitoring

Set up monitoring for:

1. **Core Web Vitals** - Google Search Console
2. **Real User Monitoring** - Vercel Analytics
3. **Error Tracking** - Sentry (optional)
4. **Uptime Monitoring** - UptimeRobot (optional)

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Hydration Errors

- Check for mismatched HTML between server and client
- Ensure dynamic imports have `ssr: false` when needed
- Use `suppressHydrationWarning` only as last resort

### Slow API Responses

- Check database query performance
- Verify indexes are applied
- Add Redis caching if needed
- Check Supabase dashboard for slow queries

---

## 📚 Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Ready to implement? Start with Step 1 for the biggest impact!**
