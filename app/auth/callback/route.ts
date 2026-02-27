import { NextResponse } from 'next/server'
// The client you created in Step 2.1
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get('next') ?? '/onboarding'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            const isTrial = searchParams.get('trial') === 'true'

            if (isTrial) {
                // Set trial end date to 3 days from now
                const trialEndsAt = new Date()
                trialEndsAt.setDate(trialEndsAt.getDate() + 3)

                await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        is_trial: true,
                        trial_ends_at: trialEndsAt.toISOString(),
                        // Ensure we don't accidentally mark as paid
                        has_paid: false
                    }, { onConflict: 'id' })
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }


    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
