"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Notification, Ticket, User } from "@/types";
import { SendNotification } from "@/lib/apiLinks/notification";
import { toast } from "sonner";

interface NotificationModalProps {
  user: User;
  ticket: Ticket | null;
  open: boolean;
  onOpenSend: (open: boolean) => void;
}

export function NotificationModal({
  user,
  ticket,
  open,
  onOpenSend,
}: NotificationModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as Notification["type"],
    recipientType: "" as "CLIENT" | "DEV" | "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticket) return;

    if (user.role === "DEV" && ticket.client?.id) {
      setFormData((prev) => ({ ...prev, recipientType: "CLIENT" }));
    }
  }, [ticket, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    try {
      setLoading(true);
      setError("");

      if (user.role === "DEV") {
        await SendNotification(
          formData.title,
          formData.message,
          formData.type,
          ticket.id
        );

        toast.success("Sent", { description: "message sent!!" });
      } else if (user.role === "ADMIN") {
        if (!formData.recipientType) {
          setError("Receiver need to be set");
          return;
        }

        await SendNotification(
          formData.title,
          formData.message,
          formData.type,
          ticket.id,
          formData.recipientType
        );
      }

      onOpenSend(false);
      setFormData({ title: "", message: "", type: "info", recipientType: "" });
    } catch (err) {
      toast.error("Error", { description: "message sending failed!!" });
      setError("Error occurs when sending a message");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenSend}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Envoyer une notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Notification["type"]) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destinataire (ADMIN uniquement) */}
          {user.role === "ADMIN" && (
            <div className="space-y-2">
              <Label>Destinataire</Label>
              <Select
                value={formData.recipientType}
                onValueChange={(value: "CLIENT" | "DEV") =>
                  setFormData({ ...formData, recipientType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">
                    Client ({ticket.client?.fullName})
                  </SelectItem>
                  {ticket.assignedDev && (
                    <SelectItem value="DEV">
                      Développeur ({ticket.assignedDev.fullName})
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenSend(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
