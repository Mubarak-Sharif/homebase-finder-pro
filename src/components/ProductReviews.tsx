import { useState, useEffect } from "react";
import { Star, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getReviewsByProduct, addReview, deleteReview, DbReview } from "@/lib/supabase-api";
import { useToast } from "@/hooks/use-toast";

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await getReviewsByProduct(productId);
      setReviews(data);
    } catch (err) {
      console.error("loadReviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [productId]);

  const hasReviewed = reviews.some(r => r.user_id === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await addReview({ product_id: productId, user_id: user.id, rating, comment: comment || undefined });
      setComment("");
      setRating(5);
      await loadReviews();
      toast({ title: "Review added!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add review", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      await loadReviews();
      toast({ title: "Review deleted" });
    } catch (err) {
      console.error("deleteReview error:", err);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Reviews {reviews.length > 0 && <span className="text-muted-foreground text-sm font-normal">({reviews.length})</span>}
        </h3>
        {avgRating && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{avgRating}</span>
          </div>
        )}
      </div>

      {isAuthenticated && !hasReviewed && (
        <form onSubmit={handleSubmit} className="bg-secondary/50 border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Write a Review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`w-5 h-5 ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} placeholder="Share your experience..."
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          <Button type="submit" size="sm" className="gold-gradient text-primary-foreground" disabled={submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                    {(r.profiles?.full_name || "U")[0]}
                  </div>
                  <span className="text-sm font-medium text-foreground">{r.profiles?.full_name || "Anonymous"}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.user_id === user?.id && (
                    <button onClick={() => handleDelete(r.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
