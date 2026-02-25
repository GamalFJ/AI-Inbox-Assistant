import Link from "next/link"
import { Inbox, Mic, Clock, CreditCard, Puzzle, CheckCircle, XCircle, HelpCircle } from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="hero-section py-24 md:py-36">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium tracking-wide animate-fade-in">
                        AI-Powered Email Assistant
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight animate-slide-up">
                        Never Lose a Lead to{" "}
                        <span className="hero-gradient-text">Your Inbox</span> Again
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
                        A plug‑and‑play AI assistant that drafts your replies and follow‑ups so you
                        stop leaving money in unread emails. No calls, no &lsquo;AI strategy&rsquo;
                        fluff; just results.
                    </p>
                    <div className="mt-12 animate-slide-up-delay-2">
                        <Link
                            href="/signup"
                            id="hero-cta-button"
                            className="cta-button inline-block px-10 py-5 rounded-2xl font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            Buy&nbsp;&nbsp;–&nbsp;&nbsp;$19.99 (Lifetime Access)
                        </Link>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-24 md:py-32 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-3">See it in action</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                            From inbox chaos to <span className="text-blue-600">done</span> in seconds
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Watch how the assistant identifies a lead, drafts a professional reply in your tone, and schedules a follow-up—all without you lifting a finger.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-900 aspect-video relative group cursor-pointer animate-float">
                        {/* Video Placeholder Container */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300 mx-auto mb-4">
                                    <Clock className="w-10 h-10 ml-1 fill-white" />
                                </div>
                                <p className="text-slate-400 font-medium">Watch the 1-minute walkthrough</p>
                            </div>
                        </div>
                        {/* Mock UI Overlay Elements */}
                        <div className="absolute top-4 left-4 right-4 h-12 bg-white/10 rounded-xl backdrop-blur-md flex items-center px-4 gap-3 border border-white/10">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Testimonials */}
            <section id="testimonials" className="py-24 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-3">Trusted by Pros</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Saving 10+ hours every week
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                quote: "I used to ignore leads because I didn't have the mental energy to reply. This AI captures my tone so well it's scary.",
                                author: "Sarah Jenkins",
                                role: "Freelance Designer",
                                avatar: "SJ"
                            },
                            {
                                quote: "The follow-up scheduling is the real game-changer. I'm actually closing deals that used to just go cold.",
                                author: "Mark Thompson",
                                role: "Agency Owner",
                                avatar: "MT"
                            },
                            {
                                quote: "Setup took 5 minutes. I just pasted three emails I wrote last week and it was ready to go. No AI strategy needed.",
                                author: "Elena Rodriguez",
                                role: "Consultant",
                                avatar: "ER"
                            },
                        ].map((t, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300">
                                <p className="text-gray-700 italic mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t.author}</p>
                                        <p className="text-sm text-gray-500 font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 md:py-32 bg-slate-50">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-3">Support</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <HelpCircle className="text-blue-600" /> Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {[
                            { q: "Is it secure?", a: "Yes, we use enterprise-grade encryption and never store your raw password." },
                            { q: "Can I cancel anytime?", a: "Absolutely. No hidden fees or long-term contracts." },
                            { q: "Do you support all email providers?", a: "We work with any modern inbox that supports standard web access." },
                            { q: "Does the AI sound robotic?", a: "Not at all. Because you provide your own 'gold standard' examples, the AI learns your specific vocabulary and tone." },
                        ].map((faq, i) => (
                            <div key={i} className="faq-card p-6 border border-gray-100 rounded-2xl bg-white transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                <h4 className="font-bold text-gray-900 mb-2 text-lg">{faq.q}</h4>
                                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-24 md:py-32 text-white">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to stop losing leads?
                    </h2>
                    <p className="text-blue-100 mb-12 text-lg max-w-xl mx-auto leading-relaxed">
                        Join 200+ professionals reclaiming their time today.
                    </p>

                    <div className="max-w-md mx-auto bg-white rounded-[32px] p-8 md:p-12 mb-12 text-gray-900 shadow-3xl text-left border-8 border-blue-500/20">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Founder&rsquo;s Lifetime Plan</h3>
                                <p className="text-slate-500 font-medium text-sm italic">Limited availability</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-blue-600">$19.99</div>
                                <div className="text-xs text-slate-400 font-medium line-through">Reg $99</div>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {[
                                "Unlimited leads (Fair use)",
                                "AI Tone-matching engine",
                                "Custom Inbox Dashboard",
                                "Automated Follow-up Tasks",
                                "Real-time Notifications",
                                "Daily usage monitoring"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/signup"
                            id="footer-cta-button"
                            className="block w-full text-center bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98]"
                        >
                            Claim Instant Access
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
