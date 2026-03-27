# HireNest OS — Submission Workflow Persistence (Phase 1 Last Mile)

## Current State

- `lib/db.ts` contains all data as in-memory mock arrays (MOCK_SUBMISSIONS, MOCK_PLACEMENTS, etc.)
- `lib/planEnforcement.ts` tracks monthly submission counts in localStorage
- `lib/supabase.ts` has a Supabase client (conditionally initialized if env vars set) and a full `SUPABASE_SCHEMA` SQL string but the schema does NOT include `placement_transactions` (only `submissions`)
- `SubmitCandidateModal.tsx` uses hardcoded MOCK_CANDIDATES and calls a no-op toast on submit
- `RecruiterDashboard.tsx` uses `getRequirements()` + `getSubmissions()` from mock db
- `RequirementDetailPage.tsx` uses `getPlacementsByRequirement()` + `updatePlacementStatus()` from mock db
- `VendorDashboard.tsx` uses `getCandidates()` + `getSubmissions()` from mock db
- No real-time subscriptions exist anywhere
- Status transitions happen only in memory and are lost on page refresh

## Requested Changes (Diff)

### Add
- `lib/submissionsDb.ts` — Supabase-first data layer for submissions/placements. Wraps all submission CRUD with Supabase calls, falls back to mock if Supabase is not connected. Exposes:
  - `getSubmissionsForRequirement(reqId)` — query submissions table
  - `getSubmissionsForVendor(vendorId)` — query by vendor_id
  - `createSubmission(data)` — insert into submissions, calculate match score
  - `updateSubmissionStatus(id, status)` — update status field
  - `getMonthlySubmissionCount(vendorId)` — count for plan enforcement
  - `subscribeToSubmissions(reqId, callback)` — Supabase realtime channel
- `SUPABASE_SCHEMA` in `supabase.ts`: extend to include `placement_transactions` table with all required fields (vendor_id, status enum with offer_extended/joined, total_budget, commission, payout, payment statuses)
- SQL migration comment block at top of schema string showing the full updated schema
- Status transition dropdown in `RecruiterDashboard.tsx` — per-submission `<select>` that calls `updateSubmissionStatus()` and reflects in real time
- Vendor submission progress bar: in `VendorDashboard.tsx`, per-submission pipeline progress bar showing the 5 stages (submitted → shortlisted → interview → offer_extended → joined)
- Plan enforcement updated to use `getMonthlySubmissionCount()` from Supabase when connected

### Modify
- `SubmitCandidateModal.tsx` — wire `handleSubmit` to call `createSubmission()` from `submissionsDb.ts`, load real candidates from vendor's bench via `getCandidates({ vendorId })`, show plan limit UI (usage badge + block at limit)
- `RecruiterDashboard.tsx` — use `getSubmissionsForRequirement()` + `subscribeToSubmissions()` for real-time updates; add status dropdown (submitted/shortlisted/interview/offer_extended/joined/rejected) per candidate row
- `RequirementDetailPage.tsx` — use `getSubmissionsForRequirement()` and `updateSubmissionStatus()` from submissionsDb; subscribe to real-time updates so kanban updates without refresh
- `VendorDashboard.tsx` — use `getSubmissionsForVendor()` to load submission list; show 5-step progress bar per submission showing current stage; show plan usage from Supabase count
- `lib/planEnforcement.ts` — `getPlanStatus()` accepts an optional async `getCountFn` so when Supabase is connected it queries the count; otherwise falls back to localStorage

### Remove
- Nothing removed — mock data stays as fallback when Supabase env vars are absent

## Implementation Plan

1. Extend `SUPABASE_SCHEMA` in `supabase.ts` to add `placement_transactions` table with full status enum and financial fields
2. Create `lib/submissionsDb.ts` with Supabase-first CRUD + real-time subscription helper + mock fallback
3. Update `lib/planEnforcement.ts` to accept async count function for Supabase-backed limit check
4. Update `SubmitCandidateModal.tsx`: load real vendor candidates, wire submission to submissionsDb, enforce plan limit
5. Update `RecruiterDashboard.tsx`: replace mock calls with submissionsDb, add status transition dropdown per row, subscribe to real-time channel
6. Update `VendorDashboard.tsx`: replace mock calls with submissionsDb, add 5-stage progress bar per submission
7. Update `RequirementDetailPage.tsx`: use submissionsDb, subscribe to real-time, kanban advances persist to Supabase
8. Validate (typecheck + build)
