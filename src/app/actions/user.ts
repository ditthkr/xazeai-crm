"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

export interface User {
    id: string;
    email: string;
    role: string;
    name: string; // API doesn't return name yet, but we might want it
    avatar?: string;
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const json = await response.json();
        const data = json.data || json;

        if (!data || !data.id) {
            console.error("Invalid user data received:", data);
            return null;
        }

        // Map API response to User interface
        return {
            id: data.id,
            email: data.email,
            role: data.role,
            name: data.name || data.email?.split("@")[0] || "User", // Fallback name
            avatar: data.avatar,
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}
