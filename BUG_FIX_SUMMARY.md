# Bug Fix: Assigned Jobs vs My Bookings

## Problem

Both "Assigned Jobs" and "My Bookings" pages were showing the same content for caregivers.

## Root Cause

The `/api/bookings/my-bookings` endpoint had incorrect logic:

- It was checking if user is a CAREGIVER
- If yes, it queried by `caregiver_id`
- This meant caregivers saw jobs assigned TO them in "My Bookings"

## The Fix

### 1. Fixed `/api/bookings/my-bookings` API

**Before:**

```typescript
const isCaregiver = session.user.role === "CAREGIVER";
// Query by caregiver_id if caregiver, client_id if client
.eq(isCaregiver ? "caregiver_id" : "client_id", userId)
```

**After:**

```typescript
// ALWAYS query by client_id - this is "My Bookings" (services I booked)
.eq("client_id", userId)
```

### 2. Updated Dashboard to Show Correct Stats

**Before:**

- Dashboard always fetched from `/api/bookings/my-bookings`
- Caregivers saw their personal bookings stats (not useful)

**After:**

- Caregivers: Fetch from `/api/bookings/assigned-jobs` (shows work assigned to them)
- Clients: Fetch from `/api/bookings/my-bookings` (shows their bookings)
- Dashboard now shows relevant stats based on role

### 3. Fixed Recent Bookings Display

- Shows `client_name` for caregivers (who hired them)
- Shows `caregiver_name` for clients (who they hired)
- Shows earnings (85%) for caregivers
- Shows full amount for clients
- Links to correct page based on role

## Result

### For CAREGIVERS:

- **Dashboard**: Shows assigned jobs stats (work assigned TO them)
- **Assigned Jobs**: Shows jobs where clients hired them (`caregiver_id = user`)
- **My Bookings**: Shows services THEY booked for themselves (`client_id = user`)
- **Schedule**: Shows today's assigned jobs

### For CLIENTS:

- **Dashboard**: Shows their booking stats
- **My Bookings**: Shows services they booked (`client_id = user`)
- No access to "Assigned Jobs" (not relevant)

## Testing

1. Login as CAREGIVER (John Doe)
2. Check "Assigned Jobs" → Should show jobs clients booked with you
3. Check "My Bookings" → Should be empty (unless you booked a service for yourself)
4. Check "Dashboard" → Should show assigned jobs stats

5. Login as CLIENT
6. Book a service with John Doe
7. Login as John Doe again
8. "Assigned Jobs" should now show the new booking
9. "My Bookings" should still be empty (unless John booked something for himself)

## Key Concept

- **My Bookings** = Services I booked (I am the CLIENT)
- **Assigned Jobs** = Work assigned to me (I am the CAREGIVER)

A caregiver can be BOTH:

- A caregiver (providing services) → Shows in "Assigned Jobs"
- A client (booking services for themselves) → Shows in "My Bookings"
