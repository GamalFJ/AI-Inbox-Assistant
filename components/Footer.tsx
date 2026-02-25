import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            AI Inbox Assistant
                        </Link>
                        <p className="mt-2 text-gray-500 text-sm">
                            Your AI-powered inbox companion.
                        </p>
                    </div>

                    <div className="flex gap-8 text-sm text-gray-600">
                        <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
                        <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
                        <Link href="/#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
                    </div>

                    <div className="text-sm text-gray-400 text-center md:text-right">
                        <p>© {new Date().getFullYear()} AI Inbox Assistant. All rights reserved.</p>
                        <p className="mt-1">A Product by <span className="text-gray-500 font-medium">Purple Cove Labs</span></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
