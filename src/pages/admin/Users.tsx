import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import RoleBadge from "@/components/RoleBadge";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/data/mockData";

const roles: UserRole[] = ["CUSTOMER", "MANAGER", "ADMIN", "COMMISSIONER_PA_ADMIN"];

const AdminUsers = () => {
  const { users, currentUser, updateUser, isRole } = useAuth();

  const canAssignCommissioner = isRole("COMMISSIONER_PA_ADMIN");

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (userId === currentUser?.id) return;
    if (newRole === "COMMISSIONER_PA_ADMIN" && !canAssignCommissioner) return;
    updateUser(userId, { role: newRole });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Users</h1>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Role</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="p-3 text-foreground font-medium">{u.name} {u.id === currentUser?.id && <span className="text-xs text-primary">(you)</span>}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{u.email}</td>
                  <td className="p-3"><RoleBadge role={u.role} /></td>
                  <td className="p-3">
                    <Badge variant="outline" className={u.status === "active" ? "text-green-400 border-green-500/30" : "text-red-400 border-red-500/30"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {u.id !== currentUser?.id && (
                      <div className="flex gap-2">
                        <Select value={u.role} onValueChange={v => handleRoleChange(u.id, v as UserRole)}>
                          <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {roles.filter(r => r !== "COMMISSIONER_PA_ADMIN" || canAssignCommissioner).map(r => (
                              <SelectItem key={r} value={r} className="text-xs">{r.replace(/_/g, " ")}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button onClick={() => updateUser(u.id, { status: u.status === "active" ? "inactive" : "active" })}
                          className={`text-xs px-2 py-1 rounded ${u.status === "active" ? "text-red-400 hover:bg-red-500/10" : "text-green-400 hover:bg-green-500/10"}`}>
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
