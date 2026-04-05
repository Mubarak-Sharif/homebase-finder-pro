import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import RoleBadge from "@/components/RoleBadge";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Edit } from "lucide-react";

const Profile = () => {
  const { currentUser, isAuthenticated, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");

  if (!isAuthenticated || !currentUser) return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Login to View Profile</h2>
        <Link to="/login"><Button className="gold-gradient text-primary-foreground">Login</Button></Link>
      </div>
      <BottomNav />
    </div>
  );

  const handleSave = () => {
    updateUser(currentUser.id, { name, phone });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Profile</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-heading text-2xl font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <p className="font-heading text-xl font-semibold text-foreground">{currentUser.name}</p>
              <RoleBadge role={currentUser.role} />
            </div>
          </div>

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gold-gradient text-primary-foreground">Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{currentUser.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{currentUser.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="text-foreground capitalize">{currentUser.role.replace(/_/g, " ").toLowerCase()}</span></div>
              <Button variant="outline" onClick={() => setEditing(true)} className="w-full gap-2 mt-2"><Edit className="w-4 h-4" />Edit Profile</Button>
            </div>
          )}

          <Button variant="ghost" onClick={logout} className="w-full text-destructive hover:bg-destructive/10 gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
