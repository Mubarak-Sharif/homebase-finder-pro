import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Category, AppSettings, mockProducts, mockCategories, defaultSettings } from "@/data/mockData";

interface DataContextType {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getFeaturedProducts: () => Product[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const PRODUCTS_KEY = "bs_marble_products";
const CATEGORIES_KEY = "bs_marble_categories";
const SETTINGS_KEY = "bs_marble_settings";

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const s = localStorage.getItem(PRODUCTS_KEY);
    return s ? JSON.parse(s) : mockProducts;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const s = localStorage.getItem(CATEGORIES_KEY);
    return s ? JSON.parse(s) : mockCategories;
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const s = localStorage.getItem(SETTINGS_KEY);
    return s ? JSON.parse(s) : defaultSettings;
  });

  useEffect(() => { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
  const updateCategory = (id: string, updates: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const updateSettings = (updates: Partial<AppSettings>) => setSettings(prev => ({ ...prev, ...updates }));
  const getProductsByCategory = (categoryId: string) => products.filter(p => p.categoryId === categoryId);
  const getFeaturedProducts = () => products.filter(p => p.featured);

  return (
    <DataContext.Provider value={{ products, categories, settings, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, updateSettings, getProductsByCategory, getFeaturedProducts }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
