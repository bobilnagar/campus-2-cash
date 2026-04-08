import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { buildMasterPrompt, buildRefinePrompt } from "@/lib/ai-prompts";
import { extractTextFromFile, truncateText } from "@/lib/file-utils";
import { AnalysisResponse, ProjectInput } from "@/types";

// ── Gemini client ──────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

function getModel(vision = false) {
    return genAI.getGenerativeModel({
        model: vision ? "gemini-2.5-flash" : "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
            maxOutputTokens: 8192,
        },
        safetySettings: SAFETY_SETTINGS,
    });
}

// ── JSON extractor (strips markdown fences if present) ──────
function extractJSON(raw: string): string {
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) return fenceMatch[1];
    const braceStart = raw.indexOf("{");
    const braceEnd = raw.lastIndexOf("}");
    if (braceStart !== -1 && braceEnd !== -1) return raw.slice(braceStart, braceEnd + 1);
    return raw;
}

function parseAIResponse(raw: string): AnalysisResponse {
    try {
        const cleaned = extractJSON(raw);
        const parsed = JSON.parse(cleaned);
        // Normalize: ensure backward-compat fields exist
        if (parsed.evaluation && !parsed.evaluation.dimensions && parsed.evaluation.scorecard) {
            const sc = parsed.evaluation.scorecard;
            parsed.evaluation.dimensions = {
                marketSize: sc.marketSize,
                uniqueness: sc.uniqueness,
                feasibility: sc.feasibility,
                monetizationPotential: sc.monetizationPotential,
                executionRisk: {
                    label: "Execution Risk & Timeline",
                    score: Math.max(1, 10 - (sc.feasibility?.score || 5)),
                    summary: sc.feasibility?.summary || "",
                },
            };
        }
        return { ...parsed, generatedAt: new Date().toISOString() } as AnalysisResponse;
    } catch (e) {
        console.error("JSON parse error — raw response:", raw.slice(0, 500));
        throw new Error("AI returned invalid JSON");
    }
}

// ── POST handler ───────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get("mode");

        // ── REFINE MODE ────────────────────────────────────────
        if (mode === "refine") {
            const body = await req.json();
            const { originalResponse, projectInput, userFeedback } = body;

            const model = getModel(false);
            const prompt = buildRefinePrompt(
                JSON.stringify(originalResponse),
                userFeedback,
                projectInput as ProjectInput
            );

            const result = await model.generateContent(prompt);
            const raw = result.response.text();
            const parsed = parseAIResponse(raw);
            return NextResponse.json(parsed);
        }

        // ── ANALYZE MODE ───────────────────────────────────────
        const formData = await req.formData();

        const projectInput: ProjectInput = {
            title: (formData.get("title") as string) || "",
            description: (formData.get("description") as string) || "",
            techStack: JSON.parse((formData.get("techStack") as string) || "[]"),
            targetAudience: (formData.get("targetAudience") as string) || undefined,
            targetCountry: (formData.get("targetCountry") as string) || undefined,
            preferredRevenue:
                (formData.get("preferredRevenue") as ProjectInput["preferredRevenue"]) || undefined,
            knownCompetitors: (formData.get("knownCompetitors") as string) || undefined,
            githubUrl: (formData.get("githubUrl") as string) || undefined,
        };

        // ── File extraction ───────────────────────────────────
        let extractedText = "";
        const inlineImages: { inlineData: { mimeType: string; data: string } }[] = [];

        const uploadedFiles = formData.getAll("files") as File[];
        for (const file of uploadedFiles.slice(0, 3)) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extracted = await extractTextFromFile(buffer, file.type, file.name);

            if (extracted.isImage && extracted.base64) {
                // Pass image inline for vision
                inlineImages.push({
                    inlineData: {
                        mimeType: file.type,
                        data: extracted.base64,
                    },
                });
            } else {
                extractedText += "\n" + extracted.text;
            }
        }

        const textPrompt = buildMasterPrompt(projectInput, truncateText(extractedText, 4000));

        const hasImages = inlineImages.length > 0;
        const model = getModel(hasImages);

        let raw: string;
        try {
            if (hasImages) {
                // Vision call
                const parts: (string | { inlineData: { mimeType: string; data: string } })[] = [
                    textPrompt,
                    ...inlineImages,
                ];
                const result = await model.generateContent(parts);
                raw = result.response.text();
            } else {
                const result = await model.generateContent(textPrompt);
                raw = result.response.text();
            }
            const parsed = parseAIResponse(raw);
            return NextResponse.json(parsed);
        } catch (apiError) {
            console.error("Gemini API Error, falling back to mock:", apiError);
            const mockParsed = generateMockReport(projectInput);
            return NextResponse.json(mockParsed);
        }
    } catch (error) {
        console.error("General API Route Error:", error);
        return NextResponse.json(
            { error: "Analysis failed completely, and fallback couldn't be generated." },
            { status: 500 }
        );
    }
}

function generateMockReport(input: ProjectInput): AnalysisResponse {
    const score = 4 + Math.random() * 5.5; // Random score between 4.0 and 9.5

    let verdict = "Needs Refinement";
    let emoji = "🔨";
    if (score >= 8.5) { verdict = "Investor-Ready"; emoji = "🚀"; }
    else if (score >= 7.0) { verdict = "Strong Potential"; emoji = "⚡"; }
    else if (score >= 5.5) { verdict = "Solid Foundation"; emoji = "🌱"; }

    const dimScores = Array.from({ length: 10 }, () => Math.floor(Math.random() * 5) + 5);

    const safeTechStack = input.techStack.length > 0 ? input.techStack.join(", ") : "your stack";

    return {
        generatedAt: new Date().toISOString(),
        evaluation: {
            realWorldValueScore: Number(score.toFixed(1)),
            verdict,
            verdictEmoji: emoji,
            scorecard: {
                marketSize: { label: "Market Size & Demand", score: dimScores[0], summary: `Based on your target audience, there's a demonstrable market.` },
                problemSeverity: { label: "Problem Severity", score: dimScores[1], summary: "The problem severity is notable but could be validated further." },
                uniqueness: { label: "Uniqueness", score: dimScores[2], summary: "Average differentiation compared to existing solutions." },
                feasibility: { label: "Feasibility", score: dimScores[3], summary: `Highly feasible using ${safeTechStack}.` },
                monetizationPotential: { label: "Monetization Potential", score: dimScores[4], summary: "Good base for potential future revenue streams." },
                scalability: { label: "Scalability", score: dimScores[5], summary: "Can reasonably scale to initial users without major rebuilds." },
                timeToRevenue: { label: "Time-to-Revenue", score: dimScores[6], summary: "Expect 4-6 weeks to validate first dollar." },
                competitiveMoat: { label: "Competitive Moat", score: dimScores[7], summary: "Low defensive moat initially." },
                founderFit: { label: "Founder Fit", score: dimScores[8], summary: "Good alignment with your skillset." },
                trendAlignment: { label: "Trend Alignment", score: dimScores[9], summary: "Aligns moderately with 2026 trends." },
            },
            dimensions: {
                marketSize: { label: "Market Size", score: dimScores[0], summary: "Demonstrable market." },
                uniqueness: { label: "Uniqueness", score: dimScores[2], summary: "Average differentiation." },
                feasibility: { label: "Feasibility", score: dimScores[3], summary: "Highly feasible." },
                monetizationPotential: { label: "Monetization", score: dimScores[4], summary: "Good base." },
                executionRisk: { label: "Risk", score: 10 - dimScores[3], summary: "Manageable execution risk." },
            },
            revenueEstimate: {
                conservative: "₹5k-10k", realistic: "₹30k-80k", optimistic: "₹100k-300k",
                timeframe: "First 6 months",
                assumptions: "Assuming you dedicate 10hrs/week"
            },
            overallInsights: `(Mock Data) Since the AI API failed, this report is randomly generated! Your project "${input.title}" shows potential.`
        },
        paths: [
            {
                id: "mock-1",
                model: "Freemium SaaS",
                emoji: "💳",
                targetUsers: "Early adopters",
                pricing: "Free basic, ₹499/mo premium",
                pricingTiers: [
                    { name: "Basic", price: "₹0/mo", features: ["Core feature access"] },
                    { name: "Pro", price: "₹499/mo", features: ["Advanced analytics", "Priority support"] }
                ],
                steps: ["Launch landing page", "Share on Reddit", "Gather 100 beta users", "Iterate on feedback", "Launch paid tier"],
                whyItFits: `Matches your preferred style of ${input.preferredRevenue || "any"} revenue.`,
                confidence: "Medium",
                confidenceReason: "Standard proven model.",
                timeToFirstDollar: "3-4 weeks",
                marketTrendAlignment: "Micro-SaaS trend of 2026",
            }
        ],
        strategicInsights: {
            strengths: ["Clear project concept", "Modern tech stack"],
            weaknesses: ["No validated audience yet", "Highly competitive space"],
            secretWeapon: "Being a student yourself gives you authentic access to peers.",
            quickWin: "Talk to 5 potential users this week."
        },
        overallInsights: "Keep iterating! Once the API is back online, you'll get a full AI-driven report."
    };
}
