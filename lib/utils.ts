import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return score.toFixed(1);
}

export function getScoreColor(score: number): string {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-yellow-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
}

export function getScoreBgColor(score: number): string {
    if (score >= 8) return "bg-emerald-400";
    if (score >= 6) return "bg-yellow-400";
    if (score >= 4) return "bg-orange-400";
    return "bg-red-400";
}

export function getConfidenceColor(confidence: "Low" | "Medium" | "High"): string {
    switch (confidence) {
        case "High": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        case "Low": return "text-red-400 bg-red-400/10 border-red-400/20";
    }
}

export function getVerdictColor(score: number): string {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-yellow-400";
    return "text-orange-400";
}

export function saveToLocalStorage(key: string, data: unknown): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

export function loadFromLocalStorage<T>(key: string): T | null {
    if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item) as T;
            } catch {
                return null;
            }
        }
    }
    return null;
}
