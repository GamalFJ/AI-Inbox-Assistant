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

export interface Draft {
    id: string;
    created_at: string;
    lead_id: string;
    user_id: string;
    body: string;
    status: string;
    suggested_subject: string;
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
