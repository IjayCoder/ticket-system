"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { mockProjects } from "@/lib/mock-data";
import type { Priority, Status, Ticket } from "@/types";
import { CreateTicket } from "@/lib/apiLinks/ticket";
import { GetCurrentUser, GetDev } from "@/lib/apiLinks/user";
import { User } from "@/types";
import { toast } from "sonner";

interface TicketFormProps {
  onTicketCreated: (ticket: Ticket) => void;
}

export function TicketForm({ onTicketCreated }: TicketFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Priority,
    status: "OPEN" as Status,
    projectName: "",
    assignedDevId: "",
    clientId: "",
  });
  const [devs, setDevs] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      title,
      description,
      priority,
      projectName,
      assignedDevId,
      clientId,
    } = formData;

    try {
      const data = await CreateTicket(
        title,
        description,
        priority,
        projectName,
        assignedDevId,
        clientId
      );

      toast.success("Created!", {
        description: "Ticket created successfully!!",
      });

      setOpen(false); // fermer le modal
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "OPEN",
        projectName: "",
        assignedDevId: "",
        clientId: formData.clientId,
      });

      onTicketCreated(data.ticket);
    } catch (err) {
      toast.error("Error", { description: "Failed to create ticket" });
    } finally {
      setLoading(false);
    }
  };

  const handleDev = async () => {
    try {
      const data = await GetDev();
      setDevs(data);
    } catch (err) {
      toast.error("Error", { description: "Devs fetching failed" });

      setError("Error when fetching the devs ");
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await GetCurrentUser();
        setFormData((prev) => ({
          ...prev,
          clientId: String(user.id),
        }));
      } catch (err) {
        toast.error("Error", { description: "Error occurs while processing" });
      }
    };

    fetchCurrentUser();
    handleDev();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select
              value={formData.assignedDevId}
              onValueChange={(value) =>
                setFormData({ ...formData, assignedDevId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {devs.map((dev) => (
                  <SelectItem key={dev.id} value={String(dev.id)}>
                    {dev.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
