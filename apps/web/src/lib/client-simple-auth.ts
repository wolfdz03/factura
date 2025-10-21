"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session } from "./simple-auth";

export function useSimpleAuth() {
  const router = useRouter();
  const [session, setSession] = useState<Session>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log("🔐 AUTH CHECK: Starting authentication check");
    try {
      console.log("🔐 AUTH CHECK: Fetching /api/auth/me");
      const response = await fetch("/api/auth/me");
      console.log("🔐 AUTH CHECK: Response status:", response.status);
      console.log("🔐 AUTH CHECK: Response ok:", response.ok);
      
      if (response.ok) {
        const user = await response.json();
        console.log("🔐 AUTH CHECK: User data received:", user);
        setSession({ user, isAuthenticated: true });
      } else {
        console.log("🔐 AUTH CHECK: Authentication failed, status:", response.status);
        setSession({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.log("🔐 AUTH CHECK: Error occurred:", error);
      setSession({ user: null, isAuthenticated: false });
    } finally {
      console.log("🔐 AUTH CHECK: Setting loading to false");
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSession({ user: data.user, isAuthenticated: true });
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: "An error occurred during login" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setSession({ user: null, isAuthenticated: false });
      // Use Next.js router for better integration
      router.replace("/login");
    } catch {
      console.error("Sign out failed");
      // Even if the API call fails, redirect to login
      setSession({ user: null, isAuthenticated: false });
      router.replace("/login");
    }
  };

  return {
    ...session,
    isLoading,
    signIn,
    signOut,
    refresh: checkAuth,
  };
}

// For backward compatibility
export const useSession = useSimpleAuth;
