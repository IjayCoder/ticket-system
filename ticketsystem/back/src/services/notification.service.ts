import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./email.service"; // ton service email déjà créé
import { wrapEmailContent } from "../utils/email/layout";

const prisma = new PrismaClient();

/**
 * Crée une notification et envoie éventuellement un email en fonction des préférences utilisateur
 */
export const notificationService = {
  async createNotification(
    userId: number,
    title: string,
    message: string,
    type: "info" | "warning" | "success" | "error",
    ticketId?: number
  ) {
    // 🔹 1. Crée la notification in-app
    const notification = await prisma.notification.create({
      data: { userId, title, message, type, ticketId },
    });

    // 🔹 2. Récupère les préférences utilisateur
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // 🔹 3. Envoie par email uniquement si activé
    if (settings?.receiveNotificationsEmail) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        await sendEmail(
          user.email,
          `📩 ${title}`,
          wrapEmailContent(`
    
     <p>${message}</p><br><p><small>Ticket: ${ticketId ?? "N/A"}</small></p>
    
  `)
        );
      }
    }

    return notification;
  },

  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: number) {
    return await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  },

  async getUserNotifications(userId: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
