import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { settings, updateSettings, loading } = useData();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    org_name: "",
    whatsapp_number: "",
    default_city: "",
    delivery_info: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        org_name: settings.org_name || "",
        whatsapp_number: settings.whatsapp_number || "",
        default_city: settings.default_city || "",
        delivery_info: settings.delivery_info || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast({ title: "Settings saved", description: "Your settings have been updated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Settings</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Organization Name</label>
              <input value={form.org_name} onChange={e => setForm({ ...form, org_name: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">WhatsApp Number (with country code)</label>
              <input value={form.whatsapp_number} onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" placeholder="923001234567" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">City / Service Area</label>
              <input value={form.default_city} onChange={e => setForm({ ...form, default_city: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Delivery Info Text</label>
              <textarea value={form.delivery_info} onChange={e => setForm({ ...form, delivery_info: e.target.value })} rows={3}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <Button onClick={handleSave} className="gold-gradient text-primary-foreground" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Settings
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSettings;
