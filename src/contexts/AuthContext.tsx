import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, mockUsers } from "@/data/mockData";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isRole: (...roles: UserRole[]) => boolean;
  users: User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "bs_marble_auth";
const USERS_KEY = "bs_marble_users";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_KEY);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password && u.status === "active");
    if (user) {
      setCurrentUser(user);
      return { success: true, message: "Login successful" };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const register = (name: string, email: string, phone: string, password: string) => {
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Email already registered" };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name, email, phone, password,
      role: "CUSTOMER",
      status: "active",
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: "Account created successfully" };
  };

  const logout = () => setCurrentUser(null);

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
    }
  };

  const isRole = (...roles: UserRole[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, register, logout, switchRole, isRole, users, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
