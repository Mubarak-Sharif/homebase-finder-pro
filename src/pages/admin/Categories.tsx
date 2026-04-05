import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, X, EyeOff, Eye } from "lucide-react";
import { Category } from "@/data/mockData";

const AdminCategories = () => {
  const { categories, addCategory, updateCategory } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", sortOrder: "0" });

  const resetForm = () => { setForm({ name: "", description: "", image: "", sortOrder: "0" }); setEditingId(null); };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description, image: c.image, sortOrder: String(c.sortOrder) });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, description: form.description, image: form.image, sortOrder: Number(form.sortOrder) };
    if (editingId) updateCategory(editingId, data);
    else addCategory({ id: `c${Date.now()}`, ...data, active: true });
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">Categories</h1>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />Add Category</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
            <div key={cat.id} className={`bg-card border rounded-lg p-4 ${cat.active ? "border-border" : "border-border opacity-50"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Sort: {cat.sortOrder} • {cat.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => updateCategory(cat.id, { active: !cat.active })} className="p-1.5 rounded hover:bg-secondary text-muted-foreground">
                    {cat.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-foreground">{editingId ? "Edit" : "Add"} Category</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Category Name"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} type="number" placeholder="Sort Order"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <Button type="submit" className="w-full gold-gradient text-primary-foreground">{editingId ? "Update" : "Add"} Category</Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
