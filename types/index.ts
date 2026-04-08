// ============================================================
// Extended TypeScript interfaces — Campus-2-Cash (v2, Gemini)
// ============================================================

export interface ProjectInput {
    title: string;
    description: string;
    techStack: string[];
    files?: File[];
    targetAudience?: string;
    targetCountry?: string;
    preferredRevenue?: "passive" | "active" | "b2b" | "any";
    knownCompetitors?: string;
    githubUrl?: string;
}

// ── Scorecard (10 dimensions) ──────────────────────────────
export interface ScorecardDimension {
    label: string;
    score: number; // 1–10
    summary: string;
}

export interface Scorecard {
    marketSize: ScorecardDimension;
    problemSeverity: ScorecardDimension;
    uniqueness: ScorecardDimension;
    feasibility: ScorecardDimension;
    monetizationPotential: ScorecardDimension;
    scalability: ScorecardDimension;
    timeToRevenue: ScorecardDimension;
    competitiveMoat: ScorecardDimension;
    founderFit: ScorecardDimension;
    trendAlignment: ScorecardDimension;
}

// ── Legacy 5-dimension (still used by EvaluationPanel) ────
export interface DimensionScore {
    label: string;
    score: number;
    summary: string;
}

export interface RevenueEstimate {
    conservative: string;
    realistic: string;
    optimistic: string;
    annualConservative?: string;
    annualRealistic?: string;
    annualOptimistic?: string;
    timeframe: string;
    assumptions?: string;
}

export interface EvaluationResult {
    realWorldValueScore: number; // 1–10
    verdict: string;
    verdictEmoji: string;
    // Full 10-dimension scorecard
    scorecard?: Scorecard;
    // Legacy 5 dimensions (backward-compat for EvaluationPanel)
    dimensions: {
        marketSize: DimensionScore;
        uniqueness: DimensionScore;
        feasibility: DimensionScore;
        monetizationPotential: DimensionScore;
        executionRisk: DimensionScore;
    };
    revenueEstimate: RevenueEstimate;
    overallInsights: string;
}

export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface PricingTier {
    name: string;
    price: string;
    features: string[];
}

export interface MonetizationPath {
    id: string;
    model: string;
    emoji: string;
    targetUsers: string;
    secondaryUsers?: string;
    pricing: string;
    pricingTiers: PricingTier[];
    steps: string[];
    whyItFits: string;
    confidence: ConfidenceLevel;
    confidenceReason?: string;
    estimatedMRR?: string;
    timeToFirstDollar?: string;
    marketTrendAlignment: string;
}

export interface StrategicInsights {
    strengths: string[];
    weaknesses: string[];
    secretWeapon: string;
    quickWin: string;
}

export interface AnalysisResponse {
    evaluation: EvaluationResult;
    paths: MonetizationPath[];
    strategicInsights?: StrategicInsights;
    overallInsights: string;
    generatedAt: string;
}

export interface RefineRequest {
    originalResponse: AnalysisResponse;
    projectInput: ProjectInput;
    userFeedback: string;
}

export interface SampleProject {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    targetAudience: string;
    preferredRevenue: ProjectInput["preferredRevenue"];
    emoji: string;
}
