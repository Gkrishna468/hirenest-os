# HireNest OS — V9: Role-Based Nav, Gap Notifications & Training Recommendations

## Current State
- Navbar shows all links to every user (AI Match, Talent Bench, Requirements, Deal Room, Pricing, Verify, Revenue)
- No role-based access control in routing — anyone can navigate to /admin/verification or /admin/revenue by typing the URL
- Login page stores selected role in local component state but doesn't persist it globally
- AI Match page shows skill gap chips (green ✓ matched, red ✗ missing) but no action for partially matching candidates
- No "Recommended Training" attached to missing skill chips
- No client spending page or vendor earnings page (separate from dashboard)
- Matching behavior: all candidates shown ranked by score — CORRECT. Gaps are highlighted — CORRECT. No gap-based notification workflow.

## Requested Changes (Diff)

### Add
- `lib/navigation.ts` — `navigationByRole` config mapping admin/client/vendor/recruiter to their allowed nav links
- `lib/roleStore.ts` — simple localStorage-backed role store (`getCurrentRole`, `setCurrentRole`, `clearRole`)
- `/client/spending` page — KPI cards (Total Spent, Active Hires, Pending Payments) + Spending by Requirement table (mock data)
- `/vendor/earnings` page — KPI cards (Total Earned, Pending Payout, This Month) + Earnings by Placement table (mock data)
- `GapConnectModal` component — shown when a candidate score is 80-99%. Two-side flow:
  - **Client view**: "A candidate matches your requirement but is missing [skills]. Request them to update their CV?" → sends anonymous request
  - **Vendor view**: "Your candidate partially matches a requirement. Missing: [skills]. Recommended training shown. Would you like to update their CV?"
  - Client company name hidden from vendor; vendor name/company hidden from client
- `RecommendedTraining` map in `lib/training.ts` — maps common skill names to recommended courses:
  - AWS → "AWS Certified Solutions Architect – Associate"
  - React → "React – The Complete Guide (Udemy)"
  - TypeScript → "TypeScript: The Complete Developer's Guide"
  - Kubernetes → "Kubernetes for Developers (Linux Foundation)"
  - Python → "Python Bootcamp – Zero to Hero"
  - TensorFlow → "TensorFlow Developer Certificate"
  - etc.
- Missing skill chips on CandidateCard and AIMatchPage now show a tooltip or inline recommendation: "Missing AWS → AWS Certified Solutions Architect"
- `AccessDenied` component — shown when a non-admin user navigates to /admin/* routes directly

### Modify
- `Navbar.tsx` — reads `getCurrentRole()` from roleStore. If role is set, renders role-specific nav links from `navigationByRole`. If no role (public/landing), shows original public links. Adds role badge next to logo when logged in.
- `LoginPage.tsx` — on successful login, calls `setCurrentRole(role)` to persist role in localStorage
- `App.tsx`:
  - Add routes for `/client/spending` and `/vendor/earnings`
  - Admin routes (`/admin/verification`, `/admin/revenue`) wrapped to check role: non-admin gets AccessDenied page instead of passphrase prompt (or in addition to it)
- `AIMatchPage.tsx` — for candidates with score 80-99%: show an amber "Gap Connect" button that opens GapConnectModal. Confirmed gap connection adds a toast notification.
- `CandidateCard.tsx` — missing skill chips show recommended training as a small tooltip text below: "→ AWS Certified Solutions Architect"
- `RequirementDetailPage.tsx` — submitted candidates in pipeline with 80-99% score get a "Request CV Update" chip action in their pipeline card

### Remove
- Nothing removed; admin pages remain accessible for admin role, just blocked for non-admins

## Implementation Plan

1. Create `src/lib/roleStore.ts` — `getCurrentRole()`, `setCurrentRole(role)`, `clearRole()` using localStorage
2. Create `src/lib/navigation.ts` — `navigationByRole` config (admin / client / vendor / recruiter)
3. Create `src/lib/training.ts` — `TRAINING_RECOMMENDATIONS` map (skill → course name + URL placeholder)
4. Update `LoginPage.tsx` — call `setCurrentRole(selectedRole)` on login submit; also add Admin option (uses passphrase `hirenest2026` to set role to 'admin')
5. Update `Navbar.tsx` — read role from roleStore; render role-specific nav items; show role badge; logout clears role
6. Create `AccessDenied.tsx` — simple locked page component with back button
7. Update `App.tsx` — add /client/spending and /vendor/earnings routes; wrap admin routes with role check
8. Create `ClientSpendingPage.tsx` — spending KPIs + table
9. Create `VendorEarningsPage.tsx` — earnings KPIs + table
10. Create `GapConnectModal.tsx` — two-sided anonymous gap workflow modal
11. Update `AIMatchPage.tsx` — add "Gap Connect" button for 80-99% candidates; add training tooltip to missing chips
12. Update `CandidateCard.tsx` — add recommended training annotation to missing skill chips
13. Update `RequirementDetailPage.tsx` — "Request CV Update" action for gap candidates in pipeline
