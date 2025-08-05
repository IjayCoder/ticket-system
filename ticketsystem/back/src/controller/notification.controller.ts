import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";

const prisma = new PrismaClient();

export const SendNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, ticketId, recipientType } = req.body;
    const sender = req.user;

    console.log("Sender:", sender);
    console.log("Body:", req.body);

    if (!title || !message || !type || !ticketId) {
      res.status(400).json({ message: "Fill all the fields" });
      return;
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(ticketId) },
      include: { client: true, assignedDev: true },
    });

    console.log("Ticket:", ticket);

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    let recipientId: number | null = null;

    if (sender?.role === "ADMIN") {
      if (recipientType === "CLIENT") {
        recipientId = ticket.clientId;
      } else if (recipientType === "DEV") {
        if (!ticket.assignedDevId) {
          res
            .status(400)
            .json({ message: "This ticket is not assigned to a developer." });
          return;
        }
        recipientId = ticket.assignedDevId;
      } else {
        res.status(400).json({ message: "Invalid recipient type." });
        return;
      }
    } else if (sender?.role === "DEV") {
      if (ticket.assignedDevId !== sender.id) {
        res
          .status(403)
          .json({ message: "You are not assigned to this ticket." });
        return;
      }
      recipientId = ticket.clientId;
    } else {
      res
        .status(403)
        .json({ message: "Clients are not allowed to send notifications." });
      return;
    }

    if (!recipientId) {
      res.status(400).json({ message: "Unable to resolve recipient." });
      return;
    }

    const newNotification = await notificationService.createNotification(
      recipientId,
      title,
      message,
      type,
      parseInt(ticketId)
    );

    res.status(201).json(newNotification);
    return;
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Server error." });
    return;
  }
};

export const GetNotification = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ notifications });
    return;
  } catch (error) {
    console.error("Fetching notifications failed", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

export const MarkNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du marquage comme lu" });
  }
};

export const MarkAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });

    res
      .status(200)
      .json({ message: "Toutes les notifications marquées comme lues" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du marquage global" });
  }
};
