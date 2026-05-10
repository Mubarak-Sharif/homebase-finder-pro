import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Users as UsersIcon } from "lucide-react";

interface Recipient {
  id: string;
  full_name: string | null;
  role: string;
}

const notificationSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(120, "Title too long"),
  message: z.string().trim().min(1, "Message required").max(1000, "Message too long"),
  type: z.enum(["info", "success", "warning", "error"]),
  link: z.string().trim().max(500).optional().or(z.literal("")),
});

const AdminNotifications = () => {
  const { profile, isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER" | "CUSTOMER">("ALL");
  const [sending, setSending] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "error">("info");
  const [link, setLink] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoadingRecipients(true);
      const [{ data: profs }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const roleMap: Record<string, string> = {};
      (roles || []).forEach((r: any) => { roleMap[r.user_id] = r.role; });
      const list: Recipient[] = (profs || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        role: roleMap[p.id] || "CUSTOMER",
      }));
      list.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
      setRecipients(list);
      setLoadingRecipients(false);
    };
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = recipients.filter(r => roleFilter === "ALL" || r.role === roleFilter);
  const allFilteredSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));

  const toggle = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAllFiltered = () => {
    setSelected(prev => {
      const n = new Set(prev);
      if (allFilteredSelected) filtered.forEach(r => n.delete(r.id));
      else filtered.forEach(r => n.add(r.id));
      return n;
    });
  };

  const handleSend = async () => {
    const parsed = notificationSchema.safeParse({ title, message, type, link });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    if (selected.size === 0) {
      toast({ title: "No recipients", description: "Select at least one user.", variant: "destructive" });
      return;
    }
    setSending(true);
    const rows = Array.from(selected).map(uid => ({
      user_id: uid,
      title: parsed.data.title,
      message: parsed.data.message,
      type: parsed.data.type,
      link: parsed.data.link || null,
    }));
    const { error } = await supabase.from("notifications").insert(rows);
    setSending(false);
    if (error) {
      toast({ title: "Send failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Notifications sent", description: `Delivered to ${rows.length} user(s).` });
    setTitle(""); setMessage(""); setLink(""); setType("info"); setSelected(new Set());
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <header className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-foreground">Send Notifications</h1>
          <p className="text-sm text-muted-foreground">Admin-only: deliver notifications to selected users.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Message</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} placeholder="Order shipped" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Your order is on its way." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="link">Link (optional)</Label>
                <Input id="link" value={link} onChange={e => setLink(e.target.value)} maxLength={500} placeholder="/orders" />
              </div>
            </div>
            <Button onClick={handleSend} disabled={sending} className="w-full">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send to {selected.size} user(s)
            </Button>
            <p className="text-xs text-muted-foreground">
              Sending as <span className="font-medium">{profile?.full_name || user?.email}</span> (ADMIN).
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <UsersIcon className="w-4 h-4" /> Recipients
              </h2>
              <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All roles</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="USER">Staff</SelectItem>
                  <SelectItem value="CUSTOMER">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAllFiltered} id="all" />
              <Label htmlFor="all" className="text-sm cursor-pointer">
                Select all ({filtered.length})
              </Label>
            </div>

            {loadingRecipients ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-1">
                {filtered.map(r => (
                  <label key={r.id} className="flex items-center gap-3 p-2 rounded hover:bg-secondary cursor-pointer">
                    <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.full_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </label>
                ))}
                {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No users.</p>}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;
