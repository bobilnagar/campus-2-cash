"use client";

import { motion } from "framer-motion";
import { LogOut, ToggleRight, Fingerprint, MonitorSmartphone, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("c2c_result");
        localStorage.removeItem("c2c_input");
        localStorage.removeItem("selectedSample");
        router.push("/login");
    };

    return (
        <div className="p-8 pb-16 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your profile, preferences, and account security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Wider) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <div className="gradient-border card-gradient rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-border overflow-hidden">
                                        {/* Placeholder Avatar */}
                                        <div className="w-full h-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                            <span className="text-xl font-bold text-purple-200">ER</span>
                                        </div>
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary">
                                        <span className="text-[10px]">✏️</span>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Elena Rodriguez</h3>
                                    <p className="text-sm text-muted-foreground">Senior Interface Architect</p>
                                </div>
                            </div>
                            <button className="text-xs font-semibold text-primary uppercase tracking-wider hover:underline">
                                UPDATE PHOTO
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Elena Rodriguez"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="elena.r@cashcraft.ai"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                                <input
                                    type="text"
                                    defaultValue="San Francisco, CA"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
                                <input
                                    type="text"
                                    defaultValue="@elenar_arch"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appearance Card */}
                    <div className="gradient-border card-gradient rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <MonitorSmartphone className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Appearance</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                        🌙
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Theme Mode</p>
                                        <p className="text-xs text-muted-foreground">Switch between Dark and Light interface</p>
                                    </div>
                                </div>
                                <ToggleRight className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center opacity-50">
                                        ✨
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Reduced Motion</p>
                                        <p className="text-xs text-muted-foreground">Disable background animations and parallax</p>
                                    </div>
                                </div>
                                <div className="w-8 h-4 rounded-full bg-secondary relative">
                                    <div className="absolute left-1 top-1 w-2 h-2 rounded-full bg-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-semibold transition-all shadow-lg shadow-purple-900/20">
                            Save Changes
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-transparent text-white font-medium hover:bg-secondary transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Right Column (Narrower) */}
                <div className="space-y-6">
                    {/* Security Status */}
                    <div className="gradient-border card-gradient rounded-2xl p-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">Security Status</h3>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <Fingerprint className="w-4 h-4 text-emerald-400" />
                                <span className="text-white">2FA Enabled</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm flex-wrap">
                                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin ml-0.5" />
                                <span className="text-white">Password updated 12d ago</span>
                            </div>
                        </div>
                        <button className="w-full py-2.5 rounded-lg border border-border bg-transparent hover:bg-secondary text-white text-sm font-medium transition-colors">
                            Manage Security
                        </button>
                    </div>

                    {/* Account Control */}
                    <div className="rounded-2xl p-6 bg-red-950/10 border border-red-500/20">
                        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Account Control</h3>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                            Closing your account will delete all Cash Craft projects and metadata permanently.
                        </p>
                        <div className="space-y-3">
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-card border border-border hover:bg-secondary text-white text-sm font-medium transition-colors">
                                <LogOut className="w-4 h-4" />
                                Logout Session
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent hover:bg-red-500/10 text-red-400 text-sm font-medium transition-colors rounded-lg">
                                Deactivate Account
                            </button>
                        </div>
                    </div>

                    {/* Cash Craft PRO Banner */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#0c0c14] border border-primary/20 p-6 relative overflow-hidden group hover:border-primary/40 transition-colors cursor-pointer">
                        <div className="absolute -right-4 -top-8 text-6xl opacity-10 blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">✨</div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">Cash Craft Pro</span>
                        <h4 className="text-lg font-bold text-white leading-tight">Unleash the full<br />Engine</h4>
                    </div>
                </div>

            </div>
        </div>
    );
}
