import Link from "next/link"
import Image from "next/image"
import { CheckCircle, HelpCircle, Map, Rocket, Shield, Layers, Star, Lock, Clock, AlertTriangle, MessageSquare, Target } from "lucide-react"
import FoundingMemberCounter from "@/components/FoundingMemberCounter"

export default function Home() {
    return (
        <div className="flex flex-col w-full">

            {/* ── Hero Section ── */}
            <section className="hero-section py-24 md:py-36">
                <div className="container mx-auto px-4 text-center relative z-10">

                    {/* Brand Logo */}
                    <div className="flex justify-center mb-10 animate-fade-in text-left">
                        <Image
                            src="/images/icon.png"
                            alt="AI Inbox Assistant Logo"
                            width={144}
                            height={144}
                            className="h-28 w-28 md:h-36 md:w-36 object-contain transition-transform hover:scale-110 duration-500"
                        />
                    </div>

                    {/* Founding member badge */}
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#FAE588]/10 text-[#FAE588] text-sm font-bold tracking-wide animate-fade-in border border-[#FAE588]/20">
                        <Star className="w-3.5 h-3.5 fill-[#FAE588] text-[#FAE588]" />
                        Founding Member Offer — First 200 Users Only
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight animate-slide-up">
                        Never Lose a Lead to{" "}
                        <span className="hero-gradient-text">Your Inbox</span> Again
                    </h1>

                    <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
                        A plug‑and‑play AI assistant that drafts your replies and follow‑ups so you
                        stop leaving money in unread emails. No calls, no &lsquo;AI strategy&rsquo;
                        fluff; just results.
                    </p>

                    {/* Trial CTA button */}
                    <div className="mt-12 animate-slide-up-delay">
                        <Link
                            href="/signup?trial=true"
                            id="hero-trial-button"
                            className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-brand-orange/90 transition-all duration-300 shadow-2xl shadow-brand-orange/20 hover:scale-105 active:scale-95 group"
                        >
                            Start your 3-day Free Trial now
                            <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                        <p className="mt-4 text-slate-400 text-sm font-medium">
                            No credit card required. Instant access.
                        </p>
                    </div>


                    {/* Urgency sub-text */}
                    <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2 animate-slide-up-delay-2">
                        <Clock className="w-4 h-4 text-[#FAE588]" />
                        Once all 200 seats are taken, this price is gone permanently.
                    </p>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="py-24 bg-[#1C2023] relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF8559]/20 to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF8559]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FAE588]/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20 animate-fade-in">
                        <span className="text-[#FAE588] text-xs font-black uppercase tracking-[0.2em] mb-4 block">
                            Stop leaving money on the table
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 text-left">
                            Your Inbox is a <span className="text-[#FF8559]">Gold Mine</span>.<br className="hidden md:block" />
                            Don&apos;t Let It Become a Graveyard.
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed text-left">
                            We didn&apos;t build another &ldquo;productivity app.&rdquo; We built a revenue recovery engine
                            that fixes the biggest leak in your business: **your response time.**
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Layers className="w-6 h-6" />,
                                title: "AI Lead Extraction",
                                pain: "Sifting through 100s of emails just to find one potential client?",
                                result: "Our AI identifies high-intent leads instantly and pulls them into a clean dashboard.",
                                benefit: "Saves 2+ hours of 'digging' every day.",
                                color: "#FF8559"
                            },
                            {
                                icon: <MessageSquare className="w-6 h-6" />,
                                title: "Smart Tone-Matched Drafts",
                                pain: "Hate generic AI replies that sound like a robot?",
                                result: "Upload 3 'Gold Standard' replies, and the AI will mirror your vocabulary and style perfectly.",
                                benefit: "Leads can't tell it's AI. High response rates.",
                                color: "#FAE588"
                            },
                            {
                                icon: <Clock className="w-6 h-6" />,
                                title: "Zero-Latency Follow-ups",
                                pain: "Forgetting to follow up because 'I'll do it later'?",
                                result: "The assistant drafts follow-ups automatically if they haven't replied within your set window.",
                                benefit: "Never let a deal go cold again.",
                                color: "#FF8559"
                            },
                            {
                                icon: <Target className="w-6 h-6" />,
                                title: "Active Deal Radar",
                                pain: "Leads getting buried under newsletters and Amazon receipts?",
                                result: "We filter the noise. You only see what matters: people who want to pay you.",
                                benefit: "Zero missed opportunities. Ever.",
                                color: "#FAE588"
                            },
                            {
                                icon: <Shield className="w-6 h-6" />,
                                title: "Privacy-First Architecture",
                                pain: "Worried about AI training on your private client data?",
                                result: "Your data is yours. We don't use your emails to train global models. Period.",
                                benefit: "Enterprise-grade security for solo founders.",
                                color: "#FF8559"
                            },
                            {
                                icon: <Rocket className="w-6 h-6" />,
                                title: "One-Click Execution",
                                pain: "Tired of complex CRM setups and API integrations?",
                                result: "Forward your emails or connect your inbox. It works in 3 minutes, not 3 weeks.",
                                benefit: "ROI from day one. No learning curve.",
                                color: "#FAE588"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-[32px] bg-[#2A3034] border border-[#353C40] hover:border-[#FF8559]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF8559]/5 hover:-translate-y-1">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                                    style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>

                                <div className="space-y-4">
                                    <div className="bg-[#1C2023] rounded-xl p-3 border-l-2 border-[#FF8559]/50">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">The Pain</p>
                                        <p className="text-sm text-slate-300 italic">“{feature.pain}”</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold text-[#FAE588] uppercase tracking-wider mb-1 text-left">The Result</p>
                                        <p className="text-sm text-slate-300 leading-relaxed text-left">
                                            {feature.result}
                                        </p>
                                    </div>

                                    <div className="pt-2 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                                            {feature.benefit}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center animate-slide-up-delay-2">
                        <Link
                            href="/signup?trial=true"
                            className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-orange/90 transition-all duration-300 shadow-xl shadow-brand-orange/10 hover:shadow-2xl hover:shadow-brand-orange/20 active:scale-[0.98] group"
                        >
                            Start your 3-day Free Trial
                            <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                        <p className="mt-6 text-slate-500 text-sm font-medium">
                            First 200 users get lifetime access for <span className="text-[#FAE588] font-bold">$19.99</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── What happens after 200 users? (Transparency section) ── */}
            <section className="py-16 bg-[#1C2023] text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 bg-[#FAE588]/10 text-[#FAE588] text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase border border-[#FAE588]/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Full Transparency — No Surprises
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Here&apos;s exactly what you&apos;re getting into
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                            We believe in radical transparency. Here&apos;s the plain-English breakdown of the offer, the limits, and your rights as a Founding Member.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: <Star className="w-5 h-5" />,
                                iconColor: "text-[#FAE588]",
                                bg: "bg-[#FAE588]/10 border-[#FAE588]/20",
                                title: "Right now",
                                items: [
                                    "$19.99 one-time, no billing ever again",
                                    "200 leads/month (soft cap — current lead always finishes)",
                                    "Full dashboard, AI drafts, follow-ups, tasks",
                                    "Locked in forever — even when pricing changes",
                                ],
                            },
                            {
                                icon: <Clock className="w-5 h-5" />,
                                iconColor: "text-[#FF8559]",
                                bg: "bg-[#FF8559]/10 border-[#FF8559]/20",
                                title: "At ~200 members",
                                items: [
                                    "The $19.99 offer closes permanently",
                                    "New users pay ~$24–29/month subscription",
                                    "You keep lifetime access — nothing changes for you",
                                    "Cap raised: 200 → 300 leads/month as a thank-you",
                                ],
                            },
                            {
                                icon: <Rocket className="w-5 h-5" />,
                                iconColor: "text-emerald-400",
                                bg: "bg-emerald-400/10 border-emerald-400/20",
                                title: "Long term",
                                items: [
                                    "Pro features (teams, CRM sync, Gmail OAuth) ship ~late 2026",
                                    "Founding Members get Pro at an exclusive discounted rate",
                                    "Existing product never gets worse — Pro is additive only",
                                    "You can always see your usage and reset date in-app",
                                ],
                            },
                        ].map((col, i) => (
                            <div key={i} className={`rounded-2xl border p-5 ${col.bg}`}>
                                <div className={`${col.iconColor} mb-3`}>{col.icon}</div>
                                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">{col.title}</h3>
                                <ul className="space-y-2.5">
                                    {col.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            <Map className="w-4 h-4" />
                            Read the full public roadmap →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Roadmap Teaser Section ── */}
            <section className="py-20 md:py-28 bg-[#2A3034]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 bg-[#FF8559]/10 text-[#FF8559] text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <Map className="w-3.5 h-3.5" />
                            Live Roadmap
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Built transparently, for people who mean business
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                            We ship in public. Every phase is tracked, every milestone is visible.
                            You always know what you&apos;re getting — and what&apos;s coming next.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {[
                            {
                                phase: "Phase 1",
                                label: "Foundation & Transparency",
                                status: "Active Now",
                                statusClass: "bg-brand-orange/10 text-brand-orange border border-brand-orange/20",
                                dotClass: "bg-brand-orange animate-pulse",
                                icon: <Shield className="w-5 h-5" />,
                                iconBg: "bg-brand-orange/10 text-brand-orange",
                                highlights: ["Core AI email pipeline (shipped ✓)", "3-Tone AI drafts (shipped ✓)", "Live usage meter & warnings"],
                            },
                            {
                                phase: "Phase 2",
                                label: "Stickiness & Daily Value",
                                status: "Mar–Apr 2026",
                                statusClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                dotClass: "bg-emerald-500/40",
                                icon: <Layers className="w-5 h-5" />,
                                iconBg: "bg-emerald-500/10 text-emerald-400",
                                highlights: ["Lead stages & pipeline view", "Thread summarization (Catch me up)", "Booking link auto-detection"],
                            },
                            {
                                phase: "Phase 3",
                                label: "General Availability",
                                status: "~Mid 2026",
                                statusClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                                dotClass: "bg-blue-400/40",
                                icon: <Rocket className="w-5 h-5" />,
                                iconBg: "bg-blue-500/10 text-blue-400",
                                highlights: ["Monthly subscription for new users", "Founding Members: locked in forever", "Cap raised to 300 leads/month"],
                            },
                            {
                                phase: "Phase 4",
                                label: "Pro Tier Features",
                                status: "~Late 2026",
                                statusClass: "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20",
                                dotClass: "bg-brand-yellow/40",
                                icon: <Star className="w-5 h-5" />,
                                iconBg: "bg-brand-yellow/10 text-brand-yellow",
                                highlights: ["Team inbox & shared leads", "Calendar + CRM integrations", "Founders get Pro at exclusive rate"],
                            },
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-sm hover:shadow-xl hover:border-brand-orange/30 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.phase}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${item.statusClass}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full inline-block ${item.dotClass}`} />
                                                {item.status}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white">{item.label}</h3>
                                    </div>
                                </div>
                                <ul className="space-y-1.5">
                                    {item.highlights.map((h, j) => (
                                        <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            href="/roadmap"
                            className="inline-flex items-center gap-2 text-[#FF8559] font-semibold text-sm hover:text-[#FF8559] transition-colors border border-[#FF8559]/20 hover:border-blue-400 px-6 py-3 rounded-xl hover:bg-[#FF8559]/10"
                        >
                            <Map className="w-4 h-4" />
                            View the full roadmap &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FAQ Section ── */}
            <section id="faq" className="py-24 md:py-32 bg-[#1C2023]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <p className="text-[#FF8559] font-semibold tracking-widest uppercase text-sm mb-3">Support</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
                            <HelpCircle className="text-[#FF8559]" /> Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {[
                            { q: "Is it secure?", a: "Yes, we use enterprise-grade encryption and never store your raw password." },
                            { q: "Do you support all email providers?", a: "We work with any modern inbox that supports standard web access." },
                            { q: "Does the AI sound robotic?", a: "Not at all. Because you provide your own 'gold standard' examples, the AI learns your specific vocabulary and tone." },
                        ].map((faq, i) => (
                            <div key={i} className="faq-card p-6 border border-[#353C40] rounded-2xl bg-[#2A3034] transition-all duration-300 hover:border-[#FF8559]/20 hover:shadow-lg">
                                <h4 className="font-bold text-white mb-2 text-lg">{faq.q}</h4>
                                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="cta-section py-24 md:py-32 text-white">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Don&apos;t wait until the seats are gone.
                    </h2>
                    <p className="text-blue-100 mb-12 text-lg max-w-xl mx-auto leading-relaxed">
                        Once all 200 founding member seats are taken, this price closes permanently and new users pay monthly. Lock in your access now.
                    </p>

                    <div className="max-w-md mx-auto bg-[#2A3034] rounded-[32px] p-8 md:p-12 mb-12 text-white shadow-3xl text-left border-8 border-[#FF8559]/20">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Founder&rsquo;s Lifetime Plan</h3>
                                <p className="text-[#FAE588] font-bold text-sm">First 200 users only</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-[#FF8559]">$19.99</div>
                                <div className="text-xs text-slate-400 font-medium line-through">Reg $99/lifetime</div>
                            </div>
                        </div>

                        {/* Live counter in CTA too */}
                        <div className="my-5">
                            <FoundingMemberCounter />
                        </div>

                        <ul className="space-y-3 mb-6">
                            {[
                                "200–300 leads per month",
                                "AI Tone-matching engine",
                                "Custom Inbox Dashboard",
                                "Automated Follow-up Tasks",
                                "Real-time Notifications",
                                "Daily usage monitoring",
                                "Price locked forever — even when we go to $24–29/mo",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#FAE588]">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/signup?trial=true"
                            id="footer-cta-button"
                            className="block w-full text-center bg-brand-orange text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-orange/90 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98]"
                        >
                            Start my 3-day Free Trial →
                        </Link>
                        <p className="text-center text-xs text-slate-400 mt-4 font-medium italic">
                            No monthly fees. No recurring billing. One payment, forever.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
