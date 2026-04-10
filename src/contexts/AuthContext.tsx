import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "ADMIN" | "USER" | "CUSTOMER";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  email?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  currentRole: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isRole: (...roles: UserRole[]) => boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileWithRole = async (userId: string): Promise<Profile | null> => {
    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (profileError || !profileData) {
      console.error("fetchProfile error:", profileError);
      return null;
    }

    // Fetch role from user_roles
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    const role = (roleData?.role as UserRole) || "CUSTOMER";

    return {
      ...profileData,
      role,
    } as Profile;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user) {
        setTimeout(async () => {
          const p = await fetchProfileWithRole(sess.user.id);
          if (p) {
            p.email = sess.user.email;
            setProfile(p);
          }
          setLoading(false);
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        fetchProfileWithRole(sess.user.id).then(p => {
          if (p) {
            p.email = sess.user.email;
            setProfile(p);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Login successful" };
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Account created successfully" };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isRole = (...roles: UserRole[]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { email, role, ...dbUpdates } = updates as any;
    const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", user.id);
    if (error) { console.error("updateProfile error:", error); throw error; }
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfileWithRole(user.id);
    if (p) {
      p.email = user.email;
      setProfile(p);
    }
  };

  const currentRole: UserRole = profile?.role || "CUSTOMER";

  return (
    <AuthContext.Provider value={{
      user, profile, session, isAuthenticated: !!user && !!profile, loading,
      currentRole,
      isAdmin: currentRole === "ADMIN",
      isUser: currentRole === "USER",
      isCustomer: currentRole === "CUSTOMER",
      login, register, logout, isRole, updateProfile, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
