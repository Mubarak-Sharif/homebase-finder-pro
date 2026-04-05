import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/contexts/DataContext";
import { useCart } from "@/contexts/CartContext";
import { mockReviews } from "@/data/mockData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const stockColors = { in_stock: "text-green-400", limited: "text-yellow-400", out_of_stock: "text-red-400" };
const stockLabels = { in_stock: "In Stock", limited: "Limited Stock", out_of_stock: "Out of Stock" };

const ProductDetail = () => {
  const { id } = useParams();
  const { products, categories, settings } = useData();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(10);
  const [imgIdx, setImgIdx] = useState(0);

  const product = products.find(p => p.id === id);
  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-2xl font-bold">Product Not Found</h1>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    </div>
  );

  const category = categories.find(c => c.id === product.categoryId);
  const reviews = mockReviews.filter(r => r.productId === product.id);
  const similar = products.filter(p => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 4);
  const waMsg = `Hi! I'm interested in *${product.name}* (ID: ${product.id}) - Rs.${product.price}/sqft. Please share more details.`;

  const handleAddToCart = () => {
    addToCart(product.id, qty);
    toast({ title: "Added to Cart", description: `${product.name} (${qty} sqft) added.` });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-4">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden border border-border">
              <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${i === imgIdx ? "border-primary" : "border-border"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-xs">{category?.name}</Badge>
                <Badge variant="outline" className={`text-xs ${stockColors[product.stockStatus]}`}>{stockLabels[product.stockStatus]}</Badge>
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">Rs. {product.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/sqft</span></p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Origin:</span> <span className="text-foreground font-medium block">{product.origin}</span></div>
              <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Color:</span> <span className="text-foreground font-medium block">{product.color}</span></div>
              <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Finish:</span> <span className="text-foreground font-medium block">{product.finish}</span></div>
              <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Thickness:</span> <span className="text-foreground font-medium block">{product.thickness.join(", ")}</span></div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Usage:</p>
              <div className="flex flex-wrap gap-2">
                {product.usage.map(u => <Badge key={u} variant="secondary" className="text-xs">{u}</Badge>)}
              </div>
            </div>

            {/* Add to cart */}
            {product.stockStatus !== "out_of_stock" && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">Quantity (sqft):</label>
                  <input type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} min={1}
                    className="w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  <span className="text-sm text-muted-foreground">= Rs. {(qty * product.price).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddToCart} className="flex-1 gold-gradient text-primary-foreground gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                  <Button onClick={() => { handleAddToCart(); navigate("/cart"); }} variant="outline" className="flex-1 border-primary/30 text-foreground">
                    Buy Now
                  </Button>
                </div>
                <a href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener">
                  <Button variant="outline" className="w-full gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10 mt-1">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
                  </Button>
                </a>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Reviews</h3>
                <div className="space-y-3">
                  {reviews.map(r => (
                    <div key={r.id} className="bg-secondary rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{r.userName}</span>
                        <div className="flex">{Array.from({ length: r.rating }, (_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {similar.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProductDetail;
