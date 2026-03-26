import { FilterSidebar, type SidebarFilters } from "@/components/FilterSidebar";
import { RequirementCard } from "@/components/RequirementCard";
import { RequirementDetailModal } from "@/components/RequirementDetailModal";
import { SubmitCandidateModal } from "@/components/SubmitCandidateModal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { type Requirement, getRequirements } from "@/lib/db";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SidebarFilters>({
    skills: [],
    location: "",
    verifiedOnly: false,
    availability: "",
  });

  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitReq, setSubmitReq] = useState<Requirement | null>(null);

  const handleView = (req: Requirement) => {
    setSelectedReq(req);
    setDetailOpen(true);
  };

  const handleSubmitCandidate = (req: Requirement) => {
    setSubmitReq(req);
    setSubmitOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    getRequirements({
      skills: filters.skills,
      location: filters.location,
      search,
    }).then((data) => {
      setRequirements(data);
      setLoading(false);
    });
  }, [filters, search]);

  const featured = requirements.filter((r) => r.is_featured);
  const regular = requirements.filter((r) => !r.is_featured);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Requirements Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse active IT requirements from India&apos;s top companies
          </p>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requirements, companies, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
            data-ocid="requirements.search_input"
          />
        </div>

        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            mode="requirements"
          />
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
                data-ocid="requirements.loading_state"
              >
                {SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-64 rounded-xl bg-card" />
                ))}
              </div>
            ) : requirements.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="requirements.empty_state"
              >
                <p className="text-lg font-medium">No requirements found</p>
                <p className="text-sm mt-1">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {featured.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-orange uppercase tracking-widest mb-3">
                      Featured
                    </h2>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {featured.map((req, i) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          data-ocid={`requirements.item.${i + 1}`}
                        >
                          <RequirementCard
                            requirement={req}
                            onView={() => handleView(req)}
                            onSubmitCandidate={() => handleSubmitCandidate(req)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {regular.length > 0 && (
                  <div>
                    {featured.length > 0 && (
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                        All Requirements
                      </h2>
                    )}
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {regular.map((req, i) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          data-ocid={`requirements.item.${featured.length + i + 1}`}
                        >
                          <RequirementCard
                            requirement={req}
                            onView={() => handleView(req)}
                            onSubmitCandidate={() => handleSubmitCandidate(req)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <RequirementDetailModal
        requirement={selectedReq}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSubmitCandidate={(req) => {
          setDetailOpen(false);
          handleSubmitCandidate(req);
        }}
      />
      <SubmitCandidateModal
        requirement={submitReq}
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
      />
    </div>
  );
}
