import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DbCategory, DbProduct, DbAppSettings,
  getCategories as fetchCategories,
  getProducts as fetchProducts,
  getAppSettings as fetchSettings,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  upsertAppSettings as apiUpsertSettings,
} from "@/lib/supabase-api";

interface DataContextType {
  products: DbProduct[];
  categories: DbCategory[];
  settings: DbAppSettings | null;
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<DbProduct, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<DbProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<DbCategory, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<DbCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<DbAppSettings>) => Promise<void>;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [settings, setSettings] = useState<DbAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, prods, sett] = await Promise.all([fetchCategories(), fetchProducts(), fetchSettings()]);
      setCategories(cats);
      setProducts(prods);
      setSettings(sett);
    } catch (err: any) {
      console.error("DataProvider load error:", err);
      setError("Unable to load data right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Real-time subscriptions for products
  useEffect(() => {
    const channel = supabase
      .channel("data-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => { loadAll(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { loadAll(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadAll]);

  const addProduct = async (product: Omit<DbProduct, "id" | "created_at" | "updated_at">) => {
    const created = await apiAddProduct(product);
    setProducts(prev => [created, ...prev]);
  };

  const updateProduct = async (id: string, updates: Partial<DbProduct>) => {
    const updated = await apiUpdateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deleteProduct = async (id: string) => {
    await apiDeleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (category: Omit<DbCategory, "id" | "created_at" | "updated_at">) => {
    const created = await apiAddCategory(category);
    setCategories(prev => [...prev, created]);
  };

  const updateCategory = async (id: string, updates: Partial<DbCategory>) => {
    const updated = await apiUpdateCategory(id, updates);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
  };

  const updateSettings = async (updates: Partial<DbAppSettings>) => {
    const merged = { ...updates, id: settings?.id } as Partial<DbAppSettings> & { id?: string };
    const updated = await apiUpsertSettings(merged);
    setSettings(updated);
  };

  return (
    <DataContext.Provider value={{ products, categories, settings, loading, error, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, updateSettings, refetch: loadAll }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
