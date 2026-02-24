export type LeadStatus = "new" | "qualified" | "spam" | "done";

export interface Lead {
    id: string;
    created_at: string;
    user_id: string;
    email_from: string;
    subject: string;
    body: string;
    status: LeadStatus;
}

export interface Draft {
    id: string;
    created_at: string;
    lead_id: string;
    user_id: string;
    body: string;
    status: string;
    suggested_subject?: string; // We might need to add this to the DB if missing
}
