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
    const supabase = createClient();

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
        } catch (err: any) {
            setError(err.message);
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                    </div>
                    <p className="text-slate-500 ml-14">Manage your AI profile, lead ingestion, and email domain.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-8 shadow-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
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
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                            <h2 className="text-lg font-bold text-slate-800">AI Tone Profile</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                These settings train the AI to respond in your voice and guide leads to the right next step.
                            </p>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-8">
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {saveSuccess && (
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    <span>Settings saved successfully!</span>
                                </div>
                            )}

                            {/* Business Type */}
                            <div>
                                <label className="flex items-center text-sm font-bold text-slate-700 mb-3">
                                    <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                                    Business Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {BUSINESS_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBusinessType(type)}
                                            className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${businessType === type
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Business Email */}
                            <div>
                                <label htmlFor="businessEmail" className="flex items-center text-sm font-bold text-slate-700 mb-3">
                                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                    Business Email (where leads arrive)
                                </label>
                                <input
                                    id="businessEmail"
                                    type="email"
                                    placeholder="hello@yourbusiness.com"
                                    value={businessEmail}
                                    onChange={(e) => setBusinessEmail(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Used to route inbound emails from your email forwarding rules.
                                </p>
                            </div>

                            {/* Example Replies */}
                            <div>
                                <label htmlFor="exampleReplies" className="flex items-center text-sm font-bold text-slate-700 mb-3">
                                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                                    Example Replies (3–5 gold standards)
                                </label>
                                <textarea
                                    id="exampleReplies"
                                    rows={6}
                                    placeholder={`Example 1:\nHey [Name], thanks for reaching out! I'd love to jump on a 20-min call...\n\nExample 2:\nHi [Name], great question! Here's how I typically work with clients like you...`}
                                    value={exampleReplies}
                                    onChange={(e) => setExampleReplies(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none font-mono text-sm"
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    The AI studies these to match your exact brand voice, sentence structure, and formatting.
                                </p>
                            </div>

                            {/* Booking Link */}
                            <div>
                                <label htmlFor="bookingLink" className="flex items-center text-sm font-bold text-slate-700 mb-3">
                                    <LinkIcon className="w-4 h-4 mr-2 text-blue-500" />
                                    Booking / Contact Link
                                </label>
                                <input
                                    id="bookingLink"
                                    type="url"
                                    placeholder="https://calendly.com/your-name"
                                    value={bookingLink}
                                    onChange={(e) => setBookingLink(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    The AI includes this in every draft to guide leads to book with you.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <h2 className="text-lg font-bold text-slate-800">Inbound Webhook</h2>
                                <p className="text-sm text-slate-500 mt-1">
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
                                        <div className="flex-1 bg-slate-900 text-emerald-400 font-mono text-sm px-4 py-3.5 rounded-xl overflow-x-auto whitespace-nowrap">
                                            {webhookUrl}
                                        </div>
                                        <button
                                            onClick={copyWebhookUrl}
                                            className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all duration-200 shrink-0"
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
                                        Your Secret Key (send in payload as <code className="text-blue-600">secret</code>)
                                    </label>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-mono text-sm text-amber-800 flex items-center gap-3">
                                        <Shield className="w-4 h-4 shrink-0 text-amber-500" />
                                        <span className="tracking-wider">{webhookSecret}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400">
                                        Set this as <code className="text-slate-600">WEBHOOK_SECRET</code> in your server environment. Include it in every webhook payload.
                                    </p>
                                </div>

                                {/* Expected Payload */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                        Expected JSON Payload
                                    </label>
                                    <pre className="bg-slate-900 text-slate-200 text-xs font-mono rounded-xl p-5 overflow-x-auto leading-relaxed">
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
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-800">How to Connect Your Email Provider</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Forward inbound emails to your webhook using one of these providers:
                                </p>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {[
                                    {
                                        name: "Postmark",
                                        description: "Go to Servers → Inbound → set your webhook URL. Postmark will POST a JSON payload for every inbound email.",
                                        href: "https://postmarkapp.com/developer/webhooks/inbound-webhook",
                                        badge: "Recommended",
                                        badgeColor: "bg-blue-100 text-blue-700",
                                    },
                                    {
                                        name: "Mailgun",
                                        description: "Create an Inbound Route with the action forward() pointing to your webhook URL.",
                                        href: "https://documentation.mailgun.com/en/latest/user_manual.html#routes",
                                        badge: "Easy",
                                        badgeColor: "bg-emerald-100 text-emerald-700",
                                    },
                                    {
                                        name: "Resend Inbound (beta)",
                                        description: "Resend supports inbound email webhooks in beta — ideal if you already use Resend for sending.",
                                        href: "https://resend.com/docs/dashboard/domains/introduction",
                                        badge: "Beta",
                                        badgeColor: "bg-amber-100 text-amber-700",
                                    },
                                    {
                                        name: "Gmail / Outlook (Zapier)",
                                        description: "Use Zapier to watch your inbox, then POST to this webhook URL via the Webhooks by Zapier step.",
                                        href: "https://zapier.com/apps/webhooks/integrations",
                                        badge: "No Code",
                                        badgeColor: "bg-purple-100 text-purple-700",
                                    },
                                ].map((provider) => (
                                    <div key={provider.name} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-colors group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-semibold text-slate-800 text-sm">{provider.name}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${provider.badgeColor}`}>
                                                    {provider.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{provider.description}</p>
                                        </div>
                                        <a
                                            href={provider.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-6 flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:text-blue-800 transition-colors shrink-0"
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
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                <h2 className="text-lg font-bold text-slate-800">Custom Domain Verification</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Send emails from your own domain (e.g. <strong>reply@yourbusiness.com</strong>) instead of Resend&apos;s default shared domain.
                                </p>
                            </div>
                            <div className="p-8 space-y-6">

                                {/* Why it matters */}
                                <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800">Why verify a domain?</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Verified domains significantly improve email deliverability, prevent spoofing flags, and ensure your emails land in the inbox — not spam.
                                        </p>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-4">
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
                                        <div key={item.step} className="flex gap-5">
                                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0 mt-0.5 shadow-lg shadow-blue-200">
                                                {item.step}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                                                {item.action && (
                                                    <a
                                                        href={item.action.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 mt-2 text-blue-600 text-xs font-semibold hover:underline"
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
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                                        Example DNS Records (provided by Resend)
                                    </label>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="bg-slate-100 text-slate-600 text-left">
                                                    <th className="px-4 py-2 rounded-tl-xl font-semibold">Type</th>
                                                    <th className="px-4 py-2 font-semibold">Name</th>
                                                    <th className="px-4 py-2 rounded-tr-xl font-semibold">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 text-blue-600 font-bold">TXT</td>
                                                    <td className="px-4 py-2 text-slate-700">@</td>
                                                    <td className="px-4 py-2 text-slate-500 truncate max-w-xs">v=spf1 include:amazonses.com ~all</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 text-emerald-600 font-bold">CNAME</td>
                                                    <td className="px-4 py-2 text-slate-700">resend._domainkey</td>
                                                    <td className="px-4 py-2 text-slate-500 truncate max-w-xs">p=MIGfMA0GCSq... (DKIM key)</td>
                                                </tr>
                                                <tr className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 text-purple-600 font-bold">TXT</td>
                                                    <td className="px-4 py-2 text-slate-700">_dmarc</td>
                                                    <td className="px-4 py-2 text-slate-500 truncate max-w-xs">v=DMARC1; p=none;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-400">
                                        Exact values will be generated by Resend for your specific domain.
                                    </p>
                                </div>

                                <a
                                    href="https://resend.com/docs/dashboard/domains/introduction"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
                                >
                                    Read full Resend domain guide <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
