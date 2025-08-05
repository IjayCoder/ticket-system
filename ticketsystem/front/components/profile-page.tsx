"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  Camera,
  ArrowLeft,
} from "lucide-react";
import type { User as UserType } from "@/types";
import { UpdateProfile } from "@/lib/apiLinks/user";
import { GetDashbordStats } from "@/lib/apiLinks/ticket";

interface ProfilePageProps {
  user: UserType;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.fullName,
    email: user.email,
  });
  const [stats, setStats] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);

    if (!user) return;

    try {
      await UpdateProfile({
        id: parseInt(user.id),
        email: formData.email,
        fullName: formData.name,
      });

      console.log("Profile updated");
    } catch (error) {
      console.error("failed to update");
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.fullName || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const getStatusCounts = async () => {
      try {
        const result = await GetDashbordStats();
        setStats(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    getStatusCounts();
  }, []);

  const handleCancel = () => {
    setFormData({
      name: user.fullName,
      email: user.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="p-2 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">Profile</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-4 sm:px-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-medium">{formData.name}</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    {formData.email}
                  </p>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="break-all">{formData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="break-all">{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center space-x-2 py-2">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{user.role}</span>
                    <Badge variant="outline" className="text-xs">
                      System Assigned
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center space-x-2 py-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>January 2024</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full sm:w-auto bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "ADMIN" && "All tickets created"}
                  {user.role === "DEV" && "Tickets Opened"}
                  {user.role === "CLIENT" && "Tickets Created"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.role === "ADMIN" && `${stats.total}`}
                  {user.role === "CLIENT" && `${stats.create}`}
                  {user.role === "DEV" && `${stats.opened}`}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "ADMIN" && "All tickets Opened"}
                  {user.role === "DEV" && "Tickets Opened"}
                  {user.role === "CLIENT" && "Tickets Created"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.role === "ADMIN" && `${stats.opened}`}
                  {user.role === "CLIENT" && `${stats.in_progress}`}
                  {user.role === "DEV" && `${stats.resolved}`}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {user.role === "DEV"
                    ? "Average Response Time"
                    : "Tickets Resolved"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.role === "ADMIN" && `${stats.resolved}`}
                  {user.role === "CLIENT" && `${stats.resolved}`}
                  {user.role === "DEV" && `${stats.resolved}`}
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
