"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

export interface PartnerProfile {
    wallet_balance: string;
    credit_limit: string;
    default_tenant_markup_rate?: number;
    system_rates?: Record<string, string>;
    settings?: {
        description?: string;
        [key: string]: any;
    };
}

export async function getPartnerProfile(): Promise<PartnerProfile | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/partner/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch partner profile:", response.status, response.statusText);
            return null;
        }

        const json = await response.json();
        return json.data || json || null;
    } catch (error) {
        console.error("Error fetching partner profile:", error);
        return null;
    }
}

export async function updatePartnerProfile(
    data: { default_tenant_markup_rate?: number }
): Promise<{ success?: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    try {
        const payload: any = {};
        if (data.default_tenant_markup_rate !== undefined) {
            payload.default_tenant_markup_rate = data.default_tenant_markup_rate;
        }

        const response = await fetch(`${API_BASE_URL}/partner/profile`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update profile";
            try {
                const json = await response.json();
                errorMessage = json.error || errorMessage;
            } catch (e) {
                // Ignore JSON parse error
            }
            return { error: errorMessage };
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating partner profile:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function updatePartnerTenant(
    tenantId: string,
    data: { name?: string; slug?: string; markup_rate?: number | null; model_config_id?: string }
): Promise<{ success?: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    try {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.slug) payload.slug = data.slug;
        if (data.markup_rate !== undefined) payload.markup_rate = data.markup_rate;
        if (data.model_config_id) payload.model_config_id = data.model_config_id;

        const response = await fetch(`${API_BASE_URL}/partner/tenants/${tenantId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update tenant";
            try {
                const json = await response.json();
                errorMessage = json.error || errorMessage;
            } catch (e) {
                // Ignore JSON parse error
            }
            return { error: errorMessage };
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating partner tenant:", error);
        return { error: "An unexpected error occurred" };
    }
}


export interface PartnerTenantData {
    id: string;
    partner_id: string;
    name: string;
    slug: string;
    model_config_id: string;
    created_at: string;
    updated_at: string;
}

export interface PartnerTenantRate {
    final_rate: string;
    markup_rate: string | number | null;
    model_name: string;
    partner_cost: string;
}

export interface PartnerTenant {
    data: PartnerTenantData;
    rate: PartnerTenantRate;
    balance: string;
}

export async function getPartnerTenants(): Promise<PartnerTenant[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/partner/tenants`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch partner tenants:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        // The API returns { data: [...] } where each item has { data: ..., rate: ... } structure based on user description
        // Or does it return an array directly?
        // User example:
        // { "data": { ... }, "rate": { ... } }
        // The outer wrapper usually is { "data": [ ... ] } for lists.
        // So json.data is likely the array of objects the user described.
        return json.data || [];
    } catch (error) {
        console.error("Error fetching partner tenants:", error);
        return [];
    }
}

export interface CreatePartnerTenantResponse {
    tenant?: PartnerTenant;
    error?: string;
}

export async function createPartnerTenant(prevState: any, formData: FormData): Promise<CreatePartnerTenantResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const markup_rate = parseFloat(formData.get("markup_rate") as string);
    const model_config_id = formData.get("model_config_id") as string;
    const initial_balance = parseFloat(formData.get("initial_balance") as string);

    if (!name || !slug || !model_config_id) {
        return { error: "Name, Slug, and Model Config ID are required" };
    }

    try {
        const payload: any = { name, slug, model_config_id };
        if (!isNaN(markup_rate)) {
            payload.markup_rate = markup_rate;
        }
        if (!isNaN(initial_balance)) {
            payload.initial_balance = initial_balance;
        }

        const response = await fetch(`${API_BASE_URL}/partner/tenants`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to create tenant" };
        }

        return { tenant: json.data };
    } catch (error) {
        console.error("Error creating partner tenant:", error);
        return { error: "An unexpected error occurred" };
    }
}

export interface PartnerModel {
    id: string;
    name: string;
    rate: string;
}

export async function getPartnerModels(): Promise<PartnerModel[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/partner/models`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch partner models:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching partner models:", error);
        return [];
    }
}

export async function topupPartnerTenant(prevState: any, formData: FormData): Promise<{ success?: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const tenantId = formData.get("tenantId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!tenantId) return { error: "Tenant ID is required" };
    if (isNaN(amount) || amount <= 0) return { error: "Invalid amount" };

    try {
        const response = await fetch(`${API_BASE_URL}/partner/tenants/${tenantId}/topup`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to top-up tenant" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error topping up tenant:", error);
        return { error: "An unexpected error occurred" };
    }
}

export interface TenantKey {
    id: string;
    tenant_id: string;
    name: string;
    prefix: string;
    scopes: string[];
    created_at: string;
}

export interface CreateTenantKeyResponse {
    api_key?: string;
    details?: TenantKey;
    error?: string;
}

export async function getTenantKeys(tenantId: string): Promise<TenantKey[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/partner/tenants/${tenantId}/keys`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch tenant keys:", response.status, response.statusText);
            return [];
        }

        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching tenant keys:", error);
        return [];
    }
}

export async function createTenantKey(prevState: any, formData: FormData): Promise<CreateTenantKeyResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    const tenantId = formData.get("tenantId") as string;
    const name = formData.get("name") as string;
    // Default scopes as per user request example
    const scopes = ["chat:read", "chat:write"];

    if (!tenantId || !name) {
        return { error: "Tenant ID and Name are required" };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/partner/tenants/${tenantId}/keys`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, scopes }),
        });

        const json = await response.json();

        if (!response.ok) {
            return { error: json.error || "Failed to create tenant key" };
        }

        return json.data || json;
    } catch (error) {
        console.error("Error creating tenant key:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function revokeTenantKey(tenantId: string, keyId: string): Promise<{ success?: boolean; error?: string }> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { error: "Unauthorized" };

    try {
        const response = await fetch(`${API_BASE_URL}/partner/tenants/${tenantId}/keys/${keyId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Failed to revoke tenant key" };
        }

        return { success: true };
    } catch (error) {
        console.error("Error revoking tenant key:", error);
        return { error: "An unexpected error occurred" };
    }
}

export interface PartnerTransaction {
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

export async function getPartnerTransactions(
    limit: number = 1000,
    offset: number = 0,
    walletId?: string
): Promise<PartnerTransaction[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return [];

    try {
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (walletId) {
            queryParams.append("wallet", walletId);
        }

        const response = await fetch(
            `${API_BASE_URL}/partner/transactions?${queryParams.toString()}`,
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
                "Failed to fetch partner transactions:",
                response.status,
                response.statusText
            );
            return [];
        }

        const json = await response.json();
        return json.data || [];
    } catch (error) {
        console.error("Error fetching partner transactions:", error);
        return [];
    }
}
