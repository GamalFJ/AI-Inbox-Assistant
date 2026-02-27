import Link from "next/link"
import { Inbox, CreditCard, Puzzle, CheckCircle, HelpCircle } from "lucide-react"

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
                                "200–300 leads per month",
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
