import { UserRole } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, User, Crown } from "lucide-react";

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; className: string }> = {
  COMMISSIONER_PA_ADMIN: { label: "Commissioner PA", icon: Crown, className: "bg-primary/20 text-primary border-primary/30" },
  ADMIN: { label: "Admin", icon: ShieldCheck, className: "bg-primary/15 text-primary border-primary/25" },
  MANAGER: { label: "Manager", icon: Shield, className: "bg-secondary text-secondary-foreground border-border" },
  CUSTOMER: { label: "Customer", icon: User, className: "bg-secondary text-secondary-foreground border-border" },
};

const RoleBadge = ({ role }: { role: UserRole }) => {
  const config = roleConfig[role];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default RoleBadge;
