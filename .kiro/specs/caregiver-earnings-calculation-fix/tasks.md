# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Earnings Page Calls Wrong Endpoint and Uses Wrong Response Structure
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to caregivers loading the earnings page with completed jobs
  - Test that when a caregiver with completed jobs loads the earnings page, the component calls `/api/bookings/assigned-jobs` (not `/api/bookings/my-bookings`), accesses `data.jobs` (not `data.bookings`), and uses `start_date` (not `created_at`)
  - The test assertions should verify: correct API endpoint called, correct response property accessed, correct date field used, and non-zero earnings displayed
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: which wrong endpoint is called, which wrong response property is accessed, which wrong date field is used
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Earnings Page Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-earnings page interactions:
    - Clients viewing their bookings via `/api/bookings/my-bookings`
    - Caregivers updating booking status to "CONFIRMED", "ONGOING", "CANCELLED" (without affecting payment_status)
    - Earnings calculation formula (total_amount \* 0.85)
    - Client notifications created on status updates
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix earnings page API endpoint and response handling
  - [ ] 3.1 Update earnings page to call correct API endpoint
    - Change API endpoint from `/api/bookings/my-bookings` to `/api/bookings/assigned-jobs` (line 42)
    - Update response structure handling from `data.bookings` to `data.jobs` (line 45)
    - Update date field from `created_at` to `start_date` (line 52)
    - _Bug_Condition: isBugCondition(input) where input.userRole === "CAREGIVER" AND input.hasCompletedJobs === true AND earningsPageLoaded === true_
    - _Expected_Behavior: Earnings page calls `/api/bookings/assigned-jobs`, parses `data.jobs`, uses `start_date`, and displays correct total earnings and completed job count_
    - _Preservation: Client bookings via my-bookings endpoint, status updates to non-COMPLETED states, earnings calculation formula, client notifications, and display format remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Earnings Page Displays Caregiver's Completed Jobs
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Earnings Page Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
