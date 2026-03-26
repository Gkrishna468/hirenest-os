import { calculateMatchScore } from "./matching";

export interface Requirement {
  id: string;
  title: string;
  company: string;
  skills: string[];
  budget_min: number;
  budget_max: number;
  location: string;
  experience_min: number;
  experience_max: number;
  description: string;
  status: "active" | "closed" | "paused";
  is_featured: boolean;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: number;
  rate: number;
  availability: "available" | "busy" | "open";
  is_verified: boolean;
  location: string;
  bio: string;
  vendor_id: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  is_verified: boolean;
  candidate_count: number;
  specializations: string[];
  created_at: string;
}

export interface Submission {
  id: string;
  requirement_id: string;
  candidate_id: string;
  match_score: number;
  status: "submitted" | "shortlisted" | "interview" | "closed" | "rejected";
  notes: string;
  created_at: string;
  candidate?: Candidate;
  requirement?: Requirement;
}

const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: "req-1",
    title: "Senior React Developer",
    company: "Infosys Digital",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    budget_min: 80000,
    budget_max: 120000,
    location: "Bangalore",
    experience_min: 4,
    experience_max: 8,
    description:
      "Looking for a senior React developer to lead our frontend team on a digital banking platform. Strong TypeScript and GraphQL skills required.",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-2",
    title: "DevOps Engineer",
    company: "TCS Cloud Services",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
    budget_min: 90000,
    budget_max: 130000,
    location: "Hyderabad",
    experience_min: 3,
    experience_max: 6,
    description:
      "Need a DevOps engineer for large-scale cloud infrastructure migration. Kubernetes expertise is a must.",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-3",
    title: "Python ML Engineer",
    company: "Wipro AI Labs",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL"],
    budget_min: 100000,
    budget_max: 150000,
    location: "Pune",
    experience_min: 5,
    experience_max: 10,
    description:
      "Seeking an ML engineer to build and deploy production ML pipelines for our retail analytics product.",
    status: "active",
    is_featured: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-4",
    title: "Java Microservices Architect",
    company: "HCL Technologies",
    skills: ["Java", "Spring Boot", "Kafka", "Microservices", "PostgreSQL"],
    budget_min: 110000,
    budget_max: 160000,
    location: "Chennai",
    experience_min: 7,
    experience_max: 12,
    description:
      "Architect-level Java developer needed for high-traffic fintech microservices redesign.",
    status: "active",
    is_featured: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-5",
    title: "Full Stack Node.js Developer",
    company: "Razorpay",
    skills: ["Node.js", "React", "MongoDB", "Redis", "TypeScript"],
    budget_min: 85000,
    budget_max: 125000,
    location: "Bangalore",
    experience_min: 3,
    experience_max: 7,
    description:
      "Join our payments infrastructure team. Experience with high-volume transaction systems preferred.",
    status: "active",
    is_featured: false,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-6",
    title: "Android Developer (Senior)",
    company: "PhonePe",
    skills: ["Android", "Kotlin", "Jetpack Compose", "Firebase", "REST APIs"],
    budget_min: 75000,
    budget_max: 110000,
    location: "Bangalore",
    experience_min: 4,
    experience_max: 8,
    description:
      "Build next-gen mobile payment features for 400M+ users. Jetpack Compose mastery required.",
    status: "active",
    is_featured: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-7",
    title: "Data Engineer",
    company: "Flipkart",
    skills: ["Spark", "Python", "Airflow", "BigQuery", "Kafka"],
    budget_min: 95000,
    budget_max: 140000,
    location: "Bangalore",
    experience_min: 4,
    experience_max: 9,
    description:
      "Build and scale data pipelines processing 10M+ events/day for our e-commerce analytics platform.",
    status: "active",
    is_featured: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let MOCK_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "Arjun Sharma",
    role: "Senior React Developer",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Redux"],
    experience: 6,
    rate: 95000,
    availability: "available",
    is_verified: true,
    location: "Bangalore",
    bio: "Ex-Swiggy frontend lead. Built consumer apps serving 20M+ daily users.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-2",
    name: "Priya Nair",
    role: "DevOps / Cloud Engineer",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Python"],
    experience: 5,
    rate: 105000,
    availability: "available",
    is_verified: true,
    location: "Hyderabad",
    bio: "AWS certified solutions architect with strong Kubernetes and GitOps experience.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-3",
    name: "Rahul Verma",
    role: "Python ML Engineer",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL", "Docker"],
    experience: 7,
    rate: 130000,
    availability: "open",
    is_verified: true,
    location: "Pune",
    bio: "ML researcher turned engineer. Deployed models at scale for Flipkart's recommendation system.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-4",
    name: "Sneha Kulkarni",
    role: "Java Microservices Developer",
    skills: [
      "Java",
      "Spring Boot",
      "Kafka",
      "Microservices",
      "PostgreSQL",
      "Redis",
    ],
    experience: 8,
    rate: 140000,
    availability: "available",
    is_verified: false,
    location: "Chennai",
    bio: "10+ years Java experience, specialized in high-throughput fintech systems at HDFC Bank IT.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-5",
    name: "Mohammed Irfan",
    role: "Full Stack Developer",
    skills: ["Node.js", "React", "MongoDB", "Redis", "TypeScript", "GraphQL"],
    experience: 4,
    rate: 88000,
    availability: "available",
    is_verified: true,
    location: "Bangalore",
    bio: "Full-stack developer with strong Node.js backend skills and React frontend experience.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-6",
    name: "Deepika Reddy",
    role: "Android Developer",
    skills: [
      "Android",
      "Kotlin",
      "Jetpack Compose",
      "Firebase",
      "REST APIs",
      "MVVM",
    ],
    experience: 5,
    rate: 95000,
    availability: "busy",
    is_verified: true,
    location: "Bangalore",
    bio: "Built Paytm's core payment flow UI. Jetpack Compose expert with 3M+ DAU app experience.",
    vendor_id: "vendor-1",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-7",
    name: "Vikram Anand",
    role: "Data Engineer",
    skills: ["Spark", "Python", "Airflow", "BigQuery", "Kafka", "DBT"],
    experience: 6,
    rate: 115000,
    availability: "open",
    is_verified: false,
    location: "Bangalore",
    bio: "Built Meesho's data platform from scratch. Experienced in streaming and batch data pipelines.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-8",
    name: "Ananya Iyer",
    role: "Frontend Engineer",
    skills: ["React", "Vue.js", "TypeScript", "CSS", "Figma"],
    experience: 3,
    rate: 72000,
    availability: "available",
    is_verified: false,
    location: "Mumbai",
    bio: "Frontend specialist with an eye for pixel-perfect UIs and design system expertise.",
    vendor_id: "vendor-2",
    created_at: new Date().toISOString(),
  },
  {
    id: "cand-9",
    name: "Rohan Gupta",
    role: "Backend / API Developer",
    skills: ["Go", "gRPC", "PostgreSQL", "Redis", "Docker", "AWS"],
    experience: 5,
    rate: 110000,
    availability: "available",
    is_verified: true,
    location: "Delhi NCR",
    bio: "Go backend engineer from Ola Engineering. Built ride-matching service handling 100K RPS.",
    vendor_id: "vendor-3",
    created_at: new Date().toISOString(),
  },
];

let MOCK_VENDORS: Vendor[] = [
  {
    id: "vendor-1",
    name: "Ravi Kumar",
    company: "TechBridge Staffing",
    email: "ravi@techbridge.in",
    is_verified: true,
    candidate_count: 3,
    specializations: ["React", "Node.js", "TypeScript"],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "vendor-2",
    name: "Meena Patel",
    company: "SkillFirst Solutions",
    email: "meena@skillfirst.in",
    is_verified: true,
    candidate_count: 3,
    specializations: ["DevOps", "AWS", "Kubernetes"],
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "vendor-3",
    name: "Suresh Nair",
    company: "DataPro Talent",
    email: "suresh@datapro.in",
    is_verified: false,
    candidate_count: 3,
    specializations: ["Python", "ML", "Data Engineering"],
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "vendor-4",
    name: "Kavitha Reddy",
    company: "CloudForce Staffing",
    email: "kavitha@cloudforce.in",
    is_verified: false,
    candidate_count: 1,
    specializations: ["Java", "Microservices", "Spring"],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    requirement_id: "req-1",
    candidate_id: "cand-1",
    match_score: calculateMatchScore(
      ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Redux"],
    ).score,
    status: "shortlisted",
    notes: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-2",
    requirement_id: "req-1",
    candidate_id: "cand-8",
    match_score: calculateMatchScore(
      ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      ["React", "Vue.js", "TypeScript", "CSS", "Figma"],
    ).score,
    status: "submitted",
    notes: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-3",
    requirement_id: "req-2",
    candidate_id: "cand-2",
    match_score: calculateMatchScore(
      ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
      ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Python"],
    ).score,
    status: "interview",
    notes: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-4",
    requirement_id: "req-3",
    candidate_id: "cand-3",
    match_score: calculateMatchScore(
      ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL"],
      ["Python", "TensorFlow", "PyTorch", "MLOps", "SQL", "Docker"],
    ).score,
    status: "shortlisted",
    notes: "",
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-5",
    requirement_id: "req-5",
    candidate_id: "cand-5",
    match_score: calculateMatchScore(
      ["Node.js", "React", "MongoDB", "Redis", "TypeScript"],
      ["Node.js", "React", "MongoDB", "Redis", "TypeScript", "GraphQL"],
    ).score,
    status: "submitted",
    notes: "",
    created_at: new Date().toISOString(),
  },
];

export interface FiltersReq {
  skills?: string[];
  location?: string;
  experienceMin?: number;
  budgetMax?: number;
  search?: string;
}

export interface FiltersCandidate {
  skills?: string[];
  availability?: string;
  rateMax?: number;
  verifiedOnly?: boolean;
  search?: string;
}

export async function getRequirements(
  filters?: FiltersReq,
): Promise<Requirement[]> {
  let result = [...MOCK_REQUIREMENTS];
  if (filters?.skills?.length) {
    result = result.filter((r) =>
      filters.skills!.some((s) =>
        r.skills.some((rs) => rs.toLowerCase().includes(s.toLowerCase())),
      ),
    );
  }
  if (filters?.location) {
    result = result.filter((r) =>
      r.location.toLowerCase().includes(filters.location!.toLowerCase()),
    );
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }
  return result;
}

export async function getCandidates(
  filters?: FiltersCandidate,
): Promise<Candidate[]> {
  let result = [...MOCK_CANDIDATES];
  if (filters?.skills?.length) {
    result = result.filter((c) =>
      filters.skills!.some((s) =>
        c.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase())),
      ),
    );
  }
  if (filters?.availability) {
    result = result.filter((c) => c.availability === filters.availability);
  }
  if (filters?.verifiedOnly) {
    result = result.filter((c) => c.is_verified);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }
  return result;
}

export async function getVendors(): Promise<Vendor[]> {
  return [...MOCK_VENDORS];
}

export async function toggleCandidateVerification(id: string): Promise<void> {
  const c = MOCK_CANDIDATES.find((cand) => cand.id === id);
  if (c) c.is_verified = !c.is_verified;
}

export async function toggleVendorVerification(id: string): Promise<void> {
  const v = MOCK_VENDORS.find((vendor) => vendor.id === id);
  if (v) v.is_verified = !v.is_verified;
}

export async function getSubmissions(
  requirementId?: string,
): Promise<Submission[]> {
  const subs = requirementId
    ? MOCK_SUBMISSIONS.filter((s) => s.requirement_id === requirementId)
    : MOCK_SUBMISSIONS;
  return subs.map((s) => ({
    ...s,
    candidate: MOCK_CANDIDATES.find((c) => c.id === s.candidate_id),
    requirement: MOCK_REQUIREMENTS.find((r) => r.id === s.requirement_id),
  }));
}

export async function createRequirement(
  data: Partial<Requirement>,
): Promise<Requirement> {
  const newReq: Requirement = {
    id: `req-${Date.now()}`,
    title: data.title || "",
    company: data.company || "",
    skills: data.skills || [],
    budget_min: data.budget_min || 0,
    budget_max: data.budget_max || 0,
    location: data.location || "",
    experience_min: data.experience_min || 0,
    experience_max: data.experience_max || 0,
    description: data.description || "",
    status: "active",
    is_featured: false,
    created_at: new Date().toISOString(),
  };
  MOCK_REQUIREMENTS.unshift(newReq);
  return newReq;
}

export async function createCandidate(
  data: Partial<Candidate>,
): Promise<Candidate> {
  const newCand: Candidate = {
    id: `cand-${Date.now()}`,
    name: data.name || "",
    role: data.role || "",
    skills: data.skills || [],
    experience: data.experience || 0,
    rate: data.rate || 0,
    availability: data.availability || "available",
    is_verified: false,
    location: data.location || "",
    bio: data.bio || "",
    vendor_id: data.vendor_id || "",
    created_at: new Date().toISOString(),
  };
  MOCK_CANDIDATES.unshift(newCand);
  return newCand;
}

export async function createSubmission(
  data: Partial<Submission>,
): Promise<Submission> {
  const req = MOCK_REQUIREMENTS.find((r) => r.id === data.requirement_id);
  const cand = MOCK_CANDIDATES.find((c) => c.id === data.candidate_id);
  const score =
    req && cand ? calculateMatchScore(req.skills, cand.skills).score : 0;
  const newSub: Submission = {
    id: `sub-${Date.now()}`,
    requirement_id: data.requirement_id || "",
    candidate_id: data.candidate_id || "",
    match_score: score,
    status: "submitted",
    notes: data.notes || "",
    created_at: new Date().toISOString(),
  };
  MOCK_SUBMISSIONS.unshift(newSub);
  return newSub;
}

// ============================================================
// PLACEMENT TRANSACTIONS
// ============================================================

export interface PlacementTransaction {
  id: string;
  requirement_id: string;
  candidate_id: string;
  vendor_id: string;
  status:
    | "submitted"
    | "shortlisted"
    | "interview"
    | "offer_extended"
    | "joined"
    | "rejected";
  total_budget?: number;
  your_commission?: number;
  vendor_payout?: number;
  client_payment_status?: "pending" | "received";
  vendor_payout_status?: "pending" | "processed";
  joined_date?: string;
  notes?: string;
  created_at: string;
  candidate?: Candidate;
  requirement?: Requirement;
  vendor?: Vendor;
}

let MOCK_PLACEMENTS: PlacementTransaction[] = [
  {
    id: "pt-1",
    requirement_id: "req-1",
    candidate_id: "cand-1",
    vendor_id: "vendor-1",
    status: "shortlisted",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pt-2",
    requirement_id: "req-1",
    candidate_id: "cand-8",
    vendor_id: "vendor-2",
    status: "submitted",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pt-3",
    requirement_id: "req-2",
    candidate_id: "cand-2",
    vendor_id: "vendor-2",
    status: "interview",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "pt-4",
    requirement_id: "req-3",
    candidate_id: "cand-3",
    vendor_id: "vendor-1",
    status: "offer_extended",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "pt-5",
    requirement_id: "req-4",
    candidate_id: "cand-4",
    vendor_id: "vendor-3",
    status: "joined",
    total_budget: 200000,
    your_commission: 30000,
    vendor_payout: 170000,
    client_payment_status: "received",
    vendor_payout_status: "pending",
    joined_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "pt-6",
    requirement_id: "req-5",
    candidate_id: "cand-5",
    vendor_id: "vendor-2",
    status: "submitted",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pt-7",
    requirement_id: "req-6",
    candidate_id: "cand-6",
    vendor_id: "vendor-1",
    status: "shortlisted",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pt-8",
    requirement_id: "req-7",
    candidate_id: "cand-7",
    vendor_id: "vendor-3",
    status: "interview",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

function enrichPlacement(p: PlacementTransaction): PlacementTransaction {
  return {
    ...p,
    candidate: MOCK_CANDIDATES.find((c) => c.id === p.candidate_id),
    requirement: MOCK_REQUIREMENTS.find((r) => r.id === p.requirement_id),
    vendor: MOCK_VENDORS.find((v) => v.id === p.vendor_id),
  };
}

export async function getPlacementsByRequirement(
  reqId: string,
): Promise<PlacementTransaction[]> {
  return MOCK_PLACEMENTS.filter((p) => p.requirement_id === reqId).map(
    enrichPlacement,
  );
}

export async function getPlacementsByVendor(
  vendorId: string,
): Promise<PlacementTransaction[]> {
  return MOCK_PLACEMENTS.filter((p) => p.vendor_id === vendorId).map(
    enrichPlacement,
  );
}

export async function getAllPlacements(): Promise<PlacementTransaction[]> {
  return MOCK_PLACEMENTS.map(enrichPlacement);
}

export async function updatePlacementStatus(
  id: string,
  status: PlacementTransaction["status"],
  extra?: Partial<PlacementTransaction>,
): Promise<void> {
  const idx = MOCK_PLACEMENTS.findIndex((p) => p.id === id);
  if (idx !== -1) {
    MOCK_PLACEMENTS[idx] = { ...MOCK_PLACEMENTS[idx], status, ...extra };
  }
}

// ============================================================
// VENDOR INQUIRIES
// ============================================================

export interface VendorInquiry {
  id: string;
  vendor_id: string;
  sender_company: string;
  candidate_name?: string;
  message: string;
  read: boolean;
  sent_at: string;
}

let MOCK_INQUIRIES: VendorInquiry[] = [
  {
    id: "inq-1",
    vendor_id: "vendor-1",
    sender_company: "Infosys Digital",
    candidate_name: "Arjun Sharma",
    message:
      "We are interested in Arjun for our React Developer role. Please confirm availability and share expected CTC.",
    read: false,
    sent_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "inq-2",
    vendor_id: "vendor-1",
    sender_company: "Wipro AI Labs",
    candidate_name: "Rahul Verma",
    message:
      "Can you share Rahul's resume and latest project details? We have an urgent ML engineer opening.",
    read: false,
    sent_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "inq-3",
    vendor_id: "vendor-1",
    sender_company: "Razorpay",
    message:
      "General inquiry about your bench. Looking for Node.js developers. Do you have anyone available immediately?",
    read: true,
    sent_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "inq-4",
    vendor_id: "vendor-2",
    sender_company: "TCS Cloud Services",
    candidate_name: "Priya Nair",
    message:
      "Interested in Priya for our DevOps role. Can we schedule a technical interview this week?",
    read: false,
    sent_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "inq-5",
    vendor_id: "vendor-2",
    sender_company: "PhonePe",
    message:
      "Looking for full stack developers with React + Node.js experience. Please share profiles if available.",
    read: true,
    sent_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

export async function getVendorInquiries(
  vendorId: string,
): Promise<VendorInquiry[]> {
  return MOCK_INQUIRIES.filter((i) => i.vendor_id === vendorId);
}

export async function markInquiryRead(id: string): Promise<void> {
  const inq = MOCK_INQUIRIES.find((i) => i.id === id);
  if (inq) inq.read = true;
}

// ============================================================
// DEAL ROOM MESSAGES
// ============================================================

export interface DealRoomMessage {
  id: string;
  room_id: string;
  sender: string;
  sender_type: "client" | "vendor" | "recruiter";
  message: string;
  sent_at: string;
}

let MOCK_DEAL_MESSAGES: DealRoomMessage[] = [
  {
    id: "dm-1",
    room_id: "room-1",
    sender: "Infosys Digital",
    sender_type: "client",
    message:
      "Hi, we've reviewed Arjun's profile. Very strong React background. Can we schedule an interview for next Monday at 11am?",
    sent_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "dm-2",
    room_id: "room-1",
    sender: "TechBridge Staffing",
    sender_type: "vendor",
    message:
      "Absolutely! Arjun is available on Monday. I'll confirm with him and send a calendar invite. His expected CTC is ₹95K/month.",
    sent_at: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString(),
  },
  {
    id: "dm-3",
    room_id: "room-1",
    sender: "Gopala (HireNest)",
    sender_type: "recruiter",
    message:
      "Interview scheduled. I've added both parties to the meeting. Please use the Zoom link I'll share separately. Reminder: this is a 2-round technical process.",
    sent_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "dm-4",
    room_id: "room-1",
    sender: "Infosys Digital",
    sender_type: "client",
    message:
      "Round 1 went well! Arjun was excellent on TypeScript and system design. Proceeding to round 2.",
    sent_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "dm-5",
    room_id: "room-1",
    sender: "TechBridge Staffing",
    sender_type: "vendor",
    message:
      "Great to hear! Arjun mentioned he has another offer in hand. If you're interested, please move fast with the final decision.",
    sent_at: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    id: "dm-6",
    room_id: "room-2",
    sender: "TCS Cloud Services",
    sender_type: "client",
    message:
      "We looked at Priya's profile. 5 years of Kubernetes experience is exactly what we need. Can we start ASAP?",
    sent_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "dm-7",
    room_id: "room-2",
    sender: "SkillFirst Solutions",
    sender_type: "vendor",
    message:
      "Priya can join in 2 weeks. She's wrapping up at her current engagement. Expected CTC: ₹1,05,000/month.",
    sent_at: new Date(Date.now() - 3 * 86400000 + 7200000).toISOString(),
  },
  {
    id: "dm-8",
    room_id: "room-2",
    sender: "Gopala (HireNest)",
    sender_type: "recruiter",
    message:
      "Both parties aligned. I'll prepare the offer letter template. Please confirm the final budget so I can calculate the commission breakdown.",
    sent_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export interface DealRoom {
  id: string;
  candidate_id: string;
  requirement_id: string;
  status: string;
}

export const MOCK_DEAL_ROOMS: DealRoom[] = [
  {
    id: "room-1",
    candidate_id: "cand-1",
    requirement_id: "req-1",
    status: "interview",
  },
  {
    id: "room-2",
    candidate_id: "cand-2",
    requirement_id: "req-2",
    status: "offer_extended",
  },
];

export async function getDealRoomMessages(
  roomId: string,
): Promise<DealRoomMessage[]> {
  return MOCK_DEAL_MESSAGES.filter((m) => m.room_id === roomId);
}

export async function sendDealRoomMessage(
  roomId: string,
  sender: string,
  senderType: DealRoomMessage["sender_type"],
  message: string,
): Promise<DealRoomMessage> {
  const msg: DealRoomMessage = {
    id: `dm-${Date.now()}`,
    room_id: roomId,
    sender,
    sender_type: senderType,
    message,
    sent_at: new Date().toISOString(),
  };
  MOCK_DEAL_MESSAGES.push(msg);
  return msg;
}
