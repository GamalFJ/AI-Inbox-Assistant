import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/drafts/[id]  — save edits + snapshot a revision
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: draftId } = await params;
    const { body, suggested_subject, edit_source = "user_edit" } = await req.json();

    // --- Verify ownership via the related lead ---
    const { data: existing, error: fetchErr } = await supabase
        .from("drafts")
        .select("id, lead_id, leads!inner(user_id)")
        .eq("id", draftId)
        .single();

    if (fetchErr || !existing) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // @ts-expect-error — supabase join typing
    if (existing.leads.user_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // --- Count existing revisions to determine the next version number ---
    const { count: revCount } = await supabase
        .from("draft_revisions")
        .select("id", { count: "exact", head: true })
        .eq("draft_id", draftId);

    const nextVersion = (revCount ?? 0) + 1;

    // --- Save revision snapshot ---
    const { error: revErr } = await supabase.from("draft_revisions").insert({
        draft_id: draftId,
        user_id: user.id,
        body,
        suggested_subject,
        edit_source,
        version_number: nextVersion,
    });

    if (revErr) {
        console.error("Failed to save revision:", revErr.message);
        // Non-fatal — still update the draft below
    }

    // --- Update the draft itself ---
    const { data: updated, error: updateErr } = await supabase
        .from("drafts")
        .update({ body, suggested_subject })
        .eq("id", draftId)
        .select()
        .single();

    if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ draft: updated, version: nextVersion });
}
