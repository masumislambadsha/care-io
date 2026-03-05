# Bugfix Requirements Document

## Introduction

The caregiver earnings page displays incorrect data ($0.00 total earnings and 0 completed jobs) despite caregivers having completed multiple jobs. This occurs because the earnings page filters bookings by `payment_status === "PAID"`, but when a caregiver marks a job as "COMPLETED", the API only updates the `status` field and `completed_at` timestamp without updating the `payment_status` field. This disconnect between job completion and payment status tracking causes completed jobs to be invisible on the earnings page, preventing caregivers from seeing their earned income.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a caregiver marks a booking as "COMPLETED" via the update-status API THEN the system updates only the `status` field to "COMPLETED" and sets `completed_at` timestamp, but does NOT update the `payment_status` field

1.2 WHEN the earnings page loads and filters bookings by `payment_status === "PAID"` THEN the system excludes all completed bookings that lack the "PAID" payment_status, resulting in $0.00 total earnings and 0 completed jobs displayed

1.3 WHEN a caregiver has 5 completed jobs visible on the assigned jobs page THEN the earnings page shows 0 completed jobs because the `payment_status` field was never set to "PAID"

### Expected Behavior (Correct)

2.1 WHEN a caregiver marks a booking as "COMPLETED" via the update-status API THEN the system SHALL update the `status` field to "COMPLETED", set the `completed_at` timestamp, AND update the `payment_status` field to "PAID"

2.2 WHEN the earnings page loads and filters bookings by `payment_status === "PAID"` THEN the system SHALL include all completed bookings with "PAID" payment_status, correctly displaying total earnings and completed job count

2.3 WHEN a caregiver has 5 completed jobs THEN the earnings page SHALL display 5 completed jobs with the correct earnings calculated as `total_amount * 0.85` (85% after 15% platform fee)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a caregiver updates a booking to "CONFIRMED", "ONGOING", or "CANCELLED" status THEN the system SHALL CONTINUE TO update only the `status` field without modifying the `payment_status` field

3.2 WHEN the earnings page calculates caregiver earnings THEN the system SHALL CONTINUE TO apply the 85% calculation (total_amount \* 0.85) after the 15% platform fee

3.3 WHEN a booking status is updated THEN the system SHALL CONTINUE TO create a notification for the client about the status change

3.4 WHEN only the assigned caregiver attempts to update a booking status THEN the system SHALL CONTINUE TO allow the update and reject updates from other users

3.5 WHEN the earnings page displays earnings data THEN the system SHALL CONTINUE TO show booking number, service name, client name, amount, date, and status for each earning entry
