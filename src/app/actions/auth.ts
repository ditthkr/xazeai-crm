"use server";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/api";

interface LoginResponse {
    success: boolean;
    message?: string;
    role?: string;
}

export async function login(prevState: LoginResponse | null, formData: FormData): Promise<LoginResponse> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "Email and password are required." };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                return { success: false, message: errorData.error || "Login failed." };
            } catch (e) {
                return { success: false, message: "Login failed with status " + response.status };
            }
        }

        const json = await response.json();
        const data = json.data || json;

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: data.expires_at ? data.expires_at - Math.floor(Date.now() / 1000) : 60 * 60 * 24, // Use expires_at or default to 1 day
            path: "/",
            sameSite: "lax",
        });

        return { success: true, role: data.user.role };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
