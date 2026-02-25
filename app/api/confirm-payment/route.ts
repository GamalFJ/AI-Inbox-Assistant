import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/confirm-payment?user_id=<uid>
 *
 * Called by the /success page after PayPal redirects back.
 * Marks the user's profile as paid by setting has_paid = true.
 *
 * Security note: This sets has_paid only for the currently authenticated
 * session user (confirmed via supabase.auth.getUser()), so the user_id
 * query param is just a hint — it cannot be spoofed to pay for someone else.
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, has_paid: true }, { onConflict: 'id' })

    if (updateError) {
        console.error('[confirm-payment] Supabase error:', updateError)
        return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
    }

    // Redirect to /success after confirming — prevents token reuse loops
    return NextResponse.redirect(new URL('/success', request.url))
}
