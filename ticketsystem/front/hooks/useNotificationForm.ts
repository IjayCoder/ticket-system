import { useState, useEffect } from "react";
import type { Notification, Ticket, User } from "@/types";
import { SendNotification } from "@/lib/apiLinks/notification";
import { toast } from "sonner";

export function useNotificationForm(
  user: User,
  ticket: Ticket | null,
  onClose: () => void
) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as Notification["type"],
    recipientType: "" as "CLIENT" | "DEV" | "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pré-remplir recipient si DEV
  useEffect(() => {
    if (user.role === "DEV" && ticket?.client?.id) {
      setFormData((prev) => ({ ...prev, recipientType: "CLIENT" }));
    }
  }, [ticket, user]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

      onClose(); // referme la modale
      setFormData({ title: "", message: "", type: "info", recipientType: "" });
    } catch (err) {
      toast.error("Error", { description: "message sending failed!!" });
      setError("Error occurs when sending a message");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
  };
}
