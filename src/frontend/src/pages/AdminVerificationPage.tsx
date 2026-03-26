import { AdminLockScreen } from "@/components/AdminLockScreen";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  type Candidate,
  type Vendor,
  getCandidates,
  getVendors,
  toggleCandidateVerification,
  toggleVendorVerification,
} from "@/lib/db";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: "teal" | "orange";
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            accent === "teal"
              ? "bg-teal/10 text-teal"
              : "bg-orange/10 text-orange"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminVerificationPage() {
  const {
    isAuthenticated,
    input,
    setInput,
    error,
    setError,
    inputRef,
    handleUnlock,
    handleLock,
  } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <AdminLockScreen
        input={input}
        setInput={setInput}
        error={error}
        setError={setError}
        inputRef={inputRef}
        onUnlock={handleUnlock}
      />
    );
  }

  return <AdminVerificationContent onLock={handleLock} />;
}

function AdminVerificationContent({ onLock }: { onLock: () => void }) {
  const handleLock = onLock;
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getVendors(), getCandidates()]).then(([v, c]) => {
      setVendors(v);
      setCandidates(c);
      setLoading(false);
    });
  }, []);

  const handleToggleVendor = async (id: string) => {
    setToggling(id);
    await toggleVendorVerification(id);
    const updated = await getVendors();
    setVendors(updated);
    setToggling(null);
  };

  const handleToggleCandidate = async (id: string) => {
    setToggling(id);
    await toggleCandidateVerification(id);
    const updated = await getCandidates();
    setCandidates(updated);
    setToggling(null);
  };

  const totalVendors = vendors.length;
  const verifiedVendors = vendors.filter((v) => v.is_verified).length;
  const totalCandidates = candidates.length;
  const verifiedCandidates = candidates.filter((c) => c.is_verified).length;

  const availabilityColor = (a: string) => {
    if (a === "available") return "bg-teal/10 text-teal border-teal/30";
    if (a === "busy") return "bg-red-500/10 text-red-400 border-red-500/30";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2 justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-display">
              Verification Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage trust signals — verify vendors and candidates to unlock
              premium visibility on HireNest OS.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLock}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="admin.secondary_button"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        data-ocid="admin.panel"
      >
        <StatCard
          label="Total Vendors"
          value={totalVendors}
          icon={<Building2 className="h-5 w-5" />}
          accent="orange"
        />
        <StatCard
          label="Verified Vendors"
          value={verifiedVendors}
          icon={<ShieldCheck className="h-5 w-5" />}
          accent="orange"
        />
        <StatCard
          label="Total Candidates"
          value={totalCandidates}
          icon={<Users className="h-5 w-5" />}
          accent="teal"
        />
        <StatCard
          label="Verified Candidates"
          value={verifiedCandidates}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="teal"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="vendors" data-ocid="admin.tab">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger
              value="vendors"
              className="data-[state=active]:bg-orange/10 data-[state=active]:text-orange"
              data-ocid="admin.tab"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Vendors ({totalVendors})
            </TabsTrigger>
            <TabsTrigger
              value="candidates"
              className="data-[state=active]:bg-teal/10 data-[state=active]:text-teal"
              data-ocid="admin.tab"
            >
              <Users className="h-4 w-4 mr-2" />
              Candidates ({totalCandidates})
            </TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <div className="space-y-3">
              {vendors.map((vendor, i) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card
                    className="bg-card border-border hover:border-orange/30 transition-colors"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-foreground">
                              {vendor.name}
                            </span>
                            {vendor.is_verified && (
                              <VerifiedBadge type="vendor" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <Building2 className="inline h-3.5 w-3.5 mr-1" />
                            {vendor.company}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {vendor.email} &middot; {vendor.candidate_count}{" "}
                            candidate{vendor.candidate_count !== 1 ? "s" : ""}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {vendor.specializations.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs bg-muted text-muted-foreground"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {vendor.is_verified ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 min-w-[96px]"
                              onClick={() => handleToggleVendor(vendor.id)}
                              disabled={toggling === vendor.id}
                              data-ocid="admin.delete_button"
                            >
                              {toggling === vendor.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                              )}
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-teal/40 text-teal hover:bg-teal/10 hover:text-teal min-w-[96px]"
                              onClick={() => handleToggleVendor(vendor.id)}
                              disabled={toggling === vendor.id}
                              data-ocid="admin.confirm_button"
                            >
                              {toggling === vendor.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                              )}
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates">
            <div className="space-y-3">
              {candidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card
                    className="bg-card border-border hover:border-teal/30 transition-colors"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-foreground">
                              {candidate.name}
                            </span>
                            {candidate.is_verified && <VerifiedBadge />}
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${availabilityColor(
                                candidate.availability,
                              )}`}
                            >
                              {candidate.availability}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {candidate.role} &middot; {candidate.experience}y
                            exp &middot; {candidate.location}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {candidate.skills.slice(0, 5).map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs bg-muted text-muted-foreground"
                              >
                                {s}
                              </Badge>
                            ))}
                            {candidate.skills.length > 5 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-muted text-muted-foreground"
                              >
                                +{candidate.skills.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {candidate.is_verified ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 min-w-[96px]"
                              onClick={() =>
                                handleToggleCandidate(candidate.id)
                              }
                              disabled={toggling === candidate.id}
                              data-ocid="admin.delete_button"
                            >
                              {toggling === candidate.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                              )}
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-teal/40 text-teal hover:bg-teal/10 hover:text-teal min-w-[96px]"
                              onClick={() =>
                                handleToggleCandidate(candidate.id)
                              }
                              disabled={toggling === candidate.id}
                              data-ocid="admin.confirm_button"
                            >
                              {toggling === candidate.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              )}
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
