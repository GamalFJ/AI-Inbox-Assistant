import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center bg-brand-darker">
            <h1 className="text-8xl font-black text-brand-orange mb-4 drop-shadow-2xl">404</h1>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest">Page Not Found</h2>
            <p className="text-slate-500 mb-10 max-w-sm leading-relaxed">
                Sorry, the page you&apos;re looking for has vanished into thin air. Let&apos;s get you back on track.
            </p>
            <Link
                href="/"
                className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-orange/90 transition shadow-2xl shadow-brand-orange/20"
            >
                Return Home
            </Link>
        </div>
    )
}
