import { UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, User, Crown } from "lucide-react";

const roleConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  admin: { label: "Admin", icon: ShieldCheck, className: "bg-primary/15 text-primary border-primary/25" },
  manager: { label: "Manager", icon: Shield, className: "bg-secondary text-secondary-foreground border-border" },
  customer: { label: "Customer", icon: User, className: "bg-secondary text-secondary-foreground border-border" },
};

const RoleBadge = ({ role }: { role: string }) => {
  const config = roleConfig[role] || roleConfig.customer;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default RoleBadge;
