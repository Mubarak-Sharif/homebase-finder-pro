/**
 * Supabase API helper layer for BS Marble Karachi.
 * Centralizes all DB operations so UI components don't contain raw query logic.
 */

import { supabase } from "@/integrations/supabase/client";

// ============ TYPES (matching Supabase schema) ============

export interface DbCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_per_sqft: number;
  origin: string | null;
  color: string | null;
  finish: string | null;
  thickness_options: string[] | null;
  usage: string | null;
  stock_status: string;
  featured: boolean;
  primary_image_url: string | null;
  gallery_image_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_address: string;
  city: string;
  order_type: string;
  status: string;
  notes: string | null;
  total_amount: number;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  price_per_sqft_snapshot: number;
  quantity_sqft: number;
  line_total: number;
}

export interface DbAppSettings {
  id: string;
  org_name: string;
  default_city: string;
  whatsapp_number: string | null;
  delivery_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined
  profiles?: { full_name: string | null } | null;
}

// ============ CATEGORIES ============

export async function getCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) { console.error("getCategories error:", error); throw error; }
  return data ?? [];
}

export async function addCategory(cat: Omit<DbCategory, "id" | "created_at" | "updated_at">): Promise<DbCategory> {
  const { data, error } = await supabase.from("categories").insert(cat).select().single();
  if (error) { console.error("addCategory error:", error); throw error; }
  return data;
}

export async function updateCategory(id: string, updates: Partial<DbCategory>): Promise<DbCategory> {
  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
  if (error) { console.error("updateCategory error:", error); throw error; }
  return data;
}

// ============ PRODUCTS ============

export async function getProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getProducts error:", error); throw error; }
  return data ?? [];
}

export async function getProductById(id: string): Promise<DbProduct | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) { console.error("getProductById error:", error); throw error; }
  return data;
}

export async function addProduct(prod: Omit<DbProduct, "id" | "created_at" | "updated_at">): Promise<DbProduct> {
  const { data, error } = await supabase.from("products").insert(prod).select().single();
  if (error) { console.error("addProduct error:", error); throw error; }
  return data;
}

export async function updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) { console.error("updateProduct error:", error); throw error; }
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) { console.error("deleteProduct error:", error); throw error; }
}

// ============ ORDERS ============

export async function getOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getOrders error:", error); throw error; }
  return data ?? [];
}

export async function getOrderItems(orderId: string): Promise<DbOrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  if (error) { console.error("getOrderItems error:", error); throw error; }
  return data ?? [];
}

export async function getOrdersWithItems(): Promise<(DbOrder & { items: DbOrderItem[] })[]> {
  const orders = await getOrders();
  if (orders.length === 0) return [];
  const orderIds = orders.map(o => o.id);
  const { data: items, error } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);
  if (error) { console.error("getOrdersWithItems items error:", error); throw error; }
  return orders.map(o => ({ ...o, items: (items ?? []).filter(i => i.order_id === o.id) }));
}

export interface CreateOrderInput {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  customer_address: string;
  city?: string;
  order_type?: string;
  notes?: string;
  total_amount: number;
  user_id?: string;
  items: {
    product_id: string;
    product_name_snapshot: string;
    price_per_sqft_snapshot: number;
    quantity_sqft: number;
    line_total: number;
  }[];
}

export async function createOrderWithItems(input: CreateOrderInput): Promise<DbOrder> {
  const { items, ...orderData } = input;
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();
  if (orderError) { console.error("createOrder error:", orderError); throw orderError; }

  const orderItems = items.map(i => ({ ...i, order_id: order.id }));
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) { console.error("createOrderItems error:", itemsError); throw itemsError; }

  return order;
}

export async function updateOrderStatus(id: string, status: string): Promise<DbOrder> {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) { console.error("updateOrderStatus error:", error); throw error; }
  return data;
}

// ============ REVIEWS ============

export async function getReviewsByProduct(productId: string): Promise<DbReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getReviews error:", error); throw error; }
  return data ?? [];
}

export async function addReview(review: { product_id: string; user_id: string; rating: number; comment?: string }): Promise<DbReview> {
  const { data, error } = await supabase.from("reviews").insert(review).select("*, profiles(full_name)").single();
  if (error) { console.error("addReview error:", error); throw error; }
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) { console.error("deleteReview error:", error); throw error; }
}

// ============ APP SETTINGS ============

export async function getAppSettings(): Promise<DbAppSettings | null> {
  const { data, error } = await supabase.from("app_settings").select("*").limit(1).maybeSingle();
  if (error) { console.error("getAppSettings error:", error); throw error; }
  return data;
}

export async function upsertAppSettings(settings: Partial<DbAppSettings> & { id?: string }): Promise<DbAppSettings> {
  if (settings.id) {
    const { data, error } = await supabase.from("app_settings").update(settings).eq("id", settings.id).select().single();
    if (error) { console.error("updateAppSettings error:", error); throw error; }
    return data;
  }
  const { data, error } = await supabase.from("app_settings").insert(settings as any).select().single();
  if (error) { console.error("insertAppSettings error:", error); throw error; }
  return data;
}

// ============ HELPER: Generate Order Number ============
export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BSM-${date}-${rand}`;
}
