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
import { CheckCircle, MessageCircle } from "lucide-react";

const areas = ["Gulshan-e-Iqbal", "DHA", "Clifton", "North Nazimabad", "Korangi", "Malir", "Saddar", "PECHS", "Gulistan-e-Jauhar", "Other"];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { products, settings } = useData();
  const { currentUser } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || "");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState<"standard" | "bulk">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [notes, setNotes] = useState("");
  const [orderId, setOrderId] = useState("");

  const items = cart.map(ci => {
    const product = products.find(p => p.id === ci.productId);
    return product ? { productId: ci.productId, quantity: ci.quantity, pricePerSqft: product.price, name: product.name } : null;
  }).filter(Boolean) as { productId: string; quantity: number; pricePerSqft: number; name: string }[];

  const total = items.reduce((sum, i) => sum + i.pricePerSqft * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    addOrder({
      id, userId: currentUser?.id || "guest",
      items: items.map(({ productId, quantity, pricePerSqft }) => ({ productId, quantity, pricePerSqft })),
      total, status: "pending", customerName: name, phone, whatsapp, address: `${address}, ${area}`, area, orderType, paymentMethod, notes,
      createdAt: new Date().toISOString().split("T")[0],
    });
    clearCart();
    setOrderId(id);
  };

  if (orderId) {
    const summary = `*BS Marble Karachi - Order*\nOrder: ${orderId}\n${items.map(i => `• ${i.name} (${i.quantity} sqft)`).join("\n")}\nTotal: Rs. ${total.toLocaleString()}\nPayment: ${paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}`;
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <TopBar />
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-1">Your order <span className="text-primary font-semibold">{orderId}</span> has been placed successfully.</p>
          <p className="text-sm text-muted-foreground mb-6">We'll contact you shortly to confirm delivery details.</p>
          <div className="flex gap-3">
            <a href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener">
              <Button variant="outline" className="gap-2 border-green-500/30 text-green-400"><MessageCircle className="w-4 h-4" />Share via WhatsApp</Button>
            </a>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Order Type</label>
                <Select value={orderType} onValueChange={v => setOrderType(v as any)}>
                  <SelectTrigger className="mt-1 bg-secondary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="bulk">Bulk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Payment</label>
                <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as any)}>
                  <SelectTrigger className="mt-1 bg-secondary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20 space-y-4">
            <h3 className="font-heading text-xl font-semibold text-foreground">Order Summary</h3>
            <div className="space-y-3">
              {items.map(i => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{i.name} ({i.quantity} sqft)</span>
                  <span className="text-foreground">Rs. {(i.pricePerSqft * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-primary">Rs. {total.toLocaleString()}</span>
            </div>
            <Button type="submit" className="w-full gold-gradient text-primary-foreground font-semibold" disabled={!area}>
              Place Order
            </Button>
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default Checkout;
