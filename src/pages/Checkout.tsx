import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useCart } from "@/contexts/CartContext";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, MessageCircle, Loader2 } from "lucide-react";
import { generateOrderNumber } from "@/lib/supabase-api";
import { useToast } from "@/hooks/use-toast";

const areas = ["Gulshan-e-Iqbal", "DHA", "Clifton", "North Nazimabad", "Korangi", "Malir", "Saddar", "PECHS", "Gulistan-e-Jauhar", "Other"];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { products, settings } = useData();
  const { user, profile } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile?.phone || "");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState<"STANDARD" | "BULK">("STANDARD");
  const [notes, setNotes] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const items = cart.map(ci => {
    const product = products.find(p => p.id === ci.productId);
    return product ? { productId: ci.productId, quantity: ci.quantity, price: Number(product.price_per_sqft), name: product.name } : null;
  }).filter(Boolean) as { productId: string; quantity: number; price: number; name: string }[];

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const num = generateOrderNumber();
      await addOrder({
        order_number: num,
        customer_name: name,
        customer_phone: phone,
        customer_whatsapp: whatsapp,
        customer_address: `${address}, ${area}`,
        city: "Karachi",
        order_type: orderType,
        notes: notes || undefined,
        total_amount: total,
        user_id: user?.id,
        items: items.map(i => ({
          product_id: i.productId,
          product_name_snapshot: i.name,
          price_per_sqft_snapshot: i.price,
          quantity_sqft: i.quantity,
          line_total: i.price * i.quantity,
        })),
      });
      clearCart();
      setOrderNumber(num);
    } catch (err) {
      console.error("Checkout error:", err);
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (orderNumber) {
    const summary = `*BS Marble Karachi - Order*\nOrder: ${orderNumber}\n${items.map(i => `• ${i.name} (${i.quantity} sqft)`).join("\n")}\nTotal: Rs. ${total.toLocaleString()}`;
    const wa = settings?.whatsapp_number || "";
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <TopBar />
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-1">Your order <span className="text-primary font-semibold">{orderNumber}</span> has been placed successfully.</p>
          <p className="text-sm text-muted-foreground mb-6">We'll contact you shortly to confirm delivery details.</p>
          <div className="flex gap-3">
            {wa && (
              <a href={`https://wa.me/${wa}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener">
                <Button variant="outline" className="gap-2 border-green-500/30 text-green-400"><MessageCircle className="w-4 h-4" />Share via WhatsApp</Button>
              </a>
            )}
            <Button onClick={() => navigate("/orders")} className="gold-gradient text-primary-foreground">View Orders</Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-foreground">Delivery Details</h2>
            <div>
              <label className="text-sm text-muted-foreground">Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Phone *</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">WhatsApp *</label>
                <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Area *</label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>{areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Address *</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={2}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Order Type</label>
              <Select value={orderType} onValueChange={v => setOrderType(v as any)}>
                <SelectTrigger className="mt-1 bg-secondary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="BULK">Bulk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20 space-y-4">
            <h3 className="font-heading text-xl font-semibold text-foreground">Order Summary</h3>
            <div className="space-y-3">
              {items.map(i => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{i.name} ({i.quantity} sqft)</span>
                  <span className="text-foreground">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-primary">Rs. {total.toLocaleString()}</span>
            </div>
            <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold" disabled={!area || submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Placing Order...</> : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default Checkout;
