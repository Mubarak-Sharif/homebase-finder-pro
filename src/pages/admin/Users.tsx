import AdminSidebar from "@/components/AdminSidebar";
import RoleBadge from "@/components/RoleBadge";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

const roles: UserRole[] = ["customer", "manager", "admin"];

const AdminUsers = () => {
  const { user, isRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) { console.error("loadUsers error:", error); return; }
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === user?.id) return;
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Role updated" });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Users</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Role</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-3 text-foreground font-medium">
                      {u.full_name || "—"} {u.id === user?.id && <span className="text-xs text-primary">(you)</span>}
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{u.phone || "—"}</td>
                    <td className="p-3"><RoleBadge role={u.role} /></td>
                    <td className="p-3">
                      {u.id !== user?.id && (
                        <Select value={u.role} onValueChange={v => handleRoleChange(u.id, v as UserRole)}>
                          <SelectTrigger className="w-[120px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {roles.map(r => (
                              <SelectItem key={r} value={r} className="text-xs capitalize">{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
