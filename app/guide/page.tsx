"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Settings,
    Webhook,
    Globe,
    LayoutDashboard,
    FileEdit,
    Send,
    CheckCircle2,
    TrendingUp,
    ArrowRight,
    Zap,
    Mail,
    ShieldCheck,
    ZapIcon,
    MousePointer2,
    Copy,
    ExternalLink,
    PlayCircle,
    CheckCircle
} from 'lucide-react';

const StepCard = ({ number, title, subtitle, icon: Icon, children, isLast = false }: any) => (
    <div className="relative mb-12 md:mb-0 md:pl-20 pb-12 md:pb-20 group">
        {!isLast && (
            <div className="hidden md:block absolute left-[2.85rem] top-10 bottom-0 w-1 bg-brand-card/30 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-orange via-brand-yellow to-transparent h-0 group-hover:h-full transition-all duration-1000 ease-out" />
            </div>
        )}

        {/* Step Icon - Desktop: Absolute, Mobile: Relative/Flex top */}
        <div className={`
            md:absolute md:left-0 md:top-0 
            w-16 h-16 rounded-[1.5rem] bg-brand-darker border-4 border-brand-card 
            flex items-center justify-center z-10 
            group-hover:scale-110 group-hover:border-brand-orange/50 transition-all duration-500 shadow-2xl
            mb-6 md:mb-0
        `}>
            <Icon className="w-7 h-7 text-brand-orange" />
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-orange rounded-full flex items-center justify-center text-brand-darker text-xs font-black shadow-lg">
                {number}
            </div>
        </div>

        <div className="bg-brand-dark/40 backdrop-blur-md border border-brand-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 hover:border-brand-orange/20 transition-all duration-500 relative overflow-hidden group/card shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover/card:bg-brand-orange/10 transition-colors" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8 text-left">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            {title}
                        </h3>
                        <p className="text-brand-yellow/80 font-bold uppercase tracking-widest text-xs">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        {children}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-brand-darker/50 rounded-3xl border border-brand-border p-6 shadow-inner">
                            <div className="flex items-center gap-2 mb-4 text-[#64748B] text-[10px] font-black tracking-widest uppercase">
                                <MousePointer2 className="w-3 h-3 text-brand-orange" />
                                Action Required
                            </div>
                            <div className="space-y-4">
                                <Link href="/settings" className="block p-4 bg-brand-dark rounded-2xl border border-brand-border group/action cursor-pointer hover:border-brand-orange/30 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                                            <span className="text-white text-sm font-bold">Go to Settings</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-brand-orange group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                                <div className="space-y-2">
                                    <p className="text-xs text-[#64748B] font-medium leading-relaxed italic">
                                        &quot;Follow the orange highlights in the app window.&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Instruction = ({ text, step }: { text: string; step: number }) => (
    <div className="flex gap-4 group/item items-start">
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-black text-[10px] md:text-xs group-hover/item:scale-110 transition-transform mt-1 md:mt-0">
            {step}
        </div>
        <p className="text-[#94A3B8] text-base md:text-lg font-medium leading-relaxed pt-0.5">
            {text}
        </p>
    </div>
);

export default function GuidePage() {
    return (
        <div className="bg-brand-darker min-h-screen pt-24 pb-20 selection:bg-brand-orange selection:text-white overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-orange/10 blur-[150px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-brand-yellow/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(#353C40_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.2]" />
            </div>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 mb-32 text-center relative z-10 mt-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black mb-10 tracking-[0.2em] uppercase">
                    <ZapIcon className="w-4 h-4 fill-current animate-pulse" />
                    Setup Masterclass
                </div>

                <h1 className="text-5xl md:text-9xl font-black mb-8 text-white tracking-tighter leading-[0.9] md:leading-[0.8] flex flex-col items-center">
                    <span className="opacity-50 text-2xl md:text-6xl mb-2 font-medium tracking-normal text-brand-yellow">HOW TO</span>
                    RECLAIM YOUR TIME
                </h1>

                <p className="text-[#64748B] text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mt-8">
                    Setting up your AI Assistant is easier than making a cup of coffee. Follow these 4 simple steps to start automating your inbox today.
                </p>

                <div className="mt-16 flex flex-wrap justify-center gap-6">
                    <div className="px-6 py-3 bg-brand-dark rounded-2xl border border-brand-card flex items-center gap-3 shadow-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-white font-bold text-sm">No Coding Required</span>
                    </div>
                    <div className="px-6 py-3 bg-brand-dark rounded-2xl border border-brand-card flex items-center gap-3 shadow-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-white font-bold text-sm">5-Minute Setup</span>
                    </div>
                    <div className="px-6 py-3 bg-brand-dark rounded-2xl border border-brand-card flex items-center gap-3 shadow-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-white font-bold text-sm">Works with Any Email</span>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Step 1: Brain Setup */}
                <StepCard
                    number="01"
                    title="Train the Brain"
                    subtitle="AI Personality Setup"
                    icon={User}
                >
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Think of the AI Profile as your digital twin. We need to teach it how you talk so it can write emails that sound exactly like you.
                    </p>
                    <div className="space-y-6">
                        <Instruction step={1} text="Go to Settings > AI Profile." />
                        <Instruction step={2} text="Enter your Business Type (e.g. Graphic Designer)." />
                        <Instruction step={3} text="Paste 3–5 examples of emails you've actually sent. We call these 'Gold Standards'." />
                        <Instruction step={4} text="Add your Calendly link so the AI can book meetings." />
                        <div className="pt-4">
                            <Link href="/settings" className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-brand-orange rounded-2xl text-white font-black hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,133,89,0.3)]">
                                Configure My Brain <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </StepCard>

                {/* Step 2: Connection */}
                <StepCard
                    number="02"
                    title="Connect Your Inbox"
                    subtitle="Lead Ingestion"
                    icon={Webhook}
                >
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        Now, let&apos;s route your emails into the app. This is the only technical part, but we&apos;ve made it simple.
                    </p>
                    <div className="space-y-6">
                        <Instruction step={1} text="Go to Settings > Lead Ingestion." />
                        <Instruction step={2} text="Copy your unique Secret Webhook URL." />
                        <Instruction step={3} text="Paste this link into your email tool (Zapier or Postmark)." />
                        <div className="p-4 md:p-6 bg-brand-dark/80 rounded-2xl md:rounded-3xl border border-brand-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group cursor-pointer hover:border-brand-yellow/30 transition-all">
                            <div className="flex flex-col w-full overflow-hidden">
                                <span className="text-[10px] font-black tracking-widest text-[#64748B] uppercase mb-1">Your Secret Link</span>
                                <code className="text-brand-yellow text-xs md:text-sm font-mono truncate w-full">https://api.assistant.com/v1/inbox-ingest...</code>
                            </div>
                            <div className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-yellow/10 border border-brand-yellow/20 px-4 py-3 md:py-2 rounded-xl text-brand-yellow text-[10px] md:text-xs font-black uppercase tracking-widest group-hover:bg-brand-yellow group-hover:text-brand-darker transition-all">
                                <Copy className="w-3 h-3" />
                                Copy
                            </div>
                        </div>
                    </div>
                </StepCard>

                {/* Step 3: Domain Authorization */}
                <StepCard
                    number="03"
                    title="Own Your Brand"
                    subtitle="Domain Verification"
                    icon={Globe}
                >
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        To send emails from your own professional address (like hello@yourbrand.com), we need to verify your domain.
                    </p>
                    <div className="space-y-6">
                        <Instruction step={1} text="Go to Settings > Your Domain." />
                        <Instruction step={2} text="Type in your website address." />
                        <Instruction step={3} text="Copy the 3 lines of text (DNS records) we give you." />
                        <Instruction step={4} text="Paste them into your domain account (GoDaddy, etc)." />
                        <div className="pt-4 flex flex-col md:flex-row gap-4">
                            <Link href="/settings" className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-white rounded-2xl text-brand-darker font-black hover:scale-105 transition-all text-center">
                                Verify My Domain <Globe className="w-5 h-5 opacity-40" />
                            </Link>
                            <a href="#" className="inline-flex items-center justify-center gap-2 text-brand-yellow font-bold hover:underline decoration-2 underline-offset-4 text-center">
                                Need help with DNS? <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </StepCard>

                {/* Step 4: Daily Workflow */}
                <StepCard
                    number="04"
                    title="Your New Morning"
                    subtitle="Daily Workflow"
                    icon={LayoutDashboard}
                    isLast={true}
                >
                    <p className="text-white/70 text-lg leading-relaxed mb-8">
                        The machine is running. Here is how you spend your first 60 seconds every morning.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-brand-dark rounded-3xl border border-brand-border border-l-brand-orange border-l-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                                    <FileEdit className="w-4 h-4" />
                                </div>
                                <h4 className="text-white font-bold text-lg">Pick a Tone</h4>
                            </div>
                            <p className="text-sm text-[#64748B] leading-relaxed">
                                Every email gets 3 versions: Formal, Friendly, or Short. Pick one, make quick tweaks, and hit send.
                            </p>
                        </div>
                        <div className="p-6 bg-brand-dark rounded-3xl border border-brand-border border-l-brand-yellow border-l-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                                    <Send className="w-4 h-4" />
                                </div>
                                <h4 className="text-white font-bold text-lg">Approve & Send</h4>
                            </div>
                            <p className="text-sm text-[#64748B] leading-relaxed">
                                One click sends the email. The AI handles the follow-ups and saves you about 4 hours of typing a day.
                            </p>
                        </div>
                    </div>
                </StepCard>

                {/* Final Launch Section */}
                <section className="mt-20 text-center pb-40">
                    <div className="relative inline-block w-full">
                        <div className="absolute -inset-10 bg-brand-orange/10 blur-[100px] rounded-full animate-pulse" />
                        <div className="relative bg-brand-dark/60 backdrop-blur-3xl border border-brand-card rounded-[4rem] p-16 md:p-24 shadow-2xl max-w-4xl mx-auto overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(#353C40_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.1]" />
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight md:leading-none">
                                    RECLAIM <br />
                                    <span className="text-brand-orange">YOUR LIFE.</span>
                                </h2>
                                <p className="text-[#64748B] text-xl mb-12 max-w-2xl mx-auto font-medium">
                                    Your personal AI army is waiting for your orders. Jump into your dashboard and see the magic for yourself.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                    <Link href="/dashboard" className="w-full md:w-auto px-12 py-6 bg-brand-orange rounded-full text-white font-black text-xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,133,89,0.4)] flex items-center justify-center gap-3">
                                        Launch My Dashboard <Zap className="w-6 h-6 fill-current" />
                                    </Link>
                                    <button className="flex items-center gap-3 text-brand-yellow font-black hover:translate-x-1 transition-transform group uppercase tracking-widest text-sm">
                                        <PlayCircle className="w-5 h-5" />
                                        Watch Video Demo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer Branding */}
            <div className="text-center opacity-40 mt-10 pb-10">
                <Image
                    src="/images/branding/logo-text.png"
                    alt="AI Inbox Assistant"
                    width={180}
                    height={36}
                    className="mx-auto brightness-0 invert"
                />
                <p className="text-brand-slate text-[10px] font-black uppercase tracking-[0.3em] mt-6">
                    Powered by Purple Cove Neural Architecture
                </p>
            </div>
        </div>
    );
}
