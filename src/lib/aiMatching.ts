import { supabase } from './supabase'

// Types matching your POC
export interface JDRequirements {
  title: string
  skills: string[]
  experienceMin: number
  experienceMax: number
  location?: string
  budgetMin?: number
  budgetMax?: number
  domain?: string
}

export interface CandidateProfile {
  id: string
  name: string
  skills: string[]
  experienceYears: number
  location?: string
  currentSalary?: number
  expectedSalary?: number
  resumeText?: string
  projects?: Project[]
  education?: Education[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  durationMonths: number
}

export interface Education {
  degree: string
  field: string
  institution: string
  year: number
}

export interface MatchResult {
  overallScore: number // 0-100
  skillMatch: {
    score: number
    matched: string[]
    missing: string[]
    extra: string[]
  }
  experienceMatch: {
    score: number
    candidateYears: number
    requiredMin: number
    requiredMax: number
    assessment: 'below' | 'meets' | 'exceeds'
  }
  salaryMatch?: {
    score: number
    withinBudget: boolean
    variance: number // percentage
  }
  domainMatch?: {
    score: number
    relevantProjects: Project[]
  }
  recommendation: 'Strong' | 'Moderate' | 'Weak'
  reasoning: string // AI-generated explanation
  gapAnalysis: string[]
  interviewQuestions: string[] // AI-generated based on gaps
}

// Main matching function
export async function calculateMatchScore(
  jd: JDRequirements,
  candidate: CandidateProfile,
  options?: { useAI?: boolean; model?: 'basic' | 'advanced' }
): Promise<MatchResult> {
  
  // 1. SKILL MATCH (40% weight)
  const skillMatch = calculateSkillMatch(jd.skills, candidate.skills)
  
  // 2. EXPERIENCE MATCH (30% weight)
  const expMatch = calculateExperienceMatch(
    candidate.experienceYears, 
    jd.experienceMin, 
    jd.experienceMax
  )
  
  // 3. SALARY MATCH (15% weight) - if data available
  const salaryMatch = jd.budgetMax && candidate.expectedSalary
    ? calculateSalaryMatch(candidate.expectedSalary, jd.budgetMin || 0, jd.budgetMax)
    : undefined
  
  // 4. DOMAIN MATCH (15% weight) - project relevance
  const domainMatch = jd.domain && candidate.projects
    ? calculateDomainMatch(jd.domain, candidate.projects, jd.skills)
    : undefined

  // Calculate weighted overall score
  let overallScore = (
    skillMatch.score * 0.40 +
    expMatch.score * 0.30 +
    (salaryMatch?.score || 80) * 0.15 +
    (domainMatch?.score || 80) * 0.15
  )

  // Normalize to 0-100
  overallScore = Math.round(overallScore)

  // Determine recommendation
  const recommendation = getRecommendation(overallScore, skillMatch, expMatch)

  // Generate AI reasoning
  const reasoning = generateReasoning(jd, candidate, {
    skillMatch, expMatch, salaryMatch, domainMatch, overallScore
  })

  // Gap analysis
  const gapAnalysis = generateGapAnalysis(skillMatch, expMatch, jd)

  // Interview questions based on gaps
  const interviewQuestions = generateInterviewQuestions(skillMatch, expMatch, jd)

  return {
    overallScore,
    skillMatch,
    experienceMatch: expMatch,
    salaryMatch,
    domainMatch,
    recommendation,
    reasoning,
    gapAnalysis,
    interviewQuestions
  }
}

// Skill matching algorithm
function calculateSkillMatch(
  required: string[], 
  candidate: string[]
): MatchResult['skillMatch'] {
  
  const normalized = (arr: string[]) => 
    arr.map(s => s.toLowerCase().trim())
  
  const reqNorm = normalized(required)
  const candNorm = normalized(candidate)
  
  const matched = reqNorm.filter(r => 
    candNorm.some(c => c.includes(r) || r.includes(c))
  )
  
  const missing = reqNorm.filter(r => 
    !candNorm.some(c => c.includes(r) || r.includes(c))
  )
  
  const extra = candNorm.filter(c => 
    !reqNorm.some(r => c.includes(r) || r.includes(c))
  )
  
  // Score calculation: exact match = 100, partial = 50-99, missing = 0
  const score = Math.round((matched.length / reqNorm.length) * 100)
  
  return {
    score,
    matched: required.filter((_, i) => matched.includes(reqNorm[i])),
    missing: required.filter((_, i) => missing.includes(reqNorm[i])),
    extra: candidate.filter((_, i) => extra.includes(candNorm[i]))
  }
}

// Experience matching
function calculateExperienceMatch(
  candidateYears: number,
  reqMin: number,
  reqMax: number
): MatchResult['experienceMatch'] {
  
  let score: number
  let assessment: 'below' | 'meets' | 'exceeds'
  
  if (candidateYears < reqMin) {
    score = Math.max(0, 100 - ((reqMin - candidateYears) * 20))
    assessment = 'below'
  } else if (candidateYears > reqMax) {
    score = 100 // Exceeding is good, but cap at 100
    assessment = 'exceeds'
  } else {
    score = 100
    assessment = 'meets'
  }
  
  return {
    score: Math.round(score),
    candidateYears,
    requiredMin: reqMin,
    requiredMax: reqMax,
    assessment
  }
}

// Salary matching
function calculateSalaryMatch(
  expected: number,
  budgetMin: number,
  budgetMax: number
): MatchResult['salaryMatch'] {
  
  const withinBudget = expected <= budgetMax
  const variance = ((expected - budgetMax) / budgetMax) * 100
  
  let score: number
  if (expected <= budgetMax && expected >= budgetMin) {
    score = 100 // Within range
  } else if (expected < budgetMin) {
    score = 90 // Below budget (good for employer)
  } else {
    score = Math.max(0, 100 - (variance * 2)) // Penalty for over budget
  }
  
  return {
    score: Math.round(score),
    withinBudget,
    variance: Math.round(variance * 10) / 10
  }
}

// Domain/project relevance
function calculateDomainMatch(
  domain: string,
  projects: Project[],
  requiredSkills: string[]
): MatchResult['domainMatch'] {
  
  const domainKeywords = domain.toLowerCase().split(' ')
  
  const relevantProjects = projects.filter(p => {
    const text = `${p.name} ${p.description} ${p.technologies.join(' ')}`.toLowerCase()
    return domainKeywords.some(k => text.includes(k)) ||
           requiredSkills.some(s => p.technologies.some(t => 
             t.toLowerCase().includes(s.toLowerCase())
           ))
  })
  
  const score = Math.min(100, (relevantProjects.length / Math.max(1, projects.length)) * 100 + 50)
  
  return {
    score: Math.round(score),
    relevantProjects
  }
}

// Recommendation logic
function getRecommendation(
  score: number,
  skillMatch: MatchResult['skillMatch'],
  expMatch: MatchResult['experienceMatch']
): 'Strong' | 'Moderate' | 'Weak' {
  
  if (score >= 85 && skillMatch.score >= 80 && expMatch.assessment !== 'below') {
    return 'Strong'
  } else if (score >= 60 && skillMatch.score >= 50) {
    return 'Moderate'
  }
  return 'Weak'
}

// AI-generated reasoning (can be replaced with OpenAI GPT call)
function generateReasoning(
  jd: JDRequirements,
  candidate: CandidateProfile,
  scores: any
): string {
  
  const parts: string[] = []
  
  // Skill summary
  if (scores.skillMatch.score >= 80) {
    parts.push(`${candidate.name} matches ${scores.skillMatch.matched.length}/${jd.skills.length} required skills strongly.`)
  } else {
    parts.push(`Skill gap identified: missing ${scores.skillMatch.missing.join(', ')}.`)
  }
  
  // Experience summary
  if (scores.expMatch.assessment === 'meets') {
    parts.push(`Experience level (${candidate.experienceYears} years) fits requirements perfectly.`)
  } else if (scores.expMatch.assessment === 'exceeds') {
    parts.push(`Senior candidate with ${candidate.experienceYears} years, exceeds requirements.`)
  } else {
    parts.push(`Junior candidate with ${candidate.experienceYears} years, may need mentoring.`)
  }
  
  // Overall
  if (scores.overallScore >= 85) {
    parts.push(`Strong overall match at ${scores.overallScore}%. Recommend immediate interview.`)
  } else if (scores.overallScore >= 60) {
    parts.push(`Moderate match at ${scores.overallScore}%. Consider for junior role or skill development.`)
  } else {
    parts.push(`Weak match at ${scores.overallScore}%. Not recommended unless critical need.`)
  }
  
  return parts.join(' ')
}

function generateGapAnalysis(
  skillMatch: MatchResult['skillMatch'],
  expMatch: MatchResult['experienceMatch'],
  jd: JDRequirements
): string[] {
  
  const gaps: string[] = []
  
  if (skillMatch.missing.length > 0) {
    gaps.push(`Missing skills: ${skillMatch.missing.join(', ')}. Consider training or pair with senior dev.`)
  }
  
  if (expMatch.assessment === 'below') {
    gaps.push(`Experience gap: needs ${jd.experienceMin - expMatch.candidateYears} more years.`)
  }
  
  if (gaps.length === 0) {
    gaps.push('No significant gaps identified. Ready for immediate deployment.')
  }
  
  return gaps
}

function generateInterviewQuestions(
  skillMatch: MatchResult['skillMatch'],
  expMatch: MatchResult['experienceMatch'],
  jd: JDRequirements
): string[] {
  
  const questions: string[] = []
  
  // Questions on missing skills
  skillMatch.missing.slice(0, 2).forEach(skill => {
    questions.push(`How would you approach learning ${skill} if required for this role?`)
  })
  
  // Experience questions
  if (expMatch.assessment === 'below') {
    questions.push(`Describe a complex project you led despite having ${expMatch.candidateYears} years experience.`)
  }
  
  // Technical depth on matched skills
  skillMatch.matched.slice(0, 2).forEach(skill => {
    questions.push(`Explain your experience with ${skill} in a production environment.`)
  })
  
  return questions.slice(0, 5)
}

// OpenAI integration for advanced matching (optional)
export async function generateAIReasoning(
  jd: JDRequirements,
  candidate: CandidateProfile,
  matchResult: MatchResult
): Promise<string> {
  
  const prompt = `
    Job: ${jd.title}
    Required Skills: ${jd.skills.join(', ')}
    Experience: ${jd.experienceMin}-${jd.experienceMax} years
    
    Candidate: ${candidate.name}
    Skills: ${candidate.skills.join(', ')}
    Experience: ${candidate.experienceYears} years
    
    Match Score: ${matchResult.overallScore}%
    Skill Match: ${matchResult.skillMatch.score}%
    
    Provide a 2-sentence hiring recommendation:
  `
  
  // Call OpenAI API here if you have key
  // const response = await openai.createCompletion({...})
  
  // Fallback to local generation
  return matchResult.reasoning
}
