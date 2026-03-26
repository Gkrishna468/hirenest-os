import { CandidateCard } from "@/components/CandidateCard";
import { FilterSidebar, type SidebarFilters } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  type Candidate,
  type Vendor,
  getCandidates,
  getVendors,
} from "@/lib/db";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export function TalentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SidebarFilters>({
    skills: [],
    location: "",
    verifiedOnly: false,
    availability: "",
  });
  const [vendorMap, setVendorMap] = useState<Map<string, Vendor>>(new Map());
  const [contactCandidate, setContactCandidate] = useState<Candidate | null>(
    null,
  );
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    getVendors().then((vendors) => {
      const map = new Map<string, Vendor>();
      for (const v of vendors) map.set(v.id, v);
      setVendorMap(map);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getCandidates({
      skills: filters.skills,
      availability: filters.availability || undefined,
      verifiedOnly: filters.verifiedOnly,
      search,
    }).then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  }, [filters, search]);

  const handleContact = (c: Candidate) => {
    setContactCandidate(c);
    setContactName("");
    setContactEmail("");
    setContactMessage(
      `Hi, I'm interested in ${c.name} for a ${c.role} position. Please share their availability and profile.`,
    );
  };

  const handleSendInquiry = () => {
    const vendor = contactCandidate
      ? vendorMap.get(contactCandidate.vendor_id)
      : null;
    const vendorCompany = vendor?.company ?? "the vendor";
    toast.success(
      `Inquiry sent to ${vendorCompany}! They'll reach out within 24 hours.`,
    );
    setContactCandidate(null);
  };

  const vendor = contactCandidate
    ? vendorMap.get(contactCandidate.vendor_id)
    : null;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Talent Bench
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse verified IT professionals ready for deployment
          </p>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground"
            data-ocid="talent.search_input"
          />
        </div>

        <div className="flex gap-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            mode="talent"
          />
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="talent.loading_state"
              >
                {SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-56 rounded-xl bg-card" />
                ))}
              </div>
            ) : candidates.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="talent.empty_state"
              >
                <p className="text-lg font-medium">No candidates found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`talent.item.${i + 1}`}
                  >
                    <CandidateCard candidate={c} onContact={handleContact} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Vendor Dialog */}
      <Dialog
        open={contactCandidate !== null}
        onOpenChange={(open) => !open && setContactCandidate(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="talent.dialog">
          <DialogHeader>
            <DialogTitle>
              Contact Vendor for {contactCandidate?.name}
            </DialogTitle>
          </DialogHeader>

          {contactCandidate && (
            <div className="space-y-4">
              {/* Candidate summary */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {contactCandidate.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {contactCandidate.location}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {contactCandidate.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-sky-100 text-sky-700 rounded-full px-2 py-0.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Rate: {contactCandidate.rate}
                </p>
              </div>

              {/* Vendor info */}
              {vendor && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
                    {vendor.company[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {vendor.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Your Name
                  </Label>
                  <Input
                    placeholder="Enter your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    data-ocid="talent.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Your Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    data-ocid="talent.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Message
                  </Label>
                  <Textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="resize-none"
                    data-ocid="talent.textarea"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <Button
                  variant="outline"
                  onClick={() => setContactCandidate(null)}
                  data-ocid="talent.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-teal hover:bg-teal/90 text-white"
                  onClick={handleSendInquiry}
                  data-ocid="talent.submit_button"
                >
                  Send Inquiry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
