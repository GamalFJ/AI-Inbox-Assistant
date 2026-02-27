"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    Briefcase,
    MessageSquare,
    Link as LinkIcon,
    Save,
    Webhook,
    Copy,
    CheckCircle2,
    Mail,
    Shield,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    Settings2,
    Loader2,
} from "lucide-react";

const BUSINESS_TYPES = ["Coach", "Consultant", "Agency", "Freelancer", "Other"];

interface Profile {
    business_type: string | null;
    business_email: string | null;
    example_replies: string | null;
    booking_link: string | null;
    onboarded: boolean;
}

export default function SettingsPage() {
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Form state
    const [businessType, setBusinessType] = useState("");
    const [businessEmail, setBusinessEmail] = useState("");
    const [exampleReplies, setExampleReplies] = useState("");
    const [bookingLink, setBookingLink] = useState("");

    // UI state
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedWebhook, setCopiedWebhook] = useState(false);
    const [webhookSecret, setWebhookSecret] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "webhook" | "domain">("profile");

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);

            // Load profile
            const res = await fetch("/api/settings");
            const profile: Profile = await res.json();
            if (profile) {
                setBusinessType(profile.business_type || "");
                setBusinessEmail(profile.business_email || "");
                setExampleReplies(profile.example_replies || "");
                setBookingLink(profile.booking_link || "");
            }

            // Simulate revealing a webhook secret (in production, store in user settings)
            // For now we show the WEBHOOK_SECRET pub portion as a user hint
            setWebhookSecret("wh_" + user.id.replace(/-/g, "").slice(0, 16));

            setIsCheckingAuth(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);
        setError(null);

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    business_type: businessType || null,
                    business_email: businessEmail || null,
                    example_replies: exampleReplies || null,
                    booking_link: bookingLink || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save settings");
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const copyWebhookUrl = () => {
        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/api/webhook/ingest`;
        navigator.clipboard.writeText(url);
        setCopiedWebhook(true);
        setTimeout(() => setCopiedWebhook(false), 2000);
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-darker">
                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
        );
    }

    const webhookUrl = typeof window !== "undefined"
        ? `${window.location.origin}/api/webhook/ingest`
        : "/api/webhook/ingest";

    const tabs = [
        { id: "profile", label: "AI Profile", icon: Settings2 },
        { id: "webhook", label: "Lead Ingestion", icon: Webhook },
        { id: "domain", label: "Email Domain", icon: Mail },
    ] as const;

    return (
        <div className="min-h-screen bg-brand-darker">
            <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-brand-orange rounded-xl text-white shadow-lg shadow-brand-orange/20">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
                    </div>
                    <p className="text-slate-400 ml-14">Manage your AI profile, lead ingestion, and email domain.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-brand-card border border-brand-border rounded-2xl p-1.5 mb-8 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/10"
                                    : "text-slate-500 hover:text-white hover:bg-brand-dark"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ===================== TAB: AI Profile ===================== */}
                {activeTab === "profile" && (
                    <div className="bg-brand-card rounded-3xl border border-brand-border shadow-xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-brand-border bg-brand-dark/30">
                            <h2 className="text-lg font-bold text-white">AI Tone Profile</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                These settings train the AI to respond in your voice and guide leads to the right next step.
                            </p>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-8">
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {saveSuccess && (
                                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    <span>Settings saved successfully!</span>
                                </div>
                            )}

                            {/* Business Type */}
                            <div>
                                <label className="flex items-center text-sm font-bold text-slate-300 mb-3">
                                    <Briefcase className="w-4 h-4 mr-2 text-brand-orange" />
                                    Business Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {BUSINESS_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBusinessType(type)}
                                            className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${businessType === type
                                                ? "bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/10"
                                                : "bg-brand-dark border-brand-border text-slate-500 hover:border-brand-orange/50 hover:text-white"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Business Email */}
                            <div>
                                <label htmlFor="businessEmail" className="flex items-center text-sm font-bold text-slate-300 mb-3">
                                    <Mail className="w-4 h-4 mr-2 text-brand-orange" />
                                    Business Email (where leads arrive)
                                </label>
                                <input
                                    id="businessEmail"
                                    type="email"
                                    placeholder="hello@yourbusiness.com"
                                    value={businessEmail}
                                    onChange={(e) => setBusinessEmail(e.target.value)}
                                    className="w-full rounded-xl border border-brand-border bg-brand-dark px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Used to route inbound emails from your email forwarding rules.
                                </p>
                            </div>

                            {/* Example Replies */}
                            <div>
                                <label htmlFor="exampleReplies" className="flex items-center text-sm font-bold text-slate-300 mb-3">
                                    <MessageSquare className="w-4 h-4 mr-2 text-brand-orange" />
                                    Example Replies (3–5 gold standards)
                                </label>
                                <textarea
                                    id="exampleReplies"
                                    rows={6}
                                    placeholder={`Example 1:\nHey [Name], thanks for reaching out! I'd love to jump on a 20-min call...\n\nExample 2:\nHi [Name], great question! Here's how I typically work with clients like you...`}
                                    value={exampleReplies}
                                    onChange={(e) => setExampleReplies(e.target.value)}
                                    className="w-full rounded-xl border border-brand-border bg-brand-dark px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition resize-none font-mono text-sm"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    The AI studies these to match your exact brand voice, sentence structure, and formatting.
                                </p>
                            </div>

                            {/* Booking Link */}
                            <div>
                                <label htmlFor="bookingLink" className="flex items-center text-sm font-bold text-slate-300 mb-3">
                                    <LinkIcon className="w-4 h-4 mr-2 text-brand-orange" />
                                    Booking / Contact Link
                                </label>
                                <input
                                    id="bookingLink"
                                    type="url"
                                    placeholder="https://calendly.com/your-name"
                                    value={bookingLink}
                                    onChange={(e) => setBookingLink(e.target.value)}
                                    className="w-full rounded-xl border border-brand-border bg-brand-dark px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    The AI includes this in every draft to guide leads to book with you.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex justify-center items-center gap-2.5 py-4 px-6 rounded-xl bg-brand-orange text-white font-bold text-base hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : saveSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* ===================== TAB: Lead Ingestion (Webhook) ===================== */}
                {activeTab === "webhook" && (
                    <div className="space-y-6">
                        {/* Webhook URL Card */}
                        <div className="bg-brand-card rounded-3xl border border-brand-border shadow-xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-brand-border bg-brand-dark/30">
                                <h2 className="text-lg font-bold text-white">Inbound Webhook</h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    Point your email provider to this URL to auto-ingest leads.
                                </p>
                            </div>
                            <div className="p-8 space-y-6">

                                {/* Endpoint URL */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                        Webhook Endpoint URL
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-brand-dark text-emerald-400 font-mono text-sm px-4 py-3.5 rounded-xl overflow-x-auto whitespace-nowrap border border-brand-border">
                                            {webhookUrl}
                                        </div>
                                        <button
                                            onClick={copyWebhookUrl}
                                            className="flex items-center gap-2 px-4 py-3.5 bg-brand-dark border border-brand-border hover:bg-brand-card text-white font-bold text-sm rounded-xl transition-all duration-200 shrink-0"
                                        >
                                            {copiedWebhook ? (
                                                <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied!</>
                                            ) : (
                                                <><Copy className="w-4 h-4" /> Copy</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Webhook Secret */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                        Your Secret Key (send in payload as <code className="text-brand-orange">secret</code>)
                                    </label>
                                    <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-4 py-3 font-mono text-sm text-brand-orange flex items-center gap-3">
                                        <Shield className="w-4 h-4 shrink-0" />
                                        <span className="tracking-wider">{webhookSecret}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Set this as <code className="text-slate-400">WEBHOOK_SECRET</code> in your server environment. Include it in every webhook payload.
                                    </p>
                                </div>

                                {/* Expected Payload */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                        Expected JSON Payload
                                    </label>
                                    <pre className="bg-brand-dark text-slate-300 text-xs font-mono rounded-xl p-5 overflow-x-auto leading-relaxed border border-brand-border">
                                        {`{
  "secret": "${webhookSecret}",
  "user_id": "${userId || "your-supabase-user-id"}",
  "from":    "lead@example.com",
  "subject": "Interested in your services",
  "body":    "Hi, I saw your work and would love to chat..."
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Provider Setup Guides */}
                        <div className="bg-brand-card rounded-3xl border border-brand-border shadow-xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-brand-border">
                                <h3 className="text-base font-bold text-white">How to Connect Your Email Provider</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    Forward inbound emails to your webhook using one of these providers:
                                </p>
                            </div>
                            <div className="divide-y divide-brand-border">
                                {[
                                    {
                                        name: "Postmark",
                                        description: "Go to Servers → Inbound → set your webhook URL. Postmark will POST a JSON payload for every inbound email.",
                                        href: "https://postmarkapp.com/developer/webhooks/inbound-webhook",
                                        badge: "Recommended",
                                        badgeColor: "bg-emerald-500/10 text-emerald-400",
                                    },
                                    {
                                        name: "Mailgun",
                                        description: "Create an Inbound Route with the action forward() pointing to your webhook URL.",
                                        href: "https://documentation.mailgun.com/en/latest/user_manual.html#routes",
                                        badge: "Easy",
                                        badgeColor: "bg-blue-500/10 text-blue-400",
                                    },
                                    {
                                        name: "Resend Inbound (beta)",
                                        description: "Resend supports inbound email webhooks in beta — ideal if you already use Resend for sending.",
                                        href: "https://resend.com/docs/dashboard/domains/introduction",
                                        badge: "Beta",
                                        badgeColor: "bg-amber-500/10 text-brand-yellow",
                                    },
                                    {
                                        name: "Gmail / Outlook (Zapier)",
                                        description: "Use Zapier to watch your inbox, then POST to this webhook URL via the Webhooks by Zapier step.",
                                        href: "https://zapier.com/apps/webhooks/integrations",
                                        badge: "No Code",
                                        badgeColor: "bg-purple-500/10 text-purple-400",
                                    },
                                ].map((provider) => (
                                    <div key={provider.name} className="flex items-center justify-between px-8 py-5 hover:bg-brand-dark/30 transition-colors group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-slate-200 text-sm">{provider.name}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${provider.badgeColor}`}>
                                                    {provider.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{provider.description}</p>
                                        </div>
                                        <a
                                            href={provider.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-6 flex items-center gap-1.5 text-brand-orange text-xs font-bold hover:text-brand-yellow transition-colors shrink-0"
                                        >
                                            Docs <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== TAB: Email Domain ===================== */}
                {activeTab === "domain" && (
                    <div className="space-y-6">
                        <div className="bg-brand-card rounded-3xl border border-brand-border shadow-xl overflow-hidden">
                            <div className="px-8 py-6 border-b border-brand-border bg-brand-dark/30">
                                <h2 className="text-lg font-bold text-white">Custom Domain Verification</h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    Send emails from your own domain (e.g. <strong>reply@yourbusiness.com</strong>) instead of Resend&apos;s default shared domain.
                                </p>
                            </div>
                            <div className="p-8 space-y-8">

                                {/* Why it matters */}
                                <div className="flex gap-4 p-5 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                                    <Shield className="w-6 h-6 text-brand-orange mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Why verify a domain?</p>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Verified domains significantly improve email deliverability, prevent spoofing flags, and ensure your emails land in the inbox — not spam.
                                        </p>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-6">
                                    {[
                                        {
                                            step: "1",
                                            title: "Open Resend Dashboard",
                                            desc: "Go to resend.com → Domains → Add Domain. Enter your domain (e.g. yourbusiness.com).",
                                            action: { label: "Open Resend", href: "https://resend.com/domains" },
                                        },
                                        {
                                            step: "2",
                                            title: "Add DNS Records",
                                            desc: "Resend will provide you with SPF, DKIM, and optional DMARC records. Add these to your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.).",
                                            action: null,
                                        },
                                        {
                                            step: "3",
                                            title: "Verify in Resend",
                                            desc: "After adding DNS records (propagation can take up to 48h), click Verify in your Resend dashboard. The domain status will turn green.",
                                            action: null,
                                        },
                                        {
                                            step: "4",
                                            title: "Update Your Send-Email Route",
                                            desc: "In app/api/send-email/route.ts, change the 'from' field from onboarding@resend.dev to your verified address, e.g. reply@yourbusiness.com.",
                                            action: null,
                                        },
                                    ].map((item) => (
                                        <div key={item.step} className="flex gap-5 group">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-orange text-white text-sm font-black shrink-0 mt-0.5 shadow-lg shadow-brand-orange/20 border border-white/10 group-hover:scale-110 transition-transform">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                                {item.action && (
                                                    <a
                                                        href={item.action.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 mt-3 text-brand-orange text-xs font-bold hover:text-brand-yellow transition-colors"
                                                    >
                                                        {item.action.label}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* DNS Record Preview */}
                                <div className="pt-8 border-t border-brand-border">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">
                                        Example DNS Records (provided by Resend)
                                    </label>
                                    <div className="overflow-hidden rounded-2xl border border-brand-border">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs font-mono">
                                                <thead>
                                                    <tr className="bg-brand-dark/50 text-slate-500 text-left uppercase tracking-widest font-black">
                                                        <th className="px-5 py-3 font-bold">Type</th>
                                                        <th className="px-5 py-3 font-bold">Name</th>
                                                        <th className="px-5 py-3 font-bold">Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-brand-border bg-brand-dark/20">
                                                    <tr className="hover:bg-brand-dark/40 transition-colors">
                                                        <td className="px-5 py-4 text-blue-400 font-bold">TXT</td>
                                                        <td className="px-5 py-4 text-slate-300">@</td>
                                                        <td className="px-5 py-4 text-slate-500 truncate max-w-xs">v=spf1 include:amazonses.com ~all</td>
                                                    </tr>
                                                    <tr className="hover:bg-brand-dark/40 transition-colors">
                                                        <td className="px-5 py-4 text-emerald-400 font-bold">CNAME</td>
                                                        <td className="px-5 py-4 text-slate-300">resend._domainkey</td>
                                                        <td className="px-5 py-4 text-slate-500 truncate max-w-xs">p=MIGfMA0GCSq... (DKIM key)</td>
                                                    </tr>
                                                    <tr className="hover:bg-brand-dark/40 transition-colors">
                                                        <td className="px-5 py-4 text-purple-400 font-bold">TXT</td>
                                                        <td className="px-5 py-4 text-slate-300">_dmarc</td>
                                                        <td className="px-5 py-4 text-slate-500 truncate max-w-xs">v=DMARC1; p=none;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[10px] text-slate-600 italic">
                                        * Exact values will be generated by Resend for your specific domain.
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-brand-border">
                                    <a
                                        href="https://resend.com/docs/dashboard/domains/introduction"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-brand-orange font-bold hover:text-brand-yellow transition"
                                    >
                                        Read full Resend domain guide <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
