"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard/input");
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-[#0c0c14] to-[#12121a]">
                {/* Glow effect */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />

                <div className="p-12 relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Cash Craft</h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md space-y-6"
                    >
                        <h2 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                            Turn Ideas <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                into Income
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            The intelligent engine designed to accelerate your creative projects into profitable revenue streams with AI-driven insights.
                        </p>

                        <div className="inline-flex flex-col justify-center items-start mt-4">
                            <div className="flex items-center gap-2 px-4 py-2 mt-4 rounded-full bg-card border border-border">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase tracking-wider">System Status: Optimal</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Abstract Branding Graphic */}
                <div className="flex-1 w-full flex items-end justify-center p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="w-full h-full max-h-[350px] rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md shadow-2xl overflow-hidden relative"
                    >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 pointer-events-none" />
                        {/* Mock UI elements in graphic */}
                        <div className="absolute top-8 left-8 right-8 h-4 rounded bg-primary/10 w-1/3" />
                        <div className="absolute top-16 left-8 right-8 h-2 rounded bg-border/40 w-1/2" />
                        <div className="absolute top-24 left-8 right-8 h-[120px] rounded bg-secondary/30 w-full" />
                        <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-primary/20 blur-[50px]" />
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0d] relative">
                {/* Sparkles abstract decoration */}
                <div className="absolute bottom-12 right-12 opacity-20 pointer-events-none">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="text-muted-foreground fill-current">
                        <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0" />
                        <path d="M80 70 C80 80 85 85 95 85 C85 85 80 90 80 100 C80 90 75 85 65 85 C75 85 80 80 80 70" />
                        <path d="M20 70 C20 80 25 85 35 85 C25 85 20 90 20 100 C20 90 15 85 5 85 C15 85 20 80 20 70" transform="scale(0.6) translate(30, -50)" />
                    </svg>
                </div>

                <div className="w-full max-w-md space-y-8 z-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome!</h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-secondary transition-colors text-white text-sm font-medium"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            OR LOGIN WITH EMAIL
                        </span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full bg-transparent border-b border-border pb-2 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-muted-foreground">Password</label>
                                    <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-b border-border pb-2 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors text-sm tracking-widest"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-semibold transition-all shadow-lg shadow-purple-900/20"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="w-full py-3.5 rounded-2xl bg-transparent border border-border text-white hover:bg-secondary transition-colors font-semibold"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-xs text-muted-foreground pt-4">
                        By signing in, you agree to our <Link href="#" className="text-white hover:underline">Terms of Service</Link> and <Link href="#" className="text-white hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
