import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VendorEntry {
  id: string;
  companyName: string;
  contactPerson: string;
  location: string;
  specializations: string[];
  activeJDs: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  description: string;
  founded: string;
  email: string;
  phone: string;
}

const MOCK_VENDORS: VendorEntry[] = [
  {
    id: "v1",
    companyName: "TechBridge Staffing",
    contactPerson: "Ravi Kumar",
    location: "Bangalore",
    specializations: ["React", "Node.js", "TypeScript", "AWS"],
    activeJDs: 12,
    rating: 4.7,
    totalReviews: 38,
    isVerified: true,
    description:
      "Premium IT staffing firm specializing in full-stack and cloud-native talent. Partnered with 50+ enterprise clients across India and the Middle East.",
    founded: "2016",
    email: "ravi@techbridge.in",
    phone: "+91 98765 43210",
  },
  {
    id: "v2",
    companyName: "CloudForce Solutions",
    contactPerson: "Priya Menon",
    location: "Hyderabad",
    specializations: ["Kubernetes", "DevOps", "Terraform", "GCP"],
    activeJDs: 8,
    rating: 4.5,
    totalReviews: 24,
    isVerified: true,
    description:
      "DevOps and cloud infrastructure specialists. Our candidates average 5+ years in Kubernetes and CI/CD pipeline development.",
    founded: "2018",
    email: "priya@cloudforce.io",
    phone: "+91 87654 32109",
  },
  {
    id: "v3",
    companyName: "DataMinds Talent",
    contactPerson: "Arun Nair",
    location: "Pune",
    specializations: ["Python", "ML", "TensorFlow", "Spark"],
    activeJDs: 5,
    rating: 4.2,
    totalReviews: 17,
    isVerified: true,
    description:
      "Data science and ML engineering talent pool. Pre-vetted candidates from top IITs and NITs with production ML experience.",
    founded: "2019",
    email: "arun@dataminds.co.in",
    phone: "+91 76543 21098",
  },
  {
    id: "v4",
    companyName: "JavaNest Technologies",
    contactPerson: "Suresh Patel",
    location: "Chennai",
    specializations: ["Java", "Spring Boot", "Kafka", "Microservices"],
    activeJDs: 9,
    rating: 4.3,
    totalReviews: 29,
    isVerified: false,
    description:
      "Java-focused staffing with deep expertise in enterprise backend systems, fintech applications, and microservices architecture.",
    founded: "2017",
    email: "suresh@javanest.in",
    phone: "+91 65432 10987",
  },
  {
    id: "v5",
    companyName: "MobileFirst Ventures",
    contactPerson: "Neha Sharma",
    location: "Mumbai",
    specializations: ["Android", "iOS", "Kotlin", "Swift", "Flutter"],
    activeJDs: 6,
    rating: 4.6,
    totalReviews: 21,
    isVerified: true,
    description:
      "Mobile development specialists with talent covering iOS, Android, and cross-platform Flutter development. Strong portfolio across fintech and consumer apps.",
    founded: "2020",
    email: "neha@mobilefirst.in",
    phone: "+91 54321 09876",
  },
  {
    id: "v6",
    companyName: "GoLang Guild",
    contactPerson: "Karthik Rajan",
    location: "Delhi NCR",
    specializations: ["Go", "gRPC", "PostgreSQL", "Redis", "Docker"],
    activeJDs: 4,
    rating: 4.8,
    totalReviews: 13,
    isVerified: true,
    description:
      "Boutique Go engineering talent firm. Our developers have shipped high-throughput backend systems at companies like Ola, Meesho, and Urban Company.",
    founded: "2021",
    email: "karthik@golangguild.dev",
    phone: "+91 43210 98765",
  },
  {
    id: "v7",
    companyName: "FrontierUI Labs",
    contactPerson: "Divya Krishnan",
    location: "Bangalore",
    specializations: ["React", "Vue.js", "Figma", "CSS", "Next.js"],
    activeJDs: 7,
    rating: 4.4,
    totalReviews: 18,
    isVerified: false,
    description:
      "UI/UX and frontend engineering focused staffing. Our candidates specialize in design systems, accessibility, and pixel-perfect implementations.",
    founded: "2020",
    email: "divya@frontierui.in",
    phone: "+91 32109 87654",
  },
  {
    id: "v8",
    companyName: "Apex Recruit Pro",
    contactPerson: "Manish Gupta",
    location: "Kolkata",
    specializations: ["QA", "Selenium", "Cypress", "TestNG", "DevOps"],
    activeJDs: 3,
    rating: 4.1,
    totalReviews: 11,
    isVerified: true,
    description:
      "QA and testing specialists. Focused on automation-first testing talent with deep knowledge of Selenium, Cypress, and CI/CD integration.",
    founded: "2018",
    email: "manish@apexrecruit.in",
    phone: "+91 21098 76543",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function VendorDirectoryPage() {
  const [selectedVendor, setSelectedVendor] = useState<VendorEntry | null>(
    null,
  );
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(
      `Message sent to ${selectedVendor?.contactPerson} at ${selectedVendor?.companyName}`,
    );
    setSending(false);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setSelectedVendor(null);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8 space-y-6"
      data-ocid="vendor_directory.page"
    >
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Building2 className="h-7 w-7 text-teal" />
          Vendor Directory
        </h1>
        <p className="text-muted-foreground mt-1">
          {MOCK_VENDORS.length} verified staffing vendors across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MOCK_VENDORS.map((vendor, idx) => (
          <Card
            key={vendor.id}
            className="card-surface border-border hover:border-teal/30 transition-colors flex flex-col"
            data-ocid={`vendor_directory.item.${idx + 1}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-icon flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-teal" />
                </div>
                {vendor.isVerified && <VerifiedBadge />}
              </div>
              <div className="mt-2">
                <h3 className="font-semibold text-foreground text-sm leading-tight">
                  {vendor.companyName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {vendor.contactPerson}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {vendor.location}
              </div>

              <div className="flex flex-wrap gap-1">
                {vendor.specializations.slice(0, 3).map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-xs px-2 py-0 bg-teal/10 text-teal border-0"
                  >
                    {s}
                  </Badge>
                ))}
                {vendor.specializations.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0 bg-muted text-muted-foreground border-0"
                  >
                    +{vendor.specializations.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {vendor.activeJDs} active JDs
                </span>
                <StarRating rating={vendor.rating} />
              </div>

              <Button
                size="sm"
                className="w-full mt-auto bg-teal text-background hover:bg-teal-600 text-xs font-semibold"
                onClick={() => setSelectedVendor(vendor)}
                data-ocid="vendor_directory.open_modal_button"
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Detail Dialog */}
      <Dialog
        open={!!selectedVendor}
        onOpenChange={(open) => {
          if (!open) setSelectedVendor(null);
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="vendor_directory.dialog">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-icon flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{selectedVendor.companyName}</span>
                      {selectedVendor.isVerified && <VerifiedBadge />}
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedVendor.contactPerson}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Vendor details */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedVendor.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Location: </span>
                      <span className="font-medium text-foreground">
                        {selectedVendor.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Founded: </span>
                      <span className="font-medium text-foreground">
                        {selectedVendor.founded}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Active JDs:{" "}
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedVendor.activeJDs}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Rating: </span>
                      <StarRating rating={selectedVendor.rating} />
                      <span className="text-muted-foreground">
                        ({selectedVendor.totalReviews})
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedVendor.specializations.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-xs bg-teal/10 text-teal border-0"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact form */}
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Send a Message
                  </p>
                  <div className="space-y-1">
                    <Label className="text-xs">Your Name</Label>
                    <Input
                      placeholder="Full name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="h-9 text-sm"
                      data-ocid="vendor_directory.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Your Email</Label>
                    <Input
                      placeholder="email@company.com"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="h-9 text-sm"
                      data-ocid="vendor_directory.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Message</Label>
                    <Textarea
                      placeholder={`Hello ${selectedVendor.contactPerson}, I'm interested in...`}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="text-sm resize-none"
                      rows={3}
                      data-ocid="vendor_directory.textarea"
                    />
                  </div>
                  <Button
                    className="w-full bg-teal text-background hover:bg-teal-600 font-semibold"
                    onClick={handleSendMessage}
                    disabled={sending}
                    data-ocid="vendor_directory.submit_button"
                  >
                    {sending ? "Sending…" : "Send Message"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
