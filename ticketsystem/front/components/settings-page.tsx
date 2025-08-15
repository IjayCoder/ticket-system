"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Bell, Save, LogOut } from "lucide-react";
import type { User } from "@/types";
import { Logout } from "@/lib/apiLinks/auth";
import { GetSettings, UpdateSettings } from "@/lib/apiLinks/setting";
import { toast } from "sonner";

interface SettingsPageProps {
  user: User;
}

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    ticketUpdates: boolean;
    weeklyDigest: boolean;
  };
  appearance: {
    theme: string;
    compactMode: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
  language: string;
  timezone: string;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<{
    receiveNotificationsEmail: boolean;
    receiveTicketUpdateNotification: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await GetSettings();
        setSettings(data.settings); // backend renvoie { settings }
      } catch (err) {
        toast.error("Error", {
          description: "Error when getting the settings",
        });
      }
    };
    fetchSettings();
  }, []);

  // Fonction pour changer un switch
  const handleToggle = (
    field: "receiveNotificationsEmail" | "receiveTicketUpdateNotification"
  ) => {
    if (settings) {
      setSettings({ ...settings, [field]: !settings[field] });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setLoading(true);
      await UpdateSettings(settings);
      toast.success("Saved!", {
        description: "Vos paramètres ont été mis à jour.",
      });
    } catch (err) {
      toast.error("Error", {
        description: "Error when saving the settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await Logout();
      router.push("/login");
    } catch (error) {
      toast.error("Error", {
        description: "Erreur occurs when  login out",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <p>Chargement...</p>;

  return (
    <div className=" ">
      {/* Top Navigation */}
      <div className=" bg-background">
        <div className="border-b ">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.push("/")}>
                  ← Back to Dashboard
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences and account settings
            </p>
          </div>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.receiveNotificationsEmail}
                  onCheckedChange={() =>
                    handleToggle("receiveNotificationsEmail")
                  }
                />
              </div>
              {(user.role === "ADMIN" || user.role === "DEV") && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ticket-updates">Ticket Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when tickets are updated
                    </p>
                  </div>
                  <Switch
                    id="ticket-updates"
                    checked={settings.receiveTicketUpdateNotification}
                    onCheckedChange={(checked) =>
                      handleToggle("receiveTicketUpdateNotification")
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appearance */}

          {/* Localization */}
          {/*<Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">
                        Pacific Time (UTC-8)
                      </SelectItem>
                      <SelectItem value="UTC-5">
                        Eastern Time (UTC-5)
                      </SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">
                        Central European Time (UTC+1)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>*/}

          {/* Privacy */}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
