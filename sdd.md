# Project-to-Income Engine
**From Student Project to Monetizable Idea**  
**Software Development Document (SDD)**  
**Version 1.0**  
**Hackathon: Vibe Hack 2026**  
**Date: April 08, 2026**

---

### 1. Project Overview

**Project-to-Income Engine** is an AI-powered platform that helps students convert their academic or personal projects into real-world revenue opportunities. Students input their project details (description, tech stack, files), and the system performs a structured evaluation, predicts real-world value, and generates actionable monetization paths grounded in 2026 market trends.

The core philosophy is **"AI as a startup mentor — Student stays in control"**. The AI never gives generic advice; it evaluates on five concrete dimensions, references current market trends, and offers an iterative "refine" loop so students can tweak suggestions until they are happy.

**Goal for Hackathon MVP**: Build a fully functional, live-demo-ready prototype that takes a student project, returns a professional evaluation + 3–5 monetization paths, and lets the user refine suggestions instantly.

---

### 2. Problem Statement (from Hackathon Brief)

Students build projects but struggle to convert them into income or opportunities.

**Scenario**: A student inputs a project idea, and the system suggests monetization paths.

**Expected Solution**: A platform translating projects into real-world value and revenue opportunities.

---

### 3. Core Requirements (Must-Have for MVP)

| Requirement              | Description |
|--------------------------|-----------|
| Project input            | Title, description, tech stack, optional file uploads (PDF, PPT, screenshots, GitHub README) |
| Monetization suggestions | 3–5 tailored paths with pricing, target users, and actionable steps |
| Target users             | Primary & secondary segments (auto-detected + user override) |
| Pricing idea             | Specific tiers + justification based on 2026 trends |
| Structured output        | Clean dashboard with evaluation score, revenue estimates, and exportable summary |
| Market-aware evaluation  | Real-world value prediction using injected 2026 trends |
| User happiness loop      | "Refine suggestions" feature for iterative improvement |

---

### 4. Detailed Features & User Stories (MVP Scope)

**Phase 1 – Project Input**
- Simple form: Project title, detailed description (rich textarea), tech stack tags
- Optional uploads: PDF report, PPT, screenshots, or pasted GitHub link
- Personalization fields: Target audience/country, preferred revenue style (passive/active/B2B), known competitors
- Pre-loaded sample projects for instant demo

**Phase 2 – AI Analysis**
- Text extraction from all files + vision support for images/screenshots
- Single OpenRouter call that:
  - Evaluates on **5 dimensions**: Market Size & Demand, Uniqueness & Competition, Technical Feasibility, Monetization Potential, Execution Risk & Timeline
  - Predicts Real-World Value Score (1–10) + estimated first-year revenue (conservative/realistic/optimistic)
  - Generates 3–5 monetization paths grounded in hardcoded 2026 trends

**Phase 3 – Results Dashboard**
- Left panel: Evaluation summary (score, verdict, 5-dimension breakdown)
- Right panel: Monetization paths as interactive cards
- Each card shows: model, target users, pricing tiers, first 3 steps, "Why this fits" explanation, confidence meter
- Big "Not quite right? Refine suggestions" button

**Phase 4 – Output & Polish**
- One-click export as PDF pitch summary
- Save paths to local storage
- Regenerate button for fresh suggestions

---

### 5. System Workflow (End-to-End)

1. **Input Screen** → Student fills form + uploads files  
2. **Processing** → Text/image extraction → One OpenRouter API call (with injected 2026 market trends summary)  
3. **Results Dashboard** → Evaluation score + monetization cards  
4. **Happiness Loop** → User clicks "Refine" → types feedback → second API call → improved suggestions  
5. **Output** → Export PDF or save idea

---

### 6. Technical Architecture

- **Frontend**: Next.js 15 App Router (React Server Components)
- **Backend**: Next.js API Routes
- **AI Layer**: OpenRouter (free models)
- **File Handling**: Server-side text extraction + vision support
- **State Management**: React state + localStorage
- **Styling**: Tailwind CSS + shadcn/ui
- **Market Trends**: Static file `lib/market-trends-2026.ts`
- **Deployment**: Vercel

---

### 7. Project Structure

```
campus-2-cash/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Landing / Hero page
│   ├── dashboard/
│   │   ├── page.tsx               # Main results dashboard
│   │   └── input/
│   │       └── page.tsx           # Project input form
│   └── api/
│       └── analyze/
│           └── route.ts           # Main AI evaluation endpoint
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── InputForm.tsx
│   ├── UploadZone.tsx
│   ├── EvaluationPanel.tsx
│   ├── MonetizationCard.tsx
│   ├── RefineModal.tsx
│   └── ExportButton.tsx
├── lib/
│   ├── utils.ts
│   ├── ai-prompts.ts
│   ├── market-trends-2026.ts
│   └── file-utils.ts
├── types/
│   └── index.ts
└── .env.local
```

---

### 8. Data Models / Types

- `ProjectInput`: title, description, techStack, files, targetAudience, preferredRevenue
- `EvaluationResult`: realWorldValueScore, verdict, dimensions, revenueEstimate
- `MonetizationPath`: id, model, targetUsers, pricing, steps, whyItFits, confidence
- `AnalysisResponse`: evaluation, paths, overallInsights

---

### 9. Non-Functional Requirements

- Performance: <15 seconds processing
- UX: Dark mode student-friendly dashboard
- Demo-Ready: 4–5 pre-loaded sample projects
- Cost: 100% free (OpenRouter free tier + Vercel)
- Accessibility: Keyboard navigation

---

### 10. Deployment

- Deploy on Vercel
- Share live link + 60-second demo video