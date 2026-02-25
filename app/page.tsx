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

            {/* Features Section */}
            <section id="features" className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-3">Features</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            What it does for you
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Reads your leads for you",
                                desc: "New inquiries are captured into a simple dashboard instead of drowning in your inbox.",
                                icon: <Inbox className="w-7 h-7 text-blue-500" />,
                                color: "blue",
                            },
                            {
                                title: "Drafts replies in your voice",
                                desc: "You paste 2–3 example replies once, and the assistant matches your tone automatically.",
                                icon: <Mic className="w-7 h-7 text-violet-500" />,
                                color: "violet",
                            },
                            {
                                title: "Keeps follow‑up under control",
                                desc: "It suggests when to follow up so you don\u2019t forget the \u2018I\u2019ll think about it\u2019 prospects.",
                                icon: <Clock className="w-7 h-7 text-emerald-500" />,
                                color: "emerald",
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="feature-card group p-8 rounded-2xl border border-gray-100 bg-white hover:border-transparent transition-all duration-300"
                            >
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 feature-icon-bg feature-icon-bg-${feature.color}`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 md:py-32 how-it-works-bg">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="text-blue-600 font-semibold tracking-widest uppercase text-sm mb-3">Simple Setup</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            How it works
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-0">
                        {[
                            {
                                step: "1",
                                title: "Pay once",
                                desc: "No subscriptions required to start. You get instant access to your setup link.",
                                icon: <CreditCard className="w-6 h-6" />,
                            },
                            {
                                step: "2",
                                title: "Plug in your examples",
                                desc: "Tell the assistant what you do and paste a few replies you\u2019ve already sent.",
                                icon: <Puzzle className="w-6 h-6" />,
                            },
                            {
                                step: "3",
                                title: "Approve and send",
                                desc: "New leads appear with AI‑drafted replies. You just approve, tweak, and send.",
                                icon: <CheckCircle className="w-6 h-6" />,
                            },
                        ].map((item, i) => (
                            <div key={i} className="step-card flex gap-6 items-start p-8">
                                <div className="step-number flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white">
                                    {item.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who this is NOT for */}
            <section id="not-for" className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <p className="text-red-500 font-semibold tracking-widest uppercase text-sm mb-3">Fair Warning</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Who this is <span className="text-red-500">NOT</span> for
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {[
                            "If you love writing every reply from scratch, skip this.",
                            "If you enjoy losing leads in your inbox, you don\u2019t need an AI assistant.",
                            "If you want a 6‑month \u2018AI transformation project\u2019, this will feel way too simple.",
                        ].map((text, i) => (
                            <div
                                key={i}
                                className="not-for-card flex items-start gap-4 p-6 rounded-2xl border border-red-100 bg-red-50/50 transition-all duration-300 hover:border-red-200"
                            >
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700 text-lg leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 md:py-32 bg-white">
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
                        One payment. Lifetime access. Start closing more deals from your inbox today.
                    </p>
                    <Link
                        href="/signup"
                        id="footer-cta-button"
                        className="inline-block bg-white text-blue-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        Buy&nbsp;&nbsp;–&nbsp;&nbsp;$19.99 (Lifetime Access)
                    </Link>
                </div>
            </section>
        </div>
    )
}
