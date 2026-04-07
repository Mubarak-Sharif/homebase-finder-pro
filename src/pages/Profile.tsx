import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import RoleBadge from "@/components/RoleBadge";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Edit, Loader2 } from "lucide-react";

const Profile = () => {
  const { profile, user, isAuthenticated, logout, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!isAuthenticated || !profile) return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Login to View Profile</h2>
        <Link to="/login"><Button className="gold-gradient text-primary-foreground">Login</Button></Link>
      </div>
      <BottomNav />
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: name, phone });
      setEditing(false);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopBar />
      <div className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Profile</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-heading text-2xl font-bold">
              {(profile.full_name || "U")[0]}
            </div>
            <div>
              <p className="font-heading text-xl font-semibold text-foreground">{profile.full_name || "User"}</p>
              <RoleBadge role={profile.role} />
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
                <Button onClick={handleSave} className="gold-gradient text-primary-foreground" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{user?.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{profile.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="text-foreground capitalize">{profile.role}</span></div>
              <Button variant="outline" onClick={() => { setName(profile.full_name || ""); setPhone(profile.phone || ""); setEditing(true); }} className="w-full gap-2 mt-2"><Edit className="w-4 h-4" />Edit Profile</Button>
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
