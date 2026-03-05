# Advanced Performance Optimizations

## Critical Issues Found

### 1. 🔴 SmoothScroll Component (High Impact)

**Problem:** Lenis smooth scroll runs on every frame via `requestAnimationFrame`, causing performance overhead.

**Impact:**

- Blocks main thread
- Increases CPU usage
- Slows down LCP and FCP
- Reduces performance score by 5-10 points

**Solution:**

```tsx
// Option A: Make it optional/lazy loaded
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lenis = dynamic(() => import("lenis"), { ssr: false });

export default function SmoothScroll() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable on desktop with good performance
    setIsDesktop(
      window.innerWidth > 1024 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => lenis.destroy();
    });
  }, [isDesktop]);

  return null;
}
```

**Recommendation:** Remove SmoothScroll entirely for maximum performance (native scroll is fast).

---

### 2. 🔴 Client-Side Data Fetching (Critical)

**Problem:** All data is fetched client-side with `useEffect`, causing:

- Slow initial render
- Poor LCP scores
- Waterfall loading
- No SEO benefits

**Pages Affected:**

- `/` (home page) - fetches services & caregivers
- `/services` - fetches services
- `/caregivers` - fetches caregivers
- `/services/[slug]` - fetches single service
- `/caregivers/[id]` - fetches single caregiver
- All dashboard pages

**Solution: Convert to Server Components with SSR/ISR**

#### Example: Home Page (src/app/page.tsx)

```tsx
// Remove "use client" and fetch server-side
import { Suspense } from "react";
import HomeClient from "./home-client";

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/services`, {
    next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
  });
  return res.json();
}

async function getCaregivers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/caregivers`, {
    next: { revalidate: 300 },
  });
  return res.json();
}

export default async function HomePage() {
  const [servicesData, caregiversData] = await Promise.all([
    getServices(),
    getCaregivers(),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeClient
        initialServices={servicesData.services}
        initialCaregivers={caregiversData.caregivers}
      />
    </Suspense>
  );
}
```

**Expected Impact:** +15-20 performance points

---

### 3. 🟡 No API Response Caching

**Problem:** Every API call hits the database, no caching layer.

**Solution: Add Response Caching**

#### Example: Services API (src/app/api/services/route.ts)

```tsx
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  // Your existing code
}
```

#### Better: Add Redis Caching

```tsx
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function GET() {
  const cacheKey = "services:all";

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return Response.json(cached);
  }

  // Fetch from DB
  const services = await db.service.findMany();

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, services);

  return Response.json({ services });
}
```

**Expected Impact:** +5-10 performance points

---

### 4. 🟡 No Database Query Optimization

**Problem:** Likely missing indexes and inefficient queries.

**Solution: Add Database Indexes**

```prisma
// In your schema.prisma
model Service {
  id String @id @default(cuid())
  slug String @unique
  is_active Boolean @default(true)

  @@index([is_active]) // Add index
  @@index([slug]) // Add index
}

model Caregiver {
  id String @id @default(cuid())
  verification_status String
  avg_rating Float

  @@index([verification_status]) // Add index
  @@index([avg_rating]) // Add index
}

model Booking {
  id String @id @default(cuid())
  user_id String
  caregiver_id String
  status String

  @@index([user_id]) // Add index
  @@index([caregiver_id]) // Add index
  @@index([status]) // Add index
}
```

**Expected Impact:** +3-5 performance points

---

### 5. 🟡 Large Bundle Size

**Problem:** Multiple heavy libraries loaded on initial page load.

**Current Heavy Dependencies:**

- `framer-motion` (~60KB)
- `swiper` (~50KB)
- `aos` (~20KB)
- `lenis` (~15KB)
- `gsap` (~40KB)

**Solution: Further Code Splitting**

```tsx
// Create separate chunks for each page
// next.config.ts
experimental: {
  optimizePackageImports: [
    'framer-motion',
    'swiper',
    'aos',
    'react-icons',
    '@tanstack/react-query',
    'react-hook-form'
  ],
}
```

**Expected Impact:** +5-8 performance points

---

### 6. 🟡 No Image Preloading for LCP

**Problem:** Hero images load too late.

**Solution: Add Preload Links**

```tsx
// src/app/layout.tsx
<head>
  <link
    rel="preload"
    as="image"
    href="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=600&fit=crop"
    imageSrcSet="
      https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=640 640w,
      https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200 1200w
    "
    imageSizes="100vw"
  />
</head>
```

**Expected Impact:** +3-5 performance points

---

### 7. 🟡 No Pagination

**Problem:** Loading all services/caregivers at once.

**Solution: Implement Pagination**

```tsx
// API route with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const [caregivers, total] = await Promise.all([
    db.caregiver.findMany({
      take: limit,
      skip: skip,
      where: { verification_status: "APPROVED" },
    }),
    db.caregiver.count({ where: { verification_status: "APPROVED" } }),
  ]);

  return Response.json({
    caregivers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

**Expected Impact:** +5-10 performance points

---

### 8. 🟢 Add Resource Hints

**Solution: Preconnect to External Domains**

```tsx
// src/app/layout.tsx
<head>
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="dns-prefetch" href="https://ui-avatars.com" />
  <link rel="preconnect" href="https://lh3.googleusercontent.com" />
</head>
```

**Expected Impact:** +2-3 performance points

---

### 9. 🟢 Optimize Third-Party Scripts

**Solution: Load Analytics Asynchronously**

```tsx
// src/app/layout.tsx
import Script from "next/script";

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>;
```

**Expected Impact:** +2-3 performance points

---

### 10. 🟢 Add Loading Skeletons

**Solution: Better Perceived Performance**

```tsx
// src/components/ServicesSkeleton.tsx
export default function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4" />
          <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}
```

**Expected Impact:** Better UX, +1-2 performance points

---

## Priority Implementation Order

### Phase 1: Critical (Do First) 🔴

1. **Remove or optimize SmoothScroll** - Biggest impact
2. **Convert home page to SSR** - Major LCP improvement
3. **Add API response caching** - Faster data loading

**Expected Total Impact:** +25-35 points

### Phase 2: High Priority 🟡

4. **Add database indexes** - Faster queries
5. **Implement pagination** - Reduce data transfer
6. **Add image preloading** - Better LCP
7. **Further code splitting** - Smaller bundles

**Expected Total Impact:** +15-25 points

### Phase 3: Nice to Have 🟢

8. **Add resource hints** - Faster external resources
9. **Optimize third-party scripts** - Less blocking
10. **Add loading skeletons** - Better UX

**Expected Total Impact:** +5-10 points

---

## Total Expected Score

**Current:** 64
**After Phase 1:** 89-99
**After Phase 2:** 95-100
**After Phase 3:** 98-100

---

## Quick Wins (Do These Now)

### 1. Remove SmoothScroll (5 minutes)

```tsx
// src/app/layout.tsx
// Comment out or remove:
// <SmoothScroll />
```

### 2. Add API Caching (10 minutes)

```tsx
// Add to all API routes:
export const revalidate = 300;
```

### 3. Add Resource Hints (5 minutes)

```tsx
// Add to layout.tsx <head>:
<link rel="preconnect" href="https://images.unsplash.com" />
<link rel="dns-prefetch" href="https://ui-avatars.com" />
```

### 4. Optimize Home Page Fetching (15 minutes)

Convert to parallel fetching:

```tsx
// Instead of sequential:
fetchServices();
fetchCaregivers();

// Use parallel:
Promise.all([fetchServices(), fetchCaregivers()]);
```

**Total Time:** 35 minutes
**Expected Impact:** +15-20 points

---

## Monitoring & Testing

After each optimization:

1. Run `npm run build`
2. Run Lighthouse audit
3. Check Core Web Vitals
4. Test on slow 3G
5. Monitor real user metrics

---

## Next Steps

1. Implement Phase 1 optimizations
2. Deploy and test
3. Measure impact
4. Proceed to Phase 2
5. Repeat until target score achieved
