import { SampleProject } from "@/types";

export const SAMPLE_PROJECTS: SampleProject[] = [
    {
        id: "ai-note-taker",
        emoji: "🎙️",
        title: "AI Campus Note-Taker",
        description:
            "A web app that lets students record lectures in real-time, automatically transcribes them using AI, generates summaries, creates flashcards, and exports notes in multiple formats. Built for university students who struggle to keep up with fast-paced lectures. Has a mobile-friendly UI and supports 10+ languages.",
        techStack: ["React", "Next.js", "OpenAI Whisper", "TypeScript", "Supabase"],
        targetAudience: "University students, especially STEM majors",
        preferredRevenue: "passive",
    },
    {
        id: "campus-marketplace",
        emoji: "🛍️",
        title: "Campus Student Marketplace",
        description:
            "A peer-to-peer marketplace app exclusively for university students to buy, sell, and trade textbooks, electronics, furniture, and course materials. Verified .edu email login ensures safety. Built-in chat, rating system, and campus-specific listings. Can expand to multiple universities.",
        techStack: ["React Native", "Firebase", "Node.js", "Stripe", "Expo"],
        targetAudience: "University students on college campuses",
        preferredRevenue: "active",
    },
    {
        id: "mental-health-bot",
        emoji: "🧠",
        title: "Student Mental Health Companion",
        description:
            "An AI-powered mental health support chatbot trained on CBT techniques, designed specifically for college students experiencing stress, anxiety, or burnout. Provides 24/7 non-judgmental support, mood tracking, and refers to campus counseling resources when needed. Completely anonymous.",
        techStack: ["Python", "FastAPI", "LangChain", "React", "PostgreSQL"],
        targetAudience: "College students struggling with mental health",
        preferredRevenue: "b2b",
    },
    {
        id: "peer-tutoring",
        emoji: "📚",
        title: "AI-Matched Peer Tutoring Platform",
        description:
            "A platform that uses AI to match students needing tutoring with student tutors based on subject, learning style, schedule, and past performance. Includes video calling, shared whiteboard, session recording, and automatic payment splitting. Built for university ecosystems.",
        techStack: ["Next.js", "WebRTC", "Prisma", "PostgreSQL", "Stripe Connect"],
        targetAudience: "University students and academic tutors",
        preferredRevenue: "active",
    },
    {
        id: "iot-power-manager",
        emoji: "⚡",
        title: "Dorm Room IoT Power Manager",
        description:
            "A smart IoT system that monitors and optimizes electricity usage in dorm rooms and shared student apartments. Uses affordable Raspberry Pi + smart plugs to track appliance usage, predict bills, suggest energy-saving habits, and alert on unusual consumption. Comes with a sleek mobile dashboard.",
        techStack: ["Python", "Raspberry Pi", "MQTT", "React Native", "InfluxDB"],
        targetAudience: "Students in dorms or shared apartments",
        preferredRevenue: "passive",
    },
];
