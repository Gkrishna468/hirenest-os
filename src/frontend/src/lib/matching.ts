export interface MatchResult {
  score: number;
  skillScore: number;
  experienceScore: number;
  seniorityScore: number;
  matches: string[];
  missing: string[];
  tag: "Strong" | "Moderate" | "Weak";
  reasoning: string;
}

const KNOWN_SKILLS = [
  "React",
  "Vue.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Golang",
  "Ruby",
  "PHP",
  "C++",
  "C#",
  ".NET",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "GraphQL",
  "REST",
  "gRPC",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Spark",
  "Airflow",
  "BigQuery",
  "DBT",
  "MLOps",
  "TensorFlow",
  "PyTorch",
  "Machine Learning",
  "Deep Learning",
  "Spring Boot",
  "Microservices",
  "Spring",
  "Android",
  "iOS",
  "Swift",
  "Kotlin",
  "Jetpack Compose",
  "Flutter",
  "Firebase",
  "Figma",
  "CSS",
  "Tailwind",
  "MVVM",
  "Redux",
  "Git",
  "Linux",
  "Bash",
  "Jenkins",
  "GitHub Actions",
  "SQL",
  "NoSQL",
  "Elasticsearch",
  "DynamoDB",
  "Cassandra",
  "Scrum",
  "Agile",
  "JIRA",
  "Confluence",
];

export function parseJDText(text: string): {
  skills: string[];
  experience: number;
  seniority: "junior" | "mid" | "senior" | "lead" | "principal";
} {
  const lower = text.toLowerCase();

  const skills = KNOWN_SKILLS.filter((skill) =>
    lower.includes(skill.toLowerCase()),
  );

  let experience = 0;
  const expPatterns = [
    /(\d+)\+\s*years?/i,
    /(\d+)\s*to\s*(\d+)\s*years?/i,
    /(\d+)-(\d+)\s*years?/i,
    /minimum\s+(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /(\d+)\s*years?\s+of\s+experience/i,
  ];
  for (const pattern of expPatterns) {
    const match = text.match(pattern);
    if (match) {
      experience = Number.parseInt(match[1]);
      break;
    }
  }

  let seniority: "junior" | "mid" | "senior" | "lead" | "principal" = "mid";
  if (/principal|distinguished|staff\s+engineer/i.test(lower))
    seniority = "principal";
  else if (/\blead\b|tech\s+lead|team\s+lead/i.test(lower)) seniority = "lead";
  else if (/\bsenior\b|sr\.\b|sr\s/i.test(lower)) seniority = "senior";
  else if (/\bjunior\b|jr\.\b|entry.level|fresher/i.test(lower))
    seniority = "junior";
  else if (experience >= 8) seniority = "lead";
  else if (experience >= 5) seniority = "senior";
  else if (experience >= 2) seniority = "mid";
  else seniority = "junior";

  return { skills, experience, seniority };
}

export function inferSeniority(
  role: string,
  experience: number,
): "junior" | "mid" | "senior" | "lead" | "principal" {
  const lower = role.toLowerCase();
  if (/principal|distinguished/i.test(lower)) return "principal";
  if (/\blead\b|architect/i.test(lower)) return "lead";
  if (/\bsenior\b|sr\./i.test(lower)) return "senior";
  if (/\bjunior\b|jr\./i.test(lower)) return "junior";
  if (experience >= 10) return "principal";
  if (experience >= 7) return "lead";
  if (experience >= 4) return "senior";
  if (experience >= 2) return "mid";
  return "junior";
}

const SENIORITY_RANK: Record<string, number> = {
  junior: 1,
  mid: 2,
  senior: 3,
  lead: 4,
  principal: 5,
};

export function calculateMatchScore(
  requirementSkills: string[],
  candidateSkills: string[],
  requirementExperience = 0,
  candidateExperience = 0,
  requirementSeniority:
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "principal" = "mid",
  candidateRole = "",
): MatchResult {
  if (requirementSkills.length === 0) {
    return {
      score: 0,
      skillScore: 0,
      experienceScore: 0,
      seniorityScore: 0,
      matches: [],
      missing: [],
      tag: "Weak",
      reasoning: "No required skills specified.",
    };
  }

  // Skill Score (60%)
  const reqSet = new Set(requirementSkills.map((s) => s.toLowerCase()));
  const candSet = new Set(candidateSkills.map((s) => s.toLowerCase()));
  const matches = requirementSkills.filter((s) => candSet.has(s.toLowerCase()));
  const missing = requirementSkills.filter(
    (s) => !candSet.has(s.toLowerCase()),
  );
  const skillScore = Math.round((matches.length / reqSet.size) * 100);

  // Experience Score (20%)
  let experienceScore = 100;
  if (requirementExperience > 0) {
    if (candidateExperience >= requirementExperience) {
      experienceScore = 100;
    } else {
      experienceScore = Math.round(
        (candidateExperience / requirementExperience) * 100,
      );
    }
  }

  // Seniority Score (20%)
  const candSeniority = inferSeniority(candidateRole, candidateExperience);
  const reqRank = SENIORITY_RANK[requirementSeniority] ?? 2;
  const candRank = SENIORITY_RANK[candSeniority] ?? 2;
  let seniorityScore = 100;
  if (candRank < reqRank) {
    seniorityScore = Math.max(0, 100 - (reqRank - candRank) * 25);
  } else if (candRank > reqRank) {
    seniorityScore = Math.max(75, 100 - (candRank - reqRank) * 10);
  }

  // Weighted Overall
  const score = Math.round(
    skillScore * 0.6 + experienceScore * 0.2 + seniorityScore * 0.2,
  );

  const tag: "Strong" | "Moderate" | "Weak" =
    score >= 75 ? "Strong" : score >= 50 ? "Moderate" : "Weak";

  const reasonParts: string[] = [];
  if (matches.length === requirementSkills.length) {
    reasonParts.push(`All ${matches.length} required skills match.`);
  } else if (matches.length > 0) {
    reasonParts.push(
      `Matches ${matches.length}/${requirementSkills.length} required skills (${matches.slice(0, 3).join(", ")}${matches.length > 3 ? "..." : ""}).`,
    );
  } else {
    reasonParts.push("No required skills match.");
  }
  if (missing.length > 0) {
    reasonParts.push(
      `Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` +${missing.length - 3} more` : ""}.`,
    );
  }
  if (requirementExperience > 0) {
    if (candidateExperience >= requirementExperience) {
      reasonParts.push(
        `Experience meets requirement (${candidateExperience} vs ${requirementExperience}+ yrs).`,
      );
    } else {
      reasonParts.push(
        `Experience slightly below requirement (${candidateExperience} vs ${requirementExperience}+ yrs).`,
      );
    }
  }
  if (candSeniority !== requirementSeniority) {
    if (candRank < reqRank) {
      reasonParts.push(
        `Seniority mismatch: candidate is ${candSeniority}, role requires ${requirementSeniority}.`,
      );
    } else {
      reasonParts.push(
        `Candidate is ${candSeniority} — slightly over-qualified for ${requirementSeniority} role.`,
      );
    }
  }

  return {
    score,
    skillScore,
    experienceScore,
    seniorityScore,
    matches,
    missing,
    tag,
    reasoning: reasonParts.join(" "),
  };
}
