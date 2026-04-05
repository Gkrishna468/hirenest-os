import { AuthGuard } from "./components/AuthGuard";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentRole } from "@/lib/roleStore";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import React, { useEffect } from "react";
import Auth from "./pages/Auth";
import { AccessDenied } from "./components/AccessDenied";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SupabaseBanner } from "./components/SupabaseBanner";
import { ThemeProvider } from "./context/ThemeContext";
import { EmergencyCheck } from './components/EmergencyCheck'
// Page imports
import { AIMatch } from "./pages/AIMatch";
import { AdminRevenuePage } from "./pages/AdminRevenuePage";
import { AdminVerificationPage } from "./pages/AdminVerificationPage";
import { CandidateProfilePage } from "./pages/CandidateProfilePage";
import { ClientDashboard } from "./pages/ClientDashboard";
import { ClientSpendingPage } from "./pages/ClientSpendingPage";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { DealRoomPage } from "./pages/DealRoomPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MatchHistoryPage } from "./pages/MatchHistoryPage";
import { NewVendorDashboard } from "./pages/NewVendorDashboard";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PricingPage } from "./pages/PricingPage";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { RecruiterWorkflowPage } from "./pages/RecruiterWorkflowPage";
import { RequirementDetailPage } from "./pages/RequirementDetailPage";
import { RequirementsPage } from "./pages/RequirementsPage";
import { TalentPage } from "./pages/TalentPage";
import { VendorDashboard } from "./pages/VendorDashboard";
import { VendorDirectoryPage } from "./pages/VendorDirectoryPage";
import { VendorEarningsPage } from "./pages/VendorEarningsPage";
import {
  VendorSubscriptionCancel,
  VendorSubscriptionSuccess,
} from "./pages/VendorSubscriptionPage";

// ==================== LAYOUT COMPONENTS ====================
function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        ❌ Access Denied
      </div>
    );
  }

  return <>{children}</>;
}
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <SupabaseBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="min-h-screen gradient-bg">
      <Outlet />
    </div>
  );
}

// ==================== ROUTE DEFINITIONS ====================

const rootRoute = createRootRoute();

const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "main",
  component: MainLayout,
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

// Public routes (no auth required)
const indexRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/",
  component: LandingPage,
});

const requirementsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/requirements",
  component: RequirementsPage,
});

const requirementDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/requirements/$id",
  component: RequirementDetailPage,
});

const talentRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/talent",
  component: TalentPage,
});

const candidateProfileRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/candidates/$candidateId",
  component: CandidateProfilePage,
});

const vendorDirectoryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/vendors",
  component: VendorDirectoryPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/pricing",
  component: PricingPage,
});

// ✅ AI MATCH ROUTE - Public access (as per your POC)
const aiMatchRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/ai-match",
  component: AIMatch,
});

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  component: LoginPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const authPageRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/auth",
  component: Auth,
});

// Protected: Client routes
const clientDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/client/dashboard",
   component: () => (
    <AuthGuard>
      <ClientDashboard />
    </AuthGuard>
  ),
});

const clientSpendingRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/client/spending",
    component: () => (
    <AuthGuard>
      <ClientSpendingPage />
    </AuthGuard>
  ),
});

// Protected: Vendor routes
const vendorDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/vendor/dashboard",
 component: () => (
    <AuthGuard>
      <VendorGuard>
        <NewVendorDashboard />
      </VendorGuard>
    </AuthGuard>
  ),
});

const vendorEarningsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/vendor/earnings",
    component: () => (
    <AuthGuard>
      <VendorEarningsPage />
    </AuthGuard>
  ),
});

const oldVendorDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/dashboard/vendor",
  component: VendorDashboard,
});

// Protected: Recruiter routes
const recruiterWorkflowRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/recruiter/dashboard",
   component: () => (
    <AuthGuard>
      <RecruiterGuard>
        <RecruiterWorkflowPage />
      </RecruiterGuard>
    </AuthGuard>
  ),
});

const recruiterDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/dashboard/recruiter",
component: () => (
    <AuthGuard>
      <RecruiterGuard>
        <RecruiterDashboard />
      </RecruiterGuard>
    </AuthGuard>
  ),
});

const matchHistoryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/match-history",
   component: () => (
    <AuthGuard>
      <MatchHistoryPage />
    </AuthGuard>
  ),
});

const dealRoomRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/deal-room",
  component: () => (
    <AuthGuard>
      <DealRoomPage />
    </AuthGuard>
  ),
});

const companyDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/dashboard/company",
  component: () => (
    <AuthGuard>
      <CompanyDashboard />
    </AuthGuard>
  ),
});

// Protected: Admin routes
const adminVerificationRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/admin/verification",
  component: () => (
    <AuthGuard>
      <AdminGuard>
        <AdminVerificationPage />
      </AdminGuard>
    </AuthGuard>
  ),
});

const adminRevenueRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/admin/revenue",
  component: () => (
    <AuthGuard>
      <AdminGuard>
        <AdminRevenuePage />
      </AdminGuard>
    </AuthGuard>
  ),
});

// Subscription/Payment routes
const subscriptionSuccessRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/subscription/success",
  component: VendorSubscriptionSuccess,
});

const subscriptionCancelRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/subscription/cancel",
  component: VendorSubscriptionCancel,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/payment-success",
  component: VendorSubscriptionSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/payment-failure",
  component: VendorSubscriptionCancel,
});

// ==================== ROUTE TREE ====================

const routeTree = rootRoute.addChildren([
  mainLayoutRoute.addChildren([
    indexRoute,
    requirementsRoute,
    requirementDetailRoute,
    talentRoute,
    candidateProfileRoute,
    vendorDirectoryRoute,
    pricingRoute,
    aiMatchRoute,              // ✅ AI Match in main layout
    clientDashRoute,
    clientSpendingRoute,
    vendorDashRoute,
    vendorEarningsRoute,
    dealRoomRoute,
    companyDashRoute,
    oldVendorDashRoute,
    recruiterDashRoute,
    recruiterWorkflowRoute,
    matchHistoryRoute,
    adminVerificationRoute,
    adminRevenueRoute,
    subscriptionSuccessRoute,
    subscriptionCancelRoute,
    paymentSuccessRoute,
    paymentFailureRoute,
  ]),
  authLayoutRoute.addChildren([
    loginRoute,
    onboardingRoute,
    authPageRoute,
  ]),
]);

// ==================== ROUTER & APP ====================

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
