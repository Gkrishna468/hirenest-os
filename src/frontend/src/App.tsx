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
import { useEffect } from "react";
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

// ==================== GUARD COMPONENTS ====================

function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = getCurrentRole();
  // If a non-admin role is set, show Access Denied
  if (role !== null && role !== "admin") {
    return <AccessDenied />;
  }
  // If null (not logged in) or admin, render the page (which has its own AdminLockScreen)
  return <>{children}</>;
}

function VendorGuard({ children }: { children: React.ReactNode }) {
  const role = getCurrentRole();
  if (!role || role !== "vendor") {
    // Redirect to login — use a component that triggers navigation
    return <RedirectToLogin />;
  }
  return <>{children}</>;
}

function RecruiterGuard({ children }: { children: React.ReactNode }) {
  const role = getCurrentRole();
  if (!role || role !== "recruiter") {
    return <RedirectToLogin />;
  }
  return <>{children}</>;
}

function RedirectToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/auth" });
  }, [navigate]);
  return null;
}

// ==================== LAYOUT COMPONENTS ====================

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <EmergencyCheck />
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
  component: ClientDashboard,
});

const clientSpendingRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/client/spending",
  component: ClientSpendingPage,
});

// Protected: Vendor routes
const vendorDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/vendor/dashboard",
  component: () => (
    <VendorGuard>
      <NewVendorDashboard />
    </VendorGuard>
  ),
});

const vendorEarningsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/vendor/earnings",
  component: VendorEarningsPage,
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
    <RecruiterGuard>
      <RecruiterWorkflowPage />
    </RecruiterGuard>
  ),
});

const recruiterDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/dashboard/recruiter",
  component: () => (
    <RecruiterGuard>
      <RecruiterDashboard />
    </RecruiterGuard>
  ),
});

const matchHistoryRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/match-history",
  component: MatchHistoryPage,
});

const dealRoomRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/deal-room",
  component: DealRoomPage,
});

const companyDashRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/dashboard/company",
  component: CompanyDashboard,
});

// Protected: Admin routes
const adminVerificationRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/admin/verification",
  component: () => (
    <AdminGuard>
      <AdminVerificationPage />
    </AdminGuard>
  ),
});

const adminRevenueRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/admin/revenue",
  component: () => (
    <AdminGuard>
      <AdminRevenuePage />
    </AdminGuard>
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
