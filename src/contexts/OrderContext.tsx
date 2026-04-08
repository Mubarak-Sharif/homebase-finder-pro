import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  DbOrder, DbOrderItem,
  getOrdersWithItems,
  createOrderWithItems,
  updateOrderStatus as apiUpdateStatus,
  deleteOrder as apiDeleteOrder,
  CreateOrderInput,
} from "@/lib/supabase-api";

export type OrderWithItems = DbOrder & { items: DbOrderItem[] };

interface OrderContextType {
  orders: OrderWithItems[];
  loading: boolean;
  error: string | null;
  addOrder: (input: CreateOrderInput) => Promise<DbOrder>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdersWithItems();
      setOrders(data);
    } catch (err: any) {
      console.error("OrderProvider load error:", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const addOrder = async (input: CreateOrderInput): Promise<DbOrder> => {
    const order = await createOrderWithItems(input);
    await loadOrders();
    return order;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const updated = await apiUpdateStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
  };

  const deleteOrder = async (orderId: string) => {
    await apiDeleteOrder(orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, loading, error, addOrder, updateOrderStatus, deleteOrder, refetch: loadOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
