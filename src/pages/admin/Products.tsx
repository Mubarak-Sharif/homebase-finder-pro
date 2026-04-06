import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, loading } = useData();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "", category_id: "", price_per_sqft: "", origin: "", color: "", finish: "",
    thickness_options: "", usage: "", primary_image_url: "", gallery_image_urls: "",
    description: "", stock_status: "IN_STOCK", featured: false
  });

  const resetForm = () => {
    setForm({ name: "", category_id: "", price_per_sqft: "", origin: "", color: "", finish: "", thickness_options: "", usage: "", primary_image_url: "", gallery_image_urls: "", description: "", stock_status: "IN_STOCK", featured: false });
    setEditingId(null);
  };

  const openEdit = (p: typeof products[0]) => {
    setForm({
      name: p.name, category_id: p.category_id || "", price_per_sqft: String(p.price_per_sqft),
      origin: p.origin || "", color: p.color || "", finish: p.finish || "",
      thickness_options: (p.thickness_options || []).join(", "), usage: p.usage || "",
      primary_image_url: p.primary_image_url || "",
      gallery_image_urls: (p.gallery_image_urls || []).join(", "),
      description: p.description || "", stock_status: p.stock_status, featured: p.featured
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: form.name,
        category_id: form.category_id || null,
        price_per_sqft: Number(form.price_per_sqft),
        origin: form.origin || null,
        color: form.color || null,
        finish: form.finish || null,
        thickness_options: form.thickness_options ? form.thickness_options.split(",").map(s => s.trim()).filter(Boolean) : null,
        usage: form.usage || null,
        primary_image_url: form.primary_image_url || null,
        gallery_image_urls: form.gallery_image_urls ? form.gallery_image_urls.split(",").map(s => s.trim()).filter(Boolean) : null,
        description: form.description || null,
        stock_status: form.stock_status,
        featured: form.featured,
      };
      if (editingId) {
        await updateProduct(editingId, data);
        toast({ title: "Product updated" });
      } else {
        await addProduct(data as any);
        toast({ title: "Product added" });
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save product.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Product deleted" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Cannot delete — product may be referenced by orders.", variant: "destructive" });
    }
  };

  const stockColors: Record<string, string> = { IN_STOCK: "text-green-400", LIMITED: "text-yellow-400", OUT_OF_STOCK: "text-red-400" };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">Products</h1>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />Add Product</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Product</th>
                  <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Price/sqft</th>
                  <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Stock</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const cat = categories.find(c => c.id === p.category_id);
                  const imgSrc = p.primary_image_url || "/placeholder.svg";
                  return (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={imgSrc} alt="" className="w-10 h-10 rounded object-cover" />
                          <div>
                            <p className="font-medium text-foreground">{p.name}</p>
                            {p.featured && <Badge className="gold-gradient text-primary-foreground text-[9px] border-0">Featured</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{cat?.name}</td>
                      <td className="p-3 text-foreground">Rs. {Number(p.price_per_sqft).toLocaleString()}</td>
                      <td className={`p-3 hidden md:table-cell ${stockColors[p.stock_status] || ""}`}>{p.stock_status.replace("_", " ")}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-foreground">{editingId ? "Edit" : "Add"} Product</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Product Name"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
                    <SelectTrigger className="bg-secondary"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <input value={form.price_per_sqft} onChange={e => setForm({ ...form, price_per_sqft: e.target.value })} required type="number" placeholder="Price/sqft"
                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} placeholder="Origin"
                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Color"
                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <input value={form.finish} onChange={e => setForm({ ...form, finish: e.target.value })} placeholder="Finish (e.g. Polished)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.thickness_options} onChange={e => setForm({ ...form, thickness_options: e.target.value })} placeholder="Thickness (comma separated: 15mm, 18mm)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.usage} onChange={e => setForm({ ...form, usage: e.target.value })} placeholder="Usage (e.g. Flooring)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.primary_image_url} onChange={e => setForm({ ...form, primary_image_url: e.target.value })} placeholder="Primary Image URL"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.gallery_image_urls} onChange={e => setForm({ ...form, gallery_image_urls: e.target.value })} placeholder="Gallery URLs (comma separated)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                <div className="flex gap-3">
                  <Select value={form.stock_status} onValueChange={v => setForm({ ...form, stock_status: v })}>
                    <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_STOCK">In Stock</SelectItem>
                      <SelectItem value="LIMITED">Limited</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    Featured
                  </label>
                </div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? "Update" : "Add"} Product
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
