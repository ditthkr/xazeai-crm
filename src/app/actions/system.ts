"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

export interface Partner {
    id: string;
    name: string;
    slug: string;
    contact_email: string;
    wallet_balance: string;
    credit_limit: string;
    created_at: string;
    updated_at: string;
}


export async function getPartners(): Promise<Partner[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch partners:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || json || [];
    } catch (error) {
        console.error("Error fetching partners:", error);
        return [];
    }
}

export interface CreatePartnerResponse {
    admin_user?: {
        email: string;
        password?: string;
    };
    partner?: Partner;
    error?: string;
}


export async function createPartner(prevState: any, formData: FormData): Promise<CreatePartnerResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const initial_balance = formData.get("initial_balance") as string;
    const credit_limit = formData.get("credit_limit") as string;

    if (!name || !slug) {
        return { error: "Name and slug are required" };
    }

    try {
        const payload: any = { name, slug };
        if (initial_balance) payload.initial_balance = initial_balance;
        if (credit_limit) payload.credit_limit = credit_limit;

        const response = await fetch(`${API_BASE_URL}/system/partners`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to create partner" };
        }

        return json.data || json;
    } catch (error) {
        console.error("Error creating partner:", error);
        return { error: "An unexpected error occurred" };
    }
}

export interface Transaction {
    id: string;
    wallet_id: string;
    owner_type: string;
    type: string;
    amount: string;
    balance_after: string;
    reference_id: string;
    reference_type: string;
    created_at: string;
}

export async function getTransactions(
    limit: number = 1000,
    offset: number = 0,
    wallet_id?: string
): Promise<Transaction[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (wallet_id) {
            queryParams.append("wallet_id", wallet_id);
        }

        const response = await fetch(
            `${API_BASE_URL}/system/transactions?${queryParams.toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to fetch transactions:",
                response.status,
                response.statusText
            );
            return [];
        }

        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

export interface SystemOverview {
    total_partners: number;
    total_tenants: number;
    total_users: number;
    total_credits: string;
}

export async function getSystemOverview(): Promise<SystemOverview | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/system/stats/overview`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch system overview:", response.status, response.statusText);
            return null;
        }

        const json = await response.json();
        return json.data || json;
    } catch (error) {
        console.error("Error fetching system overview:", error);
        return null;
    }
}

export interface SystemUsage {
    total_tokens: number;
    tokens_by_model: Record<string, number>;
    cost_by_model: Record<string, string>;
    revenue_by_model: Record<string, string>;
    active_tenants_24h: number;
}

export async function getSystemUsage(): Promise<SystemUsage | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/system/stats/usage`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch system usage:", response.status, response.statusText);
            return null;
        }

        const json = await response.json();
        return json.data || json;
    } catch (error) {
        console.error("Error fetching system usage:", error);
        return null;
    }
}

export interface SystemModel {
    id: string;
    name: string;
    base_cost: string;
    enabled: boolean;
    type: string;
    provider: string;
    updated_at: string;
}

export async function getModels(): Promise<SystemModel[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/system/config/models`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch models:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || json || [];
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

export interface ActionState {
    error?: string;
    success?: boolean;
    [key: string]: any; // Allow other properties like model or provider
}

export async function updateModel(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const base_cost = parseFloat(formData.get("base_cost") as string);
    const enabled = formData.get("enabled") === "on";

    try {
        const response = await fetch(`${API_BASE_URL}/system/config/models`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, base_cost, enabled }),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: "Failed to update model" };
        }

        return { success: true, model: json.data, timestamp: Date.now() };
    } catch (error) {
        console.error("Error updating model:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}

export interface SystemProvider {
    id: string; // Added id as it's in the response
    name: string;
    model_count: number;
    enabled_model_count: number; // Renamed from enabled_count
    enabled: boolean;
}

export async function getProviders(): Promise<SystemProvider[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/system/config/providers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch providers:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || json || [];
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    }
}


export async function updateProvider(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const api_key = formData.get("api_key") as string;
    const enabled = formData.get("enabled") === "on";
    const priorityRaw = formData.get("priority") as string;

    try {
        const payload: any = { name, enabled };

        // Only include api_key if it's provided (non-empty)
        if (api_key && api_key.trim() !== "") {
            payload.api_key = api_key;
        }

        // Only include priority if it's a valid number
        if (priorityRaw && priorityRaw.trim() !== "") {
            const priority = parseInt(priorityRaw);
            if (!isNaN(priority)) {
                payload.priority = priority;
            }
        }

        const response = await fetch(`${API_BASE_URL}/system/config/providers`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to update provider" };
        }

        return { success: true, provider: json.data, timestamp: Date.now() };
    } catch (error) {
        console.error("Error updating provider:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}

export async function topupPartner(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const partnerId = formData.get("partnerId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!partnerId) return { error: "Partner ID is required" };
    if (isNaN(amount) || amount <= 0) return { error: "Invalid amount" };

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners/${partnerId}/topup`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to top-up partner";
            try {
                const json = await response.json();
                errorMessage = json.error || errorMessage;
            } catch (e) {
                // Ignore JSON parse error on failure response
            }
            return { error: errorMessage, timestamp: Date.now() };
        }

        return { success: true, timestamp: Date.now() };
    } catch (error) {
        console.error("Error topping up partner:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}

export async function updatePartnerCreditLimit(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const partnerId = formData.get("partnerId") as string;
    const credit_limit = parseFloat(formData.get("credit_limit") as string);

    if (!partnerId) return { error: "Partner ID is required" };
    if (isNaN(credit_limit) || credit_limit < 0) return { error: "Invalid credit limit" };

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners/${partnerId}/credit-limit`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ credit_limit }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update credit limit";
            try {
                const json = await response.json();
                errorMessage = json.error || errorMessage;
            } catch (e) {
                // Ignore JSON parse error on failure response
            }
            return { error: errorMessage, timestamp: Date.now() };
        }

        return { success: true, timestamp: Date.now() };
    } catch (error) {
        console.error("Error updating credit limit:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}

export interface PartnerKey {
    id: string;
    partner_id: string;
    prefix: string;
    name: string;
    scopes: string[];
    created_at: string;
}

export interface CreatePartnerKeyResponse {
    api_key?: string;
    details?: PartnerKey;
    error?: string;
}

export async function getPartnerKeys(partnerId: string): Promise<PartnerKey[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners/${partnerId}/keys`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch partner keys:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || json || [];
    } catch (error) {
        console.error("Error fetching partner keys:", error);
        return [];
    }
}

export async function createPartnerKey(prevState: any, formData: FormData): Promise<CreatePartnerKeyResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const partnerId = formData.get("partnerId") as string;
    const name = formData.get("name") as string;
    // Default scope to "admin" for now as per requirement
    const scopes = ["admin"];

    if (!partnerId || !name) {
        return { error: "Partner ID and Name are required" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners/${partnerId}/keys`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, scopes }),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to create partner key" };
        }

        return json.data || json;
    } catch (error) {
        console.error("Error creating partner key:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function revokePartnerKey(partnerId: string, keyId: string): Promise<{ success?: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    try {
        const response = await fetch(`${API_BASE_URL}/system/partners/${partnerId}/keys/${keyId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Failed to revoke partner key" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error revoking partner key:", error);
        return { error: "An unexpected error occurred" };
    }
}

export interface SystemPersona {
    id: string;
    tenant_id: string;
    default_tenant_markup_rate?: number;
    name: string;
    description: string;
    config: {
        tone?: string;
        emoji?: string;
        language?: string;
        self_reference?: string;
        user_reference?: string;
        gender?: string;
        greeting?: string;
        [key: string]: any;
    };
    is_default: boolean;
    created_at: string;
    updated_at: string;
    tenant_name: string;
    partner_name: string;
}

export async function getSystemPersonas(
    limit: number = 20,
    offset: number = 0,
    is_system?: boolean
): Promise<SystemPersona[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (is_system !== undefined) {
            queryParams.append("is_system", is_system.toString());
        }

        const response = await fetch(
            `${API_BASE_URL}/system/personas?${queryParams.toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to fetch system personas:",
                response.status,
                response.statusText
            );
            return [];
        }

        const json = await response.json();
        return json.data || json || [];
    } catch (error) {
        console.error("Error fetching system personas:", error);
        return [];
    }
}

export async function createSystemPersona(prevState: any, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const configRaw = formData.get("config") as string;

    if (!name || !description) {
        return { error: "Name and Description are required" };
    }

    try {
        let config = {};
        try {
            config = JSON.parse(configRaw);
        } catch (e) {
            return { error: "Invalid JSON config" };
        }

        const payload = {
            name,
            description,
            config,
        };

        const response = await fetch(`${API_BASE_URL}/system/personas`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to create persona" };
        }

        return { success: true, persona: json.data, timestamp: Date.now() };
    } catch (error) {
        console.error("Error creating system persona:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}

export async function updateSystemPersona(prevState: any, formData: FormData): Promise<ActionState> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const configRaw = formData.get("config") as string;

    if (!id || !name) {
        return { error: "ID and Name are required" };
    }

    try {
        let config = {};
        try {
            config = JSON.parse(configRaw);
        } catch (e) {
            return { error: "Invalid JSON config" };
        }

        const payload = {
            name,
            config,
        };

        const response = await fetch(`${API_BASE_URL}/system/personas/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to update persona" };
        }

        return { success: true, persona: json.data, timestamp: Date.now() };
    } catch (error) {
        console.error("Error updating system persona:", error);
        return { error: "An unexpected error occurred", timestamp: Date.now() };
    }
}


export interface SystemPersonaOptions {
    tones: string[];
    emojis: string[];
    languages: { code: string; name: string }[];
    genders: string[];
}

export async function getSystemPersonaOptions(): Promise<SystemPersonaOptions | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/system/personas/options`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store", // Ensure fresh data
        });

        if (!response.ok) {
            console.error(
                "Failed to fetch system persona options:",
                response.status,
                response.statusText
            );
            return null;
        }

        const json = await response.json();
        return json.data || null;
    } catch (error) {
        console.error("Error fetching system persona options:", error);
        return null;
    }
}
