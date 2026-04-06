import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, X, EyeOff, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, loading } = useData();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image_url: "", sort_order: "0" });

  const resetForm = () => { setForm({ name: "", description: "", image_url: "", sort_order: "0" }); setEditingId(null); };

  const openEdit = (c: typeof categories[0]) => {
    setForm({ name: c.name, description: c.description || "", image_url: c.image_url || "", sort_order: String(c.sort_order) });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name: form.name, description: form.description || null, image_url: form.image_url || null, sort_order: Number(form.sort_order) };
      if (editingId) {
        await updateCategory(editingId, data);
        toast({ title: "Category updated" });
      } else {
        await addCategory({ ...data, is_active: true });
        toast({ title: "Category added" });
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save category.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: typeof categories[0]) => {
    try {
      await updateCategory(c.id, { is_active: !c.is_active });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">Categories</h1>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />Add Category</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...categories].sort((a, b) => a.sort_order - b.sort_order).map(cat => (
              <div key={cat.id} className={`bg-card border rounded-lg p-4 ${cat.is_active ? "border-border" : "border-border opacity-50"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Sort: {cat.sort_order} • {cat.is_active ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(cat)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground">
                      {cat.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} type="number" placeholder="Sort Order"
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                <Button type="submit" className="w-full gold-gradient text-primary-foreground" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? "Update" : "Add"} Category
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
