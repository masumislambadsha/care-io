# Quick Test Commands

## 🚀 Start Testing in 3 Steps

### Step 1: Build

```bash
npm run build
```

### Step 2: Start Production Server

```bash
npm start
```

### Step 3: Open Browser

```
http://localhost:3000
```

---

## 🧪 Quick Tests

### Test Homepage

```bash
# Open in browser
http://localhost:3000
```

### Test 404 Page

```bash
# Open in browser
http://localhost:3000/this-does-not-exist
```

### Test Sitemap

```bash
# Open in browser
http://localhost:3000/sitemap.xml
```

### Test Robots

```bash
# Open in browser
http://localhost:3000/robots.txt
```

### Test API Caching

```bash
# In terminal
curl -I http://localhost:3000/api/services
curl -I http://localhost:3000/api/caregivers

# Look for: Cache-Control: public, s-maxage=60, stale-while-revalidate=120
```

---

## 🎯 Test Earnings Bug Fix

### 1. Login as Caregiver

```
http://localhost:3000/login
```

### 2. Go to Assigned Jobs

```
http://localhost:3000/caregiver/assigned-jobs
```

Note the number of completed jobs

### 3. Go to Earnings

```
http://localhost:3000/caregiver/earnings
```

✅ Should show same number of completed jobs
✅ Should show earnings amount (not $0.00)

---

## 🎯 Test Booking Detail Page

### 1. Login as Client

```
http://localhost:3000/login
```

### 2. Go to My Bookings

```
http://localhost:3000/my-bookings
```

### 3. Click "View Details" on any booking

```
http://localhost:3000/my-bookings/[booking-id]
```

✅ Should show full booking details
✅ Should show timeline
✅ Should show actions (Cancel/Review)

---

## 📊 Lighthouse Test

### In Chrome DevTools:

1. Press `F12` to open DevTools
2. Click "Lighthouse" tab
3. Select all categories
4. Click "Analyze page load"

### Expected Scores:

- Performance: 90+ ✅
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 🗄️ Database Indexes

### Apply Indexes in Supabase:

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy contents from `database-indexes.sql`
4. Click "Run"

### Verify Indexes:

```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename;
```

---

## 🔍 Check for Errors

### Check Build Output

```bash
npm run build

# Should see:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Generating static pages
```

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Should have no red errors

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check for failed requests (red)

---

## 🎨 Visual Testing

### Test Loading States

1. Open DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Navigate between pages
5. ✅ Should see loading spinners

### Test Error Pages

```bash
# Visit non-existent page
http://localhost:3000/random-page-404

# Should show custom 404 page
```

### Test Responsive Design

1. Open DevTools (F12)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

---

## 📱 Mobile Testing

### Using Chrome DevTools:

1. Press F12
2. Click device icon (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test navigation and interactions

### Using Real Device:

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On mobile, visit: `http://YOUR-IP:3000`
3. Test all features

---

## 🚨 Common Issues & Fixes

### Issue: Build fails

```bash
# Solution: Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Port 3000 already in use

```bash
# Solution: Use different port
PORT=3001 npm start

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: Earnings still shows $0

```bash
# Check:
1. Are you logged in as CAREGIVER?
2. Do you have completed bookings?
3. Check browser console for errors
4. Verify API response: /api/bookings/assigned-jobs
```

### Issue: Lighthouse score still low

```bash
# Make sure:
1. Running production build (npm start, not npm run dev)
2. Using incognito mode
3. No browser extensions enabled
4. Network throttling is OFF
```

---

## ✅ Quick Checklist

Before marking as complete, verify:

- [ ] `npm run build` succeeds
- [ ] `npm start` works
- [ ] Homepage loads without errors
- [ ] Login works
- [ ] Earnings page shows correct data (caregiver)
- [ ] Booking detail page works (client)
- [ ] 404 page displays
- [ ] Sitemap.xml accessible
- [ ] Lighthouse score 90+
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎉 Success!

If all tests pass, you're ready to deploy!

### Next Steps:

1. Apply database indexes in Supabase
2. Set `NEXT_PUBLIC_APP_URL` environment variable
3. Deploy to Vercel/your platform
4. Run Lighthouse on production URL
5. Monitor performance for 24 hours

---

## 📞 Need Help?

Check these files for more details:

- `TESTING_GUIDE.md` - Full testing guide
- `PERFORMANCE_OPTIMIZATIONS.md` - What was optimized
- `PERFORMANCE_QUICK_START.md` - Quick reference
- `database-indexes.sql` - Database indexes to apply
