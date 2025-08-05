import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    let settings = await prisma.userSettings.findUnique({ where: { userId } });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          receiveNotificationsEmail: true,
          receiveTicketUpdateNotification: true,
        },
      });
    }

    res.status(200).json({ settings });
    return;
  } catch (error) {
    console.error("Erreur GET settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { receiveNotificationsEmail, receiveTicketUpdateNotification } =
      req.body;

    const data: any = {};

    if (receiveNotificationsEmail !== undefined) {
      data.receiveNotificationsEmail = receiveNotificationsEmail;
    }

    if (role !== "CLIENT" && receiveTicketUpdateNotification !== undefined) {
      data.receiveTicketUpdateNotification = receiveTicketUpdateNotification;
    }

    const update = await prisma.userSettings.update({
      where: { userId },
      data,
    });

    res.status(200).json({ update });
    return;
  } catch (error) {
    console.error("Erreur update settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
