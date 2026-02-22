import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Received!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. You now have full access to AI Inbox Assistant.
                </p>
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
