import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that are ALWAYS public — no auth or payment check needed
const PUBLIC_PATHS = ['/', '/login', '/signup', '/success', '/auth']

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    )
}

// API routes that must stay open (webhooks, cron, auth callback)
const PUBLIC_API_PATHS = ['/api/webhook', '/api/cron', '/api/confirm-payment']

function isPublicApi(pathname: string): boolean {
    return PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
                    )
                },
            },
        }
    )

    // IMPORTANT: Do not add logic between createServerClient and getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // ── 1. Public paths — always allow ──────────────────────
    if (isPublicPath(pathname) || isPublicApi(pathname)) {
        return supabaseResponse
    }

    // ── 2. Not logged in → redirect to login ────────────────
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // ── 3. Logged in check trial/payment status ────────────────
    const { data: profile } = await supabase
        .from('profiles')
        .select('has_paid, trial_ends_at, is_trial')
        .eq('id', user.id)
        .single()

    // If they've paid, they're good
    if (profile?.has_paid) {
        return supabaseResponse
    }

    // If they are on trial and it hasn't expired yet, they're good
    if (profile?.is_trial && profile.trial_ends_at) {
        const trialEndsAt = new Date(profile.trial_ends_at)
        if (trialEndsAt > new Date()) {
            return supabaseResponse
        }
    }

    // Not paid AND (not on trial OR trial expired) → redirect to signup (payment step)
    const url = request.nextUrl.clone()
    url.pathname = '/signup'
    // Add a hint so the signup page can jump straight to Step 2
    url.searchParams.set('step', 'pay')
    // If trial expired, we could add another hint
    if (profile?.is_trial) {
        url.searchParams.set('trial', 'expired')
    }
    return NextResponse.redirect(url)
}

