import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductReviews from "@/components/ProductReviews";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/contexts/DataContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { productImageMap } from "@/assets/marbles";

const stockColors: Record<string, string> = { IN_STOCK: "text-green-400", LIMITED: "text-yellow-400", OUT_OF_STOCK: "text-red-400" };
const stockLabels: Record<string, string> = { IN_STOCK: "In Stock", LIMITED: "Limited Stock", OUT_OF_STOCK: "Out of Stock" };

const ProductDetail = () => {
  const { id } = useParams();
  const { products, categories, settings, loading } = useData();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(10);
  const [imgIdx, setImgIdx] = useState(0);

  const product = products.find(p => p.id === id);
  const whatsapp = settings?.whatsapp_number || "";

  if (loading) return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-square max-w-lg rounded-lg" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-heading text-2xl font-bold">Product Not Found</h1>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    </div>
  );

  const category = categories.find(c => c.id === product.category_id);
  const localImg = productImageMap[product.name];
  const allImages = [localImg, product.primary_image_url, ...(product.gallery_image_urls || [])].filter(Boolean) as string[];
  const images = allImages.length > 0 ? allImages : ["/placeholder.svg"];
  const similar = products.filter(p => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);
  const price = Number(product.price_per_sqft);
  const waMsg = `Hi! I'm interested in *${product.name}* - Rs.${price}/sqft. Please share more details.`;
  const thicknessArr = product.thickness_options || [];

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
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden border border-border">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${i === imgIdx ? "border-primary" : "border-border"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="text-xs">{category?.name}</Badge>
                <Badge variant="outline" className={`text-xs ${stockColors[product.stock_status] || ""}`}>{stockLabels[product.stock_status] || product.stock_status}</Badge>
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">Rs. {price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/sqft</span></p>
            </div>

            {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.origin && <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Origin:</span> <span className="text-foreground font-medium block">{product.origin}</span></div>}
              {product.color && <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Color:</span> <span className="text-foreground font-medium block">{product.color}</span></div>}
              {product.finish && <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Finish:</span> <span className="text-foreground font-medium block">{product.finish}</span></div>}
              {thicknessArr.length > 0 && <div className="bg-secondary rounded-lg p-3"><span className="text-muted-foreground">Thickness:</span> <span className="text-foreground font-medium block">{thicknessArr.join(", ")}</span></div>}
            </div>

            {product.usage && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Usage:</p>
                <Badge variant="secondary" className="text-xs">{product.usage}</Badge>
              </div>
            )}

            {product.stock_status !== "OUT_OF_STOCK" && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">Quantity (sqft):</label>
                  <input type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} min={1}
                    className="w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  <span className="text-sm text-muted-foreground">= Rs. {(qty * price).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddToCart} className="flex-1 gold-gradient text-primary-foreground gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                  <Button onClick={() => { handleAddToCart(); navigate("/cart"); }} variant="outline" className="flex-1 border-primary/30 text-foreground">
                    Buy Now
                  </Button>
                </div>
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener">
                    <Button variant="outline" className="w-full gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10 mt-1">
                      <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {similar.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProductDetail;
