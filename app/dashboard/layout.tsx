"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, History, Lightbulb, Settings, HelpCircle, LogOut, Plus, Zap } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("c2c_result");
        localStorage.removeItem("c2c_input");
        localStorage.removeItem("selectedSample");
        router.push("/login");
    };
    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-[280px] border-r border-border bg-card flex flex-col h-full hidden lg:flex">
                {/* Logo Area */}
                <div className="p-6 pb-8 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white tracking-tight leading-tight">Cash Craft Engine</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
                                <span className="text-xs text-muted-foreground font-medium">AI Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {[
                        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                        { name: "History", href: "#", icon: History },
                        { name: "Insights", href: "#", icon: Lightbulb },
                        { name: "Settings", href: "/dashboard/settings", icon: Settings },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto w-1 h-5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 space-y-4">
                    <Link
                        href="/dashboard/input"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-900/20 transition-all border border-white/10"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </Link>

                    <div className="px-2 space-y-1">
                        <button className="flex items-center gap-3 w-full px-2 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
                            <HelpCircle className="w-4 h-4" />
                            Help
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Navbar */}
                <header className="h-[72px] flex items-center justify-between px-8 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 hidden md:flex">
                    <div className="flex items-center gap-8">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Cash Craft
                        </h2>
                        <nav className="flex items-center gap-6">
                            {["Overview", "Analytics", "Campaigns"].map((item, i) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className={`text-sm font-medium ${i === 0 ? "text-white" : "text-muted-foreground hover:text-white"}`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-muted-foreground hover:text-white">
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border-[1.5px] border-background" />
                            <History className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 pl-4 border-l border-border">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <span className="text-sm font-bold text-white">ER</span>
                            </div>
                            <span className="text-sm font-medium text-white hidden xl:block">Elena Rodriguez</span>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
