import { useState } from 'react'
import { calculateMatchScore, JDRequirements, CandidateProfile, MatchResult } from '../lib/aiMatching'
import { supabase } from '../lib/supabase'

export default function AIMatch() {
  const [activeTab, setActiveTab] = useState<'jd' | 'resume'>('jd')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  
  // JD Input state
  const [jdText, setJdText] = useState('')
  const [parsedJD, setParsedJD] = useState<JDRequirements | null>(null)
  
  // Resume input state
  const [resumeText, setResumeText] = useState('')
  const [parsedResume, setParsedResume] = useState<CandidateProfile | null>(null)

  // Parse JD using AI
  async function parseJD() {
    setLoading(true)
    
    // Mock parsing - replace with OpenAI API call
    const mockJD: JDRequirements = {
      title: 'Senior React Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      experienceMin: 4,
      experienceMax: 8,
      location: 'Bangalore',
      budgetMin: 80000,
      budgetMax: 120000
    }
    
    setParsedJD(mockJD)
    setLoading(false)
  }

  // Parse Resume using AI
  async function parseResume() {
    setLoading(true)
    
    // Mock parsing - replace with resume parser API
    const mockResume: CandidateProfile = {
      id: '1',
      name: 'Sample Candidate',
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
      experienceYears: 5,
      location: 'Bangalore',
      expectedSalary: 100000,
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Built React frontend with TypeScript',
          technologies: ['React', 'TypeScript', 'Redux'],
          durationMonths: 12
        }
      ]
    }
    
    setParsedResume(mockResume)
    setLoading(false)
  }

  // Calculate match
  async function calculateMatch() {
    if (!parsedJD || !parsedResume) return
    
    setLoading(true)
    const match = await calculateMatchScore(parsedJD, parsedResume)
    setResult(match)
    
    // Save to history
    await supabase.from('match_history').insert({
      jd_title: parsedJD.title,
      candidate_name: parsedResume.name,
      match_score: match.overallScore,
      recommendation: match.recommendation,
      created_at: new Date().toISOString()
    })
    
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Matching Engine</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('jd')}
          className={`pb-2 px-4 ${activeTab === 'jd' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          Match by JD
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-2 px-4 ${activeTab === 'resume' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
        >
          Upload Resume
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          
          {/* JD Input */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Job Description</h2>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full h-40 border rounded-lg p-3"
            />
            <button
              onClick={parseJD}
              disabled={!jdText || loading}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Parsing...' : 'Parse JD'}
            </button>
            
            {parsedJD && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-medium">{parsedJD.title}</p>
                <p className="text-sm text-gray-600">
                  {parsedJD.experienceMin}-{parsedJD.experienceMax} years • {parsedJD.skills.slice(0, 3).join(', ')}...
                </p>
              </div>
            )}
          </div>

          {/* Resume Input */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Candidate Resume</h2>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume text here..."
              className="w-full h-40 border rounded-lg p-3"
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={parseResume}
                disabled={!resumeText || loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Parse Resume
              </button>
              <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
                Upload File
                <input type="file" className="hidden" accept=".txt,.pdf,.doc" />
              </label>
            </div>
            
            {parsedResume && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="font-medium">{parsedResume.name}</p>
                <p className="text-sm text-gray-600">
                  {parsedResume.experienceYears} years • {parsedResume.skills.slice(0, 3).join(', ')}...
                </p>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          {parsedJD && parsedResume && (
            <button
              onClick={calculateMatch}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Match Score'}
            </button>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          {result ? (
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${
                  result.overallScore >= 85 ? 'text-green-600' :
                  result.overallScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {result.overallScore}%
                </div>
                <span className={`inline-block mt-2 px-4 py-1 rounded-full font-semibold ${
                  result.recommendation === 'Strong' ? 'bg-green-100 text-green-800' :
                  result.recommendation === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.recommendation} Match
                </span>
              </div>

              {/* Skill Breakdown */}
              <div>
                <h3 className="font-semibold mb-3">Skill Analysis</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>Match Score</span>
                  <span>{result.skillMatch.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${result.skillMatch.score}%` }}
                  />
                </div>
                
                <div className="mt-3 space-y-2">
                  {result.skillMatch.matched.length > 0 && (
                    <div>
                      <p className="text-sm text-green-600 font-medium">✓ Matched ({result.skillMatch.matched.length})</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.skillMatch.matched.map(s => (
                          <span key={s} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.skillMatch.missing.length > 0 && (
                    <div>
                      <p className="text-sm text-red-600 font-medium">✗ Missing ({result.skillMatch.missing.length})</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {result.skillMatch.missing.map(s => (
                          <span key={s} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-sm text-gray-600">
                  Candidate: <span className="font-medium">{result.experienceMatch.candidateYears} years</span>
                  {' • '}
                  Required: {result.experienceMatch.requiredMin}-{result.experienceMatch.requiredMax} years
                </p>
                <p className={`text-sm mt-1 ${
                  result.experienceMatch.assessment === 'meets' ? 'text-green-600' :
                  result.experienceMatch.assessment === 'exceeds' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  Assessment: {result.experienceMatch.assessment}
                </p>
              </div>

              {/* AI Reasoning */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-700">{result.reasoning}</p>
              </div>

              {/* Gaps */}
              {result.gapAnalysis.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Gap Analysis</h3>
                  <ul className="text-sm space-y-1">
                    {result.gapAnalysis.map((gap, i) => (
                      <li key={i} className="text-gray-600">• {gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interview Questions */}
              <div>
                <h3 className="font-semibold mb-2">Suggested Interview Questions</h3>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  {result.interviewQuestions.map((q, i) => (
                    <li key={i} className="text-gray-700">{q}</li>
                  ))}
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Add to Bench
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Submit to Requirement
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              <p>Parse JD and Resume to see match analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
