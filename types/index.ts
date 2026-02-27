export type LeadStatus = "new" | "qualified" | "spam" | "done";
export type LeadClassification = "new_lead" | "existing_client" | "spam" | "other";

export interface Lead {
    id: string;
    created_at: string;
    user_id: string;
    email_from: string;
    subject: string;
    body: string;
    status: LeadStatus;
    classification?: LeadClassification;
}

export type ToneVariant = "formal" | "casual" | "short";

export interface Draft {
    id: string;
    created_at: string;
    lead_id: string;
    user_id: string;
    body: string;
    status: string;
    suggested_subject: string;
    tone_variant?: ToneVariant;
}

export interface DraftRevision {
    id: string;
    created_at: string;
    draft_id: string;
    user_id: string;
    body: string;
    suggested_subject: string;
    edit_source: "ai_generated" | "user_edit" | "regenerated";
    version_number: number;
}

export interface Task {
    id: string;
    created_at: string;
    lead_id: string;
    user_id: string;
    title: string;
    due_at: string;
    status: "pending" | "completed";
}
