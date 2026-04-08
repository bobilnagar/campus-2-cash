import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildMasterPrompt, buildRefinePrompt } from "@/lib/ai-prompts";
import { extractTextFromFile, truncateText } from "@/lib/file-utils";
import { AnalysisResponse, ProjectInput } from "@/types";

// ── OpenRouter client ──────────────────────────────────────────
const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": "https://campus-2-cash.vercel.app",
        "X-Title": "Campus-2-Cash",
    },
});

const OPENROUTER_MODEL = "google/gemini-2.5-flash"; // User can choose to change this later

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

            const prompt = buildRefinePrompt(
                JSON.stringify(originalResponse),
                userFeedback,
                projectInput as ProjectInput
            );

            const completion = await client.chat.completions.create({
                model: OPENROUTER_MODEL,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.8,
                max_tokens: 8192,
            });

            const raw = completion.choices[0]?.message?.content || "{}";
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
        const imageContents: { type: "image_url"; image_url: { url: string } }[] = [];

        const uploadedFiles = formData.getAll("files") as File[];
        for (const file of uploadedFiles.slice(0, 3)) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extracted = await extractTextFromFile(buffer, file.type, file.name);

            if (extracted.isImage && extracted.base64) {
                // Pass image inline for vision
                imageContents.push({
                    type: "image_url",
                    image_url: { url: extracted.base64 },
                });
            } else {
                extractedText += "\n" + extracted.text;
            }
        }

        const textPrompt = buildMasterPrompt(projectInput, truncateText(extractedText, 4000));

        const userContent: OpenAI.Chat.ChatCompletionContentPart[] =
            imageContents.length > 0
                ? [{ type: "text", text: textPrompt }, ...imageContents]
                : [{ type: "text", text: textPrompt }];

        const completion = await client.chat.completions.create({
            model: OPENROUTER_MODEL,
            messages: [{ role: "user", content: userContent }],
            response_format: { type: "json_object" },
            temperature: 0.8,
            max_tokens: 8192,
        });

        const raw = completion.choices[0]?.message?.content || "{}";
        const parsed = parseAIResponse(raw);
        return NextResponse.json(parsed);
    } catch (error) {
        console.error("OpenRouter API Error:", error);
        const message =
            error instanceof Error
                ? error.message
                : "Analysis failed. Please check your OPENROUTER_API_KEY and try again.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
