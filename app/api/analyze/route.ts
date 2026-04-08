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
    } catch (error) {
        console.error("Gemini API Error:", error);
        const message =
            error instanceof Error
                ? error.message
                : "Analysis failed. Please check your GEMINI_API_KEY and try again.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
