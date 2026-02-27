import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-[#1C2023] border-t border-[#353C40] py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <Link href="/" className="text-xl font-black text-white hover:text-brand-orange transition-colors tracking-tighter">
                            AI INBOX ASSISTANT
                        </Link>
                        <p className="mt-2 text-slate-500 text-xs font-bold uppercase tracking-widest text-left">
                            Your AI-powered inbox companion.
                        </p>
                    </div>

                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Link href="/#features" className="hover:text-brand-orange transition-colors">Features</Link>
                        <Link href="/#how-it-works" className="hover:text-brand-orange transition-colors">How it Works</Link>
                        <Link href="/#faq" className="hover:text-brand-orange transition-colors">FAQ</Link>
                    </div>

                    <div className="text-[10px] font-bold text-slate-600 text-center md:text-right uppercase tracking-[0.1em]">
                        <p>© {new Date().getFullYear()} AI Inbox Assistant. All rights reserved.</p>
                        <p className="mt-1">A Product by <span className="text-brand-orange">Purple Cove Labs</span></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
