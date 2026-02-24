import Link from "next/link"
import { CheckCircle, Zap, Shield, MessageSquare, PlayCircle, HelpCircle } from "lucide-react"

export default function Home() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                        The Smartest Way to <span className="text-blue-600">Manage Your Inbox</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                        AI Inbox Assistant helps you draft perfect replies, prioritize messages, and save hours every week. Powered by advanced AI.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/signup"
                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/success"
                            className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
                        >
                            Buy Now - $49 Lifetime Access (PayPal)
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Everything you need to master your inbox</h2>
                        <p className="mt-4 text-gray-600">Powerful features designed to make email effortless.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI Smart Replies",
                                desc: "Generate professional replies tailored to your business context in seconds.",
                                icon: <MessageSquare className="w-6 h-6 text-blue-500" />
                            },
                            {
                                title: "Fast Setup",
                                desc: "Connect your business details and start saving time immediately.",
                                icon: <Zap className="w-6 h-6 text-yellow-500" />
                            },
                            {
                                title: "Safe & Secure",
                                desc: "Your data is encrypted and handled with the highest security standards.",
                                icon: <Shield className="w-6 h-6 text-green-500" />
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 border border-gray-100 rounded-2xl bg-white hover:shadow-xl transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
                        <p className="mt-4 text-gray-600">Three simple steps to email zen.</p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {[
                            { step: "01", title: "Create your account", desc: "Sign up in seconds and connect your inbox." },
                            { step: "02", title: "Set your preferences", desc: "Tell us about your business and how you like to reply." },
                            { step: "03", title: "Automate your replies", desc: "Review and send AI-generated drafts with one click." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <HelpCircle className="text-blue-600" /> Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {[
                            { q: "Is it secure?", a: "Yes, we use enterprise-grade encryption and never store your raw password." },
                            { q: "Can I cancel anytime?", a: "Absolutely. No hidden fees or long-term contracts." },
                            { q: "Do you support all email providers?", a: "We work with any modern inbox that supports standard web access." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 border border-gray-100 rounded-xl">
                                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take back your time?</h2>
                    <p className="text-blue-100 mb-10 text-lg max-w-xl mx-auto">
                        Join 5,000+ businesses saving an average of 10 hours per week.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition shadow-lg"
                    >
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    )
}
