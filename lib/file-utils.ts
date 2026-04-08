/**
 * Server-side file extraction utilities.
 * pdf-parse is used for PDF text extraction.
 * Images are encoded as base64 for vision models.
 */

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Dynamic import to avoid edge runtime issues
        const pdfParse = (await import("pdf-parse")).default;
        const data = await pdfParse(buffer);
        return data.text || "";
    } catch (error) {
        console.error("PDF extraction error:", error);
        return "";
    }
}

export function encodeImageToBase64(buffer: Buffer, mimeType: string): string {
    const base64 = buffer.toString("base64");
    return `data:${mimeType};base64,${base64}`;
}

export function isImageFile(mimeType: string): boolean {
    return mimeType.startsWith("image/");
}

export function isPDFFile(mimeType: string): boolean {
    return mimeType === "application/pdf";
}

export function isTextFile(mimeType: string): boolean {
    return mimeType.startsWith("text/") || mimeType === "application/json";
}

export async function extractTextFromFile(
    buffer: Buffer,
    mimeType: string,
    fileName: string
): Promise<{ text: string; isImage: boolean; base64?: string }> {
    if (isPDFFile(mimeType)) {
        const text = await extractTextFromPDF(buffer);
        return { text: `[PDF: ${fileName}]\n${text}`, isImage: false };
    }

    if (isTextFile(mimeType)) {
        return {
            text: `[Text file: ${fileName}]\n${buffer.toString("utf-8")}`,
            isImage: false,
        };
    }

    if (isImageFile(mimeType)) {
        return {
            text: `[Image: ${fileName}]`,
            isImage: true,
            base64: encodeImageToBase64(buffer, mimeType),
        };
    }

    // Generic: try to read as text
    return {
        text: `[File: ${fileName}]\n${buffer.toString("utf-8")}`,
        isImage: false,
    };
}

export function truncateText(text: string, maxChars = 3000): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "\n...[truncated]";
}
