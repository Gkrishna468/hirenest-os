import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setCurrentRole } from "@/lib/roleStore";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type Role = "company" | "vendor" | "recruiter" | "admin";

const USER_TYPES = [
  {
    role: "company" as Role,
    icon: "🏢",
    title: "I'm Hiring",
    subtitle: "Post requirements & find talent",
  },
  {
    role: "vendor" as Role,
    icon: "🤝",
    title: "I'm a Vendor",
    subtitle: "Submit candidates & earn",
  },
  {
    role: "recruiter" as Role,
    icon: "👔",
    title: "I'm a Recruiter",
    subtitle: "Manage placements",
  },
  {
    role: "admin" as Role,
    icon: "🔐",
    title: "Admin",
    subtitle: "Platform management",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    role: "company" as Role,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (role === "admin") {
      if (loginData.password !== "hirenest2026") {
        setLoginError("Invalid admin credentials.");
        return;
      }
      setCurrentRole("admin");
      navigate({ to: "/admin/revenue" });
      return;
    }

    // Map login role to stored role
    const storedRole =
      role === "company"
        ? "client"
        : role === "recruiter"
          ? "recruiter"
          : "vendor";
    setCurrentRole(storedRole as "client" | "vendor" | "recruiter");

    const path =
      role === "company"
        ? "/client/dashboard"
        : role === "recruiter"
          ? "/dashboard/recruiter"
          : "/vendor/dashboard";
    navigate({ to: path });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigate({ to: "/onboarding" });
  };

  // Step 1: User type selection
  if (!role) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              HireNest <span className="text-teal">OS</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              How would you like to get started?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {USER_TYPES.map((ut, i) => (
              <motion.button
                key={ut.role}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setRole(ut.role)}
                className="card-surface rounded-2xl p-6 text-left hover:border-teal/50 hover:bg-teal/5 transition-all group cursor-pointer"
                data-ocid={`login.type_${ut.role}`}
              >
                <div className="text-4xl mb-4">{ut.icon}</div>
                <h2 className="font-display text-base font-bold text-foreground group-hover:text-teal transition-colors">
                  {ut.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {ut.subtitle}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Step 2: Login/register form
  const selectedType = USER_TYPES.find((u) => u.role === role)!;

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            HireNest <span className="text-teal">OS</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl">{selectedType.icon}</span>
            <span className="text-muted-foreground text-sm">
              {selectedType.title}
            </span>
            <button
              type="button"
              onClick={() => {
                setRole(null);
                setLoginError("");
              }}
              className="text-xs text-teal hover:underline ml-1"
              data-ocid="login.back_button"
            >
              ← Change
            </button>
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <Tabs defaultValue="login">
            <TabsList className="w-full bg-muted/30 mb-6" data-ocid="auth.tab">
              <TabsTrigger
                value="login"
                className="flex-1"
                data-ocid="auth.tab"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1"
                data-ocid="auth.tab"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <Input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="mt-1 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="login.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPw ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        });
                        setLoginError("");
                      }}
                      className="bg-muted/20 border-border text-foreground placeholder:text-muted-foreground pr-10"
                      data-ocid="login.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <p
                    className="text-xs text-red-500 font-medium"
                    data-ocid="login.error_state"
                  >
                    {loginError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-teal text-white hover:opacity-90 font-semibold h-11 mt-2"
                  disabled={loading}
                  data-ocid="login.submit_button"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                {role === "admin" && (
                  <p className="text-xs text-center text-muted-foreground">
                    Admin passphrase required
                  </p>
                )}
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Full Name
                  </Label>
                  <Input
                    required
                    placeholder="Arjun Sharma"
                    value={regData.name}
                    onChange={(e) =>
                      setRegData({ ...regData, name: e.target.value })
                    }
                    className="mt-1 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="register.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <Input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={regData.email}
                    onChange={(e) =>
                      setRegData({ ...regData, email: e.target.value })
                    }
                    className="mt-1 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="register.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Password
                  </Label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regData.password}
                    onChange={(e) =>
                      setRegData({ ...regData, password: e.target.value })
                    }
                    className="mt-1 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="register.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange text-white hover:opacity-90 font-semibold h-11 mt-2"
                  disabled={loading}
                  data-ocid="register.submit_button"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
