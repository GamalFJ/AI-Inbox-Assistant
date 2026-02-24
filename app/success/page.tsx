import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re in! 🎉</h1>
                <p className="text-gray-600 mb-8">
                    Your lifetime access is activated. Follow these steps to start automating your inbox:
                </p>
                <div className="text-left space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <p className="text-sm text-slate-600 font-medium">Create your account using the button below.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <p className="text-sm text-slate-600 font-medium">Complete the 2-minute onboarding to connect your business email.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <p className="text-sm text-slate-600 font-medium">Paste your &quot;gold standard&quot; replies to train your AI assistant.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <Link
                        href="/signup"
                        className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Create Your Account
                    </Link>
                    <Link
                        href="/login"
                        className="block w-full text-gray-600 py-3 font-medium hover:text-gray-900 transition"
                    >
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
