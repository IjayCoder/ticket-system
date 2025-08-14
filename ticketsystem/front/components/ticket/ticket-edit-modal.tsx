"use client";

import type React from "react";

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
import { mockProjects } from "@/lib/mock-data";
import type { Priority, Ticket, User } from "@/types";
import { UpdateTicket } from "@/lib/apiLinks/ticket";
import { GetDev } from "@/lib/apiLinks/user";

interface TicketEditModalProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketUpdated: () => void;
}

export function TicketEditModal({
  ticket,
  open,
  onOpenChange,
  onTicketUpdated,
}: TicketEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Priority,

    projectName: "",
    assignedDev: "",
    clientId: "",
  });
  const [devs, setDevs] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    if (ticket.status === "IN_PROGRESS" || ticket.status === "RESOLVED") {
      alert("Vous ne pouvez pas modifier un ticket en cours ou résolu.");
      return;
    }

    setLoading(true);

    try {
      await UpdateTicket({
        id: ticket.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        projectName: formData.projectName,
        assignedDev: formData.assignedDev,
        clientId: formData.clientId,
      });
      console.log("Ticket successfully updated!");

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDev = async () => {
    try {
      const data = await GetDev();
      setDevs(data);
    } catch (err) {
      console.log("failed when getting dev");
      setError("Erreur lors du chargement des développeurs.");
    }
  };

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "MEDIUM",
        projectName: ticket.projectName || "",
        assignedDev: ticket.assignedDev?.id
          ? String(ticket.assignedDev.id)
          : "",
        clientId: ticket.client?.id?.toString() || "",
      });
    }
    handleDev();
  }, [ticket]);

  if (!ticket) return null;

  // Filter users based on current user role
  /*const getAvailableUsers = () => {
    if (currentUser.role === "Admin") {
      // Admin can assign to devs
      return mockUsers.filter((u) => u.role === "Dev");
    } else if (currentUser.role === "Dev") {
      // Dev can only assign to themselves or other devs
      return mockUsers.filter((u) => u.role === "Dev");
    } else {
      // Users can't reassign
      return mockUsers.filter((u) => u.id === ticket.assignedToId);
    }
  };*/

  // const availableUsers = getAvailableUsers();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter ticket title"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the issue or request"
              rows={4}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  setFormData({ ...formData, priority: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.projectName}
              onValueChange={(value) =>
                setFormData({ ...formData, projectName: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>{formData.projectName}</SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            {devs.length > 0 && (
              <Select
                value={formData.assignedDev}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedDev: value })
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {devs.find((dev) => String(dev.id) === formData.assignedDev)
                      ?.fullName ?? "Select assignee"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {devs.map((dev) => (
                    <SelectItem key={dev.id} value={String(dev.id)}>
                      {dev.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
