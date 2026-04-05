import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug } from "lucide-react";

const roles: { value: UserRole; label: string }[] = [
  { value: "COMMISSIONER_PA_ADMIN", label: "Commissioner PA" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "CUSTOMER", label: "Customer" },
];

const RoleSwitcher = () => {
  const { currentUser, isAuthenticated, switchRole } = useAuth();
  if (!isAuthenticated || !currentUser) return null;

  return (
    <div className="flex items-center gap-1">
      <Bug className="w-3 h-3 text-muted-foreground" />
      <Select value={currentUser.role} onValueChange={(v) => switchRole(v as UserRole)}>
        <SelectTrigger className="h-7 w-[120px] text-xs border-dashed border-muted-foreground/30 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map(r => (
            <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSwitcher;
