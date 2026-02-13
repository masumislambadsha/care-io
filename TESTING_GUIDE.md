# Testing Guide - Caregiver Booking System

## Overview

The system now properly separates caregiver views:

- **Assigned Jobs**: Jobs where clients booked the caregiver (caregiver_id = user)
- **My Bookings**: Services the caregiver booked for themselves (client_id = user)

## Complete Workflow

### 1. CLIENT BOOKS A SERVICE

**Steps:**

1. Client logs in (Google OAuth or credentials)
2. Browses services at `/services`
3. Clicks on a service → `/services/[slug]`
4. Clicks "Book Now" → `/booking/[serviceId]`
5. Completes 4-step booking:
   - Choose Caregiver
   - Schedule (date/time)
   - Location (address with cascading dropdowns)
   - Review & Pay
6. Redirected to Stripe checkout
7. After payment → `/booking/success`
8. Booking created with status: `CONFIRMED`

**Database Entry:**

```
bookings table:
- client_id: [CLIENT USER ID]
- caregiver_id: [SELECTED CAREGIVER ID]
- status: CONFIRMED
- payment_status: PAID
```

---

### 2. CAREGIVER SEES THE JOB

**Where Caregivers See Jobs:**

#### A. Assigned Jobs Page (`/caregiver/assigned-jobs`)

- Shows ALL jobs where `caregiver_id = current_user`
- Stats: Pending, Ongoing, Completed, Total
- Filters: all, confirmed, ongoing, completed, cancelled
- Actions:
  - View Details (modal with full info)
  - Start Service (CONFIRMED → ONGOING)
  - Complete Service (ONGOING → COMPLETED)

#### B. Schedule Page (`/caregiver/schedule`)

- Shows ONLY TODAY's jobs from assigned jobs
- Two sections:
  - Today's Schedule (jobs with start_date = today)
  - Upcoming Bookings (all CONFIRMED/ONGOING jobs)

#### C. Dashboard (`/dashboard`)

- Stats based on `/api/bookings/my-bookings`
- For caregivers: Shows bookings where they are the CLIENT
- Recent bookings list

---

### 3. CAREGIVER UPDATES JOB STATUS

**Status Flow:**

```
CONFIRMED → ONGOING → COMPLETED
```

**Actions:**

1. **Start Service** (CONFIRMED → ONGOING)
   - Button appears in Assigned Jobs when status = CONFIRMED
   - Calls `/api/bookings/update-status`
   - Updates booking status to ONGOING
   - Sends notification to client

2. **Complete Service** (ONGOING → COMPLETED)
   - Button appears when status = ONGOING
   - Updates status to COMPLETED
   - Sets `completed_at` timestamp
   - Sends notification to client

**Security:**

- Only the assigned caregiver can update status
- API verifies `booking.caregiver_id === session.user.id`

---

### 4. CLIENT SEES UPDATES

**Client Views:**

#### A. My Bookings (`/my-bookings`)

- Shows bookings where `client_id = current_user`
- Filters by status
- Can view details, leave review (if COMPLETED), cancel booking

#### B. Dashboard (`/dashboard`)

- Stats: Total, Active, Completed bookings
- Total spent
- Recent bookings list

---

## API Endpoints

### For Caregivers:

- `GET /api/bookings/assigned-jobs` - Jobs assigned TO the caregiver
- `POST /api/bookings/update-status` - Update job status (caregiver only)

### For Both:

- `GET /api/bookings/my-bookings` - Bookings where user is CLIENT
  - For clients: Shows their bookings
  - For caregivers: Shows services THEY booked for themselves

### Other:

- `POST /api/bookings/cancel` - Cancel booking with refund policy
- `POST /api/reviews/route` - Leave review (clients only, after COMPLETED)

---

## Testing Scenarios

### Scenario 1: Complete Booking Flow

1. Login as CLIENT
2. Book a service with a specific caregiver
3. Complete payment
4. Logout

5. Login as that CAREGIVER
6. Go to "Assigned Jobs" → Should see the new job (CONFIRMED)
7. Go to "Schedule" → Should see it in upcoming (or today if booked for today)
8. Click "Start Service" → Status changes to ONGOING
9. Click "Complete Service" → Status changes to COMPLETED

10. Logout and login as CLIENT
11. Go to "My Bookings" → Should see status updated
12. Click "Leave Review" → Submit review

### Scenario 2: Caregiver Books Service for Themselves

1. Login as CAREGIVER
2. Book a service (they become the CLIENT)
3. Go to "My Bookings" → Should see their booking
4. Go to "Assigned Jobs" → Should NOT see this booking
5. Go to "Dashboard" → Stats should reflect their personal bookings

### Scenario 3: Multiple Jobs

1. Create multiple bookings with different caregivers
2. Each caregiver should only see jobs assigned to them
3. Clients should see all their bookings

---

## Key Differences

| Page              | Client View                          | Caregiver View                                              |
| ----------------- | ------------------------------------ | ----------------------------------------------------------- |
| **Dashboard**     | Shows bookings where they are CLIENT | Shows bookings where they are CLIENT (personal bookings)    |
| **My Bookings**   | Shows bookings where they are CLIENT | Shows bookings where they are CLIENT (personal bookings)    |
| **Assigned Jobs** | N/A (not accessible)                 | Shows jobs where they are CAREGIVER (work assigned to them) |
| **Schedule**      | N/A (not accessible)                 | Shows TODAY's assigned jobs                                 |

---

## Database Query Logic

### Assigned Jobs (Caregiver Only):

```sql
SELECT * FROM bookings
WHERE caregiver_id = [current_user_id]
ORDER BY created_at DESC
```

### My Bookings (Both):

```sql
SELECT * FROM bookings
WHERE client_id = [current_user_id]
ORDER BY created_at DESC
```

---

## Earnings Calculation

- Platform fee: 15%
- Caregiver earnings: 85%

Example:

- Booking total: $100
- Platform keeps: $15
- Caregiver earns: $85

Displayed in:

- Assigned Jobs page (shows 85% of total)
- Earnings page (calculates total earnings)

---

## Notifications

Automatic notifications sent to CLIENT when:

- Caregiver starts service (CONFIRMED → ONGOING)
- Caregiver completes service (ONGOING → COMPLETED)

Stored in `notifications` table with:

- `type: BOOKING_STATUS_UPDATED`
- `related_id: booking_id`

---

## Current Status

✅ Assigned Jobs page created
✅ API endpoint for assigned jobs
✅ Status update workflow
✅ Schedule page shows today's jobs
✅ Dashboard layout with role-based menu
✅ My Bookings separated from Assigned Jobs
✅ Earnings calculation (85% to caregiver)
✅ Notifications on status change

---

## How to Test

1. **Create Test Accounts:**
   - 1 Client account (Google OAuth or manual)
   - 2-3 Caregiver accounts (manual registration)

2. **Seed Database:**
   - Ensure services exist (run seed.sql if needed)
   - Ensure caregivers have profiles

3. **Test Flow:**
   - Login as client → Book service with Caregiver A
   - Login as Caregiver A → See job in Assigned Jobs
   - Update status: Start → Complete
   - Login as client → See updated status
   - Leave review

4. **Test Separation:**
   - Login as Caregiver A → Book a service for themselves
   - Check "My Bookings" (should show their personal booking)
   - Check "Assigned Jobs" (should NOT show their personal booking)

---

## Next Steps (Optional Enhancements)

- [ ] Real-time notifications (WebSocket/Pusher)
- [ ] Email notifications on status changes
- [ ] SMS notifications
- [ ] Caregiver availability calendar
- [ ] Automatic job assignment based on availability
- [ ] Rating system for caregivers
- [ ] Advanced search filters
- [ ] Mobile app
- [ ] Admin dashboard for monitoring
- [ ] Analytics and reporting
