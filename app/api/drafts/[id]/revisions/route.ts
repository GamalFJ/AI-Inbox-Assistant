import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/drafts/[id]/revisions  — fetch all revisions for a draft
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: draftId } = await params;

    // Verify ownership
    const { data: draft, error: fetchErr } = await supabase
        .from("drafts")
        .select("id, leads!inner(user_id)")
        .eq("id", draftId)
        .single();

    if (fetchErr || !draft) {
        return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // @ts-expect-error — supabase join typing
    if (draft.leads.user_id !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: revisions, error } = await supabase
        .from("draft_revisions")
        .select("*")
        .eq("draft_id", draftId)
        .order("version_number", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(revisions ?? []);
}
