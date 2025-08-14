import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./email.service"; // ton service email déjà créé
import { wrapEmailContent } from "../utils/email/layout";

const prisma = new PrismaClient();

/**
 * Create a notification and optionally send an email based on the user's preferences.
 */
export const notificationService = {
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "info" | "warning" | "success" | "error",
    ticketId?: string
  ) {
    //  Create the in-app notification
    const notification = await prisma.notification.create({
      data: { userId, title, message, type, ticketId },
    });

    //  retrieve the user's preferences
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    //  send via email only if enabled
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

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  },

  async getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};
