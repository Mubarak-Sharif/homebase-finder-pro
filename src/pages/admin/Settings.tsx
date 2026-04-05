import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, updateSettings } = useData();
  const { toast } = useToast();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Settings saved", description: "Your settings have been updated." });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Settings</h1>

        <div className="bg-card border border-border rounded-lg p-6 max-w-lg space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Organization Name</label>
            <input value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })}
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">WhatsApp Number (with country code)</label>
            <input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" placeholder="923001234567" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">City / Service Area</label>
            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Delivery Info Text</label>
            <textarea value={form.deliveryInfo} onChange={e => setForm({ ...form, deliveryInfo: e.target.value })} rows={3}
              className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <Button onClick={handleSave} className="gold-gradient text-primary-foreground">Save Settings</Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
