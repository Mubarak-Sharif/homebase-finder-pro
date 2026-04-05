import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useCart } from "@/contexts/CartContext";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products, settings } = useData();
  const { isAuthenticated } = useAuth();

  const items = cart.map(ci => {
    const product = products.find(p => p.id === ci.productId);
    return product ? { ...ci, product } : null;
  }).filter(Boolean) as { productId: string; quantity: number; product: typeof products[0] }[];

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-muted-foreground mb-6">Browse our marble collection and add items</p>
        <Link to="/products"><Button className="gold-gradient text-primary-foreground">Browse Products</Button></Link>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.productId} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg font-semibold text-foreground truncate">{item.product.name}</h3>
                  <p className="text-sm text-primary">Rs. {item.product.price.toLocaleString()}/sqft</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 5)} className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-foreground">
                      <Minus className="w-3 h-3" />
                    </button>
                    <input type="number" value={item.quantity} onChange={e => updateQuantity(item.productId, Number(e.target.value))} min={1}
                      className="w-16 text-center px-2 py-1 rounded bg-secondary border border-border text-sm text-foreground outline-none" />
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 5)} className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-foreground">
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-muted-foreground">sqft</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold text-foreground">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.productId)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20 space-y-4">
            <h3 className="font-heading text-xl font-semibold text-foreground">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-xs text-primary">To be confirmed</span></div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Total</span><span className="text-primary">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{settings.deliveryInfo}</p>
            <div className="space-y-2">
              {isAuthenticated ? (
                <Link to="/checkout"><Button className="w-full gold-gradient text-primary-foreground">Proceed to Checkout</Button></Link>
              ) : (
                <Link to="/login" state={{ from: "/checkout", message: "Please login to checkout" }}>
                  <Button className="w-full gold-gradient text-primary-foreground">Login to Checkout</Button>
                </Link>
              )}
              <Link to="/products"><Button variant="outline" className="w-full border-border">Continue Shopping</Button></Link>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Cart;
