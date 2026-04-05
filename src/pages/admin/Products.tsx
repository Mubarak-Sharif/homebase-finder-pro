import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Product } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", categoryId: "", price: "", origin: "", color: "", finish: "", thickness: "", usage: "", images: "", description: "", stockStatus: "in_stock" as Product["stockStatus"], featured: false });

  const resetForm = () => { setForm({ name: "", categoryId: "", price: "", origin: "", color: "", finish: "", thickness: "", usage: "", images: "", description: "", stockStatus: "in_stock", featured: false }); setEditingId(null); };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, categoryId: p.categoryId, price: String(p.price), origin: p.origin, color: p.color, finish: p.finish, thickness: p.thickness.join(", "), usage: p.usage.join(", "), images: p.images.join(", "), description: p.description, stockStatus: p.stockStatus, featured: p.featured });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, categoryId: form.categoryId, price: Number(form.price), origin: form.origin, color: form.color, finish: form.finish,
      thickness: form.thickness.split(",").map(s => s.trim()).filter(Boolean),
      usage: form.usage.split(",").map(s => s.trim()).filter(Boolean),
      images: form.images.split(",").map(s => s.trim()).filter(Boolean),
      description: form.description, stockStatus: form.stockStatus, featured: form.featured,
    };
    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct({ id: `p${Date.now()}`, ...data });
    }
    setShowModal(false);
    resetForm();
  };

  const stockColors = { in_stock: "text-green-400", limited: "text-yellow-400", out_of_stock: "text-red-400" };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">Products</h1>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />Add Product</Button>
        </div>

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
                const cat = categories.find(c => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          {p.featured && <Badge className="gold-gradient text-primary-foreground text-[9px] border-0">Featured</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{cat?.name}</td>
                    <td className="p-3 text-foreground">Rs. {p.price.toLocaleString()}</td>
                    <td className={`p-3 hidden md:table-cell ${stockColors[p.stockStatus]}`}>{p.stockStatus.replace("_", " ")}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
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
                  <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v })}>
                    <SelectTrigger className="bg-secondary"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required type="number" placeholder="Price/sqft"
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
                <input value={form.thickness} onChange={e => setForm({ ...form, thickness: e.target.value })} placeholder="Thickness (comma separated: 15mm, 18mm)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.usage} onChange={e => setForm({ ...form, usage: e.target.value })} placeholder="Usage (comma separated: Flooring, Kitchen)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} placeholder="Image URLs (comma separated)"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                <div className="flex gap-3">
                  <Select value={form.stockStatus} onValueChange={v => setForm({ ...form, stockStatus: v as any })}>
                    <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    Featured
                  </label>
                </div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground">{editingId ? "Update" : "Add"} Product</Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
