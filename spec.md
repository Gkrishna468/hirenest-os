# HireNest OS

## Current State

- Uses TanStack Router for routing
- Auth is entirely localStorage-based via `roleStore.ts` — no real Supabase session
- LoginPage sets localStorage role; admin checks passphrase `hirenest2026`
- Vendor/Recruiter dashboard routes are completely unprotected (no auth guard)
- LandingPage has embedded PRICING_PLANS with wrong data: 5 candidates/month, tier called "Growth"
- PricingPage.tsx already has correct data: Starter 3/mo, Vendor Pro Rs2999, Enterprise + Contact Sales

## Requested Changes (Diff)

### Add
- ProtectedRoute guard in App.tsx for /vendor/dashboard and /recruiter/dashboard
- Hero CTA button on LandingPage linking to /login
- Supabase real auth in LoginPage (email+password) when VITE_SUPABASE_URL is set

### Modify
- LoginPage.tsx: When isSupabaseConnected, use supabase.auth.signInWithPassword and signUp; store role in profiles table. Fall back to mock flow when not connected.
- App.tsx: Auth guard for vendor/recruiter routes - redirect to /login if no role
- LandingPage.tsx: Fix embedded pricing to match PricingPage (Starter 3/mo, Vendor Pro Rs2999, Enterprise Contact Sales)

### Remove
- Nothing

## Implementation Plan

1. LoginPage.tsx - add Supabase auth when connected, keep mock fallback
2. App.tsx - add ProtectedRoute wrapper for vendor/recruiter dashboard routes
3. LandingPage.tsx - fix pricing array + add hero CTA button to /login
