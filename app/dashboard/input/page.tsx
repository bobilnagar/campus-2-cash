"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileText, Image, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/sample-projects";
import { ProjectInput, SampleProject } from "@/types";
import { saveToLocalStorage } from "@/lib/utils";

const TECH_SUGGESTIONS = [
    "React", "Next.js", "Vue", "Angular", "Node.js", "Python", "FastAPI",
    "Django", "Flask", "TypeScript", "JavaScript", "TailwindCSS", "PostgreSQL",
    "MongoDB", "Firebase", "Supabase", "OpenAI", "LangChain", "Stripe", "AWS",
    "Docker", "React Native", "Expo", "Flutter", "Swift", "Kotlin",
];

export default function InputPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [techInput, setTechInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const [form, setForm] = useState<Omit<ProjectInput, "files">>({
        title: "",
        description: "",
        techStack: [],
        targetAudience: "",
        targetCountry: "",
        preferredRevenue: "any",
        knownCompetitors: "",
        githubUrl: "",
    });

    // Load pre-selected sample from landing page
    useEffect(() => {
        const sampleId = localStorage.getItem("selectedSample");
        if (sampleId) {
            const sample = SAMPLE_PROJECTS.find((s) => s.id === sampleId);
            if (sample) applySample(sample);
            localStorage.removeItem("selectedSample");
        }
    }, []);

    function applySample(sample: SampleProject) {
        setForm({
            title: sample.title,
            description: sample.description,
            techStack: sample.techStack,
            targetAudience: sample.targetAudience,
            targetCountry: "",
            preferredRevenue: sample.preferredRevenue || "any",
            knownCompetitors: "",
            githubUrl: "",
        });
    }

    const onDrop = useCallback((accepted: File[]) => {
        setFiles((prev) => [...prev, ...accepted].slice(0, 3));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
            "text/plain": [".txt"],
            "text/markdown": [".md"],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    function addTechTag(tag: string) {
        const trimmed = tag.trim();
        if (trimmed && !form.techStack.includes(trimmed)) {
            setForm((prev) => ({ ...prev, techStack: [...prev.techStack, trimmed] }));
        }
        setTechInput("");
    }

    function removeTechTag(tag: string) {
        setForm((prev) => ({ ...prev, techStack: prev.techStack.filter((t) => t !== tag) }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.title || !form.description) {
            setError("Please fill in at least the project title and description.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("techStack", JSON.stringify(form.techStack));
            if (form.targetAudience) formData.append("targetAudience", form.targetAudience);
            if (form.targetCountry) formData.append("targetCountry", form.targetCountry);
            if (form.preferredRevenue) formData.append("preferredRevenue", form.preferredRevenue);
            if (form.knownCompetitors) formData.append("knownCompetitors", form.knownCompetitors);
            if (form.githubUrl) formData.append("githubUrl", form.githubUrl);
            files.forEach((f) => formData.append("files", f));

            const res = await fetch("/api/analyze", { method: "POST", body: formData });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Analysis failed");
            }

            const data = await res.json();
            saveToLocalStorage("c2c_result", data);
            saveToLocalStorage("c2c_input", { ...form });
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Check your API key.");
        } finally {
            setLoading(false);
        }
    }

    const filteredSuggestions = TECH_SUGGESTIONS.filter(
        (t) => t.toLowerCase().includes(techInput.toLowerCase()) && !form.techStack.includes(t)
    ).slice(0, 6);

    return (
        <div className="min-h-screen hero-gradient py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Step 1 of 2 — Tell us about your project
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analyze Your Project</h1>
                    <p className="text-muted-foreground">
                        The more detail you provide, the sharper the monetization paths.
                    </p>
                </motion.div>

                {/* Sample Quick Fill */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="gradient-border card-gradient rounded-xl p-4 mb-6"
                >
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <ChevronDown className="w-4 h-4 text-purple-400" />
                        Quick fill with a demo project:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_PROJECTS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => applySample(s)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors"
                            >
                                {s.emoji} {s.title}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Title */}
                    <div className="gradient-border card-gradient rounded-xl p-5">
                        <label className="block text-sm font-medium text-white mb-2">
                            Project Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. AI Campus Note-Taker"
                            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="gradient-border card-gradient rounded-xl p-5">
                        <label className="block text-sm font-medium text-white mb-2">
                            Project Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe what your project does, the problem it solves, who uses it, and what makes it unique. The more detail, the better the analysis."
                            rows={6}
                            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition resize-none"
                            required
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            {form.description.length} chars · Aim for 100+ words
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="gradient-border card-gradient rounded-xl p-5">
                        <label className="block text-sm font-medium text-white mb-2">Tech Stack</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {form.techStack.map((tag) => (
                                <span key={tag} className="tag-chip">
                                    {tag}
                                    <button type="button" onClick={() => removeTechTag(tag)}>
                                        <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        addTechTag(techInput);
                                    }
                                }}
                                placeholder="Type a technology and press Enter..."
                                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                            />
                            {techInput && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                                    {filteredSuggestions.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => addTechTag(s)}
                                            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-purple-500/10 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personalization */}
                    <div className="gradient-border card-gradient rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-medium text-white">Personalization <span className="text-muted-foreground font-normal">(optional but recommended)</span></h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Target Audience</label>
                                <input
                                    type="text"
                                    value={form.targetAudience}
                                    onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                                    placeholder="e.g. University students"
                                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Target Region</label>
                                <input
                                    type="text"
                                    value={form.targetCountry}
                                    onChange={(e) => setForm((p) => ({ ...p, targetCountry: e.target.value }))}
                                    placeholder="e.g. USA, Global, South Asia"
                                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Revenue Style</label>
                                <select
                                    value={form.preferredRevenue}
                                    onChange={(e) => setForm((p) => ({ ...p, preferredRevenue: e.target.value as ProjectInput["preferredRevenue"] }))}
                                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                                >
                                    <option value="any">Any style</option>
                                    <option value="passive">Passive income</option>
                                    <option value="active">Active / freelance</option>
                                    <option value="b2b">B2B / enterprise</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">GitHub URL</label>
                                <input
                                    type="url"
                                    value={form.githubUrl}
                                    onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1.5">Known Competitors</label>
                            <input
                                type="text"
                                value={form.knownCompetitors}
                                onChange={(e) => setForm((p) => ({ ...p, knownCompetitors: e.target.value }))}
                                placeholder="e.g. Notion, Otter.ai, Coursera"
                                className="w-full bg-background/50 border border-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                            />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="gradient-border card-gradient rounded-xl p-5">
                        <h3 className="text-sm font-medium text-white mb-3">Upload Files <span className="text-muted-foreground font-normal">(optional · max 3)</span></h3>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-border hover:border-purple-500/50 hover:bg-purple-500/5"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-white mb-1">
                                {isDragActive ? "Drop files here..." : "Drag & drop files or click to browse"}
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG, TXT, MD · Max 10MB each</p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                                        {f.type.startsWith("image/") ? (
                                            <Image className="w-4 h-4 text-blue-400" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-purple-400" />
                                        )}
                                        <span className="text-sm text-white flex-1 truncate">{f.name}</span>
                                        <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)}KB</span>
                                        <button
                                            type="button"
                                            onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                                        >
                                            <X className="w-4 h-4 text-muted-foreground hover:text-red-400 transition-colors" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                AI is analyzing your project...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Analyze & Generate Monetization Paths
                            </>
                        )}
                    </motion.button>

                    {loading && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-sm text-muted-foreground"
                        >
                            Evaluating on 5 dimensions · Matching 2026 market trends · This takes ~10–15 seconds
                        </motion.p>
                    )}
                </motion.form>
            </div>
        </div>
    );
}
