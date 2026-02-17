"use server";

import { API_BASE_URL } from "@/lib/api";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface PlaygroundPersona {
    id: string;
    name: string;
    description: string;
    is_system?: boolean;
    tenant_id?: string;
    config?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}

export interface PersonaOptions {
    tones: string[];
    emojis: string[];
    languages: { code: string; name: string }[];
    genders: string[];
}

export interface PlaygroundKnowledgeBase {
    id: string;
    name: string;
    description: string;
    persona_id: string;
    business_profile_id: string;
    created_at: string;
}

export interface PlaygroundKBEntry {
    id: string;
    title: string;
    content: string;
    source_url: string;
    metadata: any;
    created_at: string;
}

export interface BusinessProfile {
    id: string;
    name: string;
    description: string;
    type: string;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function apiHeaders(apiKey: string) {
    return {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
    };
}

// ─── Persona Actions ──────────────────────────────────────────────────────────

export async function getPlaygroundPersonas(apiKey: string): Promise<PlaygroundPersona[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/personas`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch personas", error);
        return [];
    }
}

export async function deletePlaygroundPersona(apiKey: string, id: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
            method: "DELETE",
            headers: { "X-API-Key": apiKey },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to delete persona" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete persona", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function getPlaygroundPersonaOptions(apiKey: string): Promise<PersonaOptions | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/personas/options`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || null;
    } catch (error) {
        console.error("Failed to fetch persona options", error);
        return null;
    }
}

export async function createPlaygroundPersona(
    apiKey: string,
    data: { name: string; description: string; config: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/personas`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to create persona" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create persona", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function updatePlaygroundPersona(
    apiKey: string,
    id: string,
    data: { name: string; description: string; config: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/personas/${id}`, {
            method: "PUT",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to update persona" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update persona", error);
        return { error: "An unexpected error occurred" };
    }
}

// ─── Knowledge Base Actions ───────────────────────────────────────────────────

export async function getPlaygroundKnowledgeBases(apiKey: string): Promise<PlaygroundKnowledgeBase[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch knowledge bases", error);
        return [];
    }
}

export async function deletePlaygroundKnowledgeBase(apiKey: string, id: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${id}`, {
            method: "DELETE",
            headers: { "X-API-Key": apiKey },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to delete knowledge base" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete knowledge base", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function createPlaygroundKnowledgeBase(
    apiKey: string,
    data: { name: string; description: string; persona_id: string; business_profile_id: string }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to create knowledge base" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create knowledge base", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function updatePlaygroundKnowledgeBase(
    apiKey: string,
    id: string,
    data: { name: string; description: string; persona_id: string; business_profile_id: string }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${id}`, {
            method: "PUT",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to update knowledge base" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update knowledge base", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function getPlaygroundBusinessProfiles(apiKey: string): Promise<BusinessProfile[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/business-profiles`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch business profiles", error);
        return [];
    }
}

export async function getPlaygroundBusinessProfile(apiKey: string, id: string): Promise<BusinessProfile | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/business-profiles/${id}`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || null;
    } catch (error) {
        console.error("Failed to fetch business profile", error);
        return null;
    }
}


export async function deletePlaygroundBusinessProfile(apiKey: string, id: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/business-profiles/${id}`, {
            method: "DELETE",
            headers: { "X-API-Key": apiKey },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to delete business profile" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete business profile", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function createPlaygroundBusinessProfile(
    apiKey: string,
    data: { name: string; description: string; type: string; config: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/business-profiles`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to create business profile" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create business profile", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function updatePlaygroundBusinessProfile(
    apiKey: string,
    id: string,
    data: { name: string; description: string; type: string; config: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/business-profiles/${id}`, {
            method: "PUT",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to update business profile" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update business profile", error);
        return { error: "An unexpected error occurred" };
    }
}

// ─── Knowledge Base Entry Actions ─────────────────────────────────────────────

export async function getPlaygroundKBEntries(apiKey: string, kbId: string): Promise<PlaygroundKBEntry[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${kbId}/entries`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch entries", error);
        return [];
    }
}

export async function deletePlaygroundKBEntry(apiKey: string, kbId: string, entryId: string): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${kbId}/entries/${entryId}`, {
            method: "DELETE",
            headers: { "X-API-Key": apiKey },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to delete entry" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete entry", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function createPlaygroundKBEntry(
    apiKey: string,
    kbId: string,
    data: { title: string; content: string; metadata: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${kbId}/entries/batch`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify([data]),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to create entry" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create entry", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function createPlaygroundKBEntryBatch(
    apiKey: string,
    kbId: string,
    data: { title: string; content: string; metadata: Record<string, any> }[]
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${kbId}/entries/batch`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to create entries" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to create entries", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function updatePlaygroundKBEntry(
    apiKey: string,
    kbId: string,
    entryId: string,
    data: { title: string; content: string; metadata: Record<string, any> }
): Promise<{ success?: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/knowledge/${kbId}/entries/${entryId}`, {
            method: "PUT",
            headers: apiHeaders(apiKey),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { error: errorData.error || "Failed to update entry" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update entry", error);
        return { error: "An unexpected error occurred" };
    }
}

// ─── Auth (Verify API Key) ────────────────────────────────────────────────────

export async function verifyPlaygroundApiKey(apiKey: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/credits`, {
            headers: { "X-API-Key": apiKey },
        });
        return res.ok;
    } catch (error) {
        console.error("Failed to verify API key", error);
        return false;
    }
}

// ─── Chat Actions ─────────────────────────────────────────────────────────────

export interface ChatSession {
    id: string;
    tenant_id: string;
    knowledge_base_id: string;
    created_at: string;
    updated_at: string;
}

export async function getChatSessions(apiKey: string): Promise<ChatSession[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store",
        });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch chat sessions", error);
        return [];
    }
}

export async function createChatSession(
    apiKey: string,
    knowledgeBaseId: string
): Promise<{ id?: string; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify({ knowledge_base_id: knowledgeBaseId }),
        });

        if (!res.ok) {
            return { error: "Failed to start session" };
        }

        const json = await res.json();
        return { id: json.data.id };
    } catch (error) {
        console.error("Failed to create chat session", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function sendChatMessage(
    apiKey: string,
    sessionId: string,
    content: string,
    language: string = "th",
    useHistory: boolean = true
): Promise<{ jobId?: string; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
            method: "POST",
            headers: apiHeaders(apiKey),
            body: JSON.stringify({ content, language, use_history: useHistory }),
        });

        if (!res.ok) {
            const errData = await res.json();
            return { error: errData.error || "Failed to send message" };
        }

        const json = await res.json();
        return { jobId: json.data.job_id };
    } catch (error) {
        console.error("Failed to send chat message", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function getChatJobStatus(
    apiKey: string,
    jobId: string
): Promise<{ status?: string; error?: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/jobs/${jobId}`, {
            headers: { "X-API-Key": apiKey },
        });
        const json = await res.json();
        return { status: json.data.status, error: json.data.error };
    } catch (error) {
        console.error("Failed to get job status", error);
        return { error: "Failed to check job status" };
    }
}

export async function getChatHistory(
    apiKey: string,
    sessionId: string
): Promise<{ role: string; content: string }[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/history`, {
            headers: { "X-API-Key": apiKey },
        });

        if (!res.ok) return [];

        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch chat history", error);
        return [];
    }
}
