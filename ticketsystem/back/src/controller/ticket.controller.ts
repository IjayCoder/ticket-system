import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sendEmail } from "../services/email.service";
import { notificationService } from "../services/notification.service";

interface Ticket {
  title: string;
  description: string;
  priority: string;
  projectName: string;
  status: string;
}

interface CustomRequest extends Request {
  user?: { id: number; role: string };
}

const stats = {};

const prisma = new PrismaClient();

/*export const createTicket = async (req: Request, res: Response) => {
  // const user = req.user;
  try {
    const {
      title,
      description,
      priority,
      projectName,
      assignedDevId,
      clientId,
    } = req.body;

    if (
      !title ||
      !description ||
      !priority ||
      !projectName ||
      !assignedDevId ||
      !clientId
    ) {
      res.status(400).json({ message: "Fill all the fields" });
      return;
    }

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        projectName,
        assignedDevId,
        clientId,
      },
      include: {
        assignedDev: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.log("Ticket creation failed", error);
    res.status(500).json({ message: "Internal server error." });
  }
};*/

export const createTicket = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      priority,
      projectName,
      assignedDevId,
      clientId,
    } = req.body;

    if (
      !title ||
      !description ||
      !priority ||
      !projectName ||
      !assignedDevId ||
      !clientId
    ) {
      res.status(400).json({ message: "Fill all the fields" });
      return;
    }

    // ✅ Création du ticket
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        projectName,
        assignedDevId,
        clientId,
      },
      include: {
        assignedDev: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // ------------------- NOTIFICATIONS ------------------- //

    // 1️⃣ Client (obligatoire)
    await notificationService.createNotification(
      newTicket.client.id,
      "Votre ticket a été créé ✅",
      `Bonjour ${newTicket.client.fullName}, votre ticket "${title}" a été créé.`,
      "success",
      newTicket.id
    );

    // 2️⃣ Dev assigné (obligatoire si dev)
    if (newTicket.assignedDev) {
      await notificationService.createNotification(
        newTicket.assignedDev.id,
        "Un ticket vous a été assigné 📌",
        `Bonjour ${newTicket.assignedDev.fullName}, 
        le ticket "${title}" vous a été assigné par ${newTicket.client.fullName}.`,
        "info",
        newTicket.id
      );
    }

    // 3️⃣ Admins (obligatoire dans l'app)
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await notificationService.createNotification(
        admin.id,
        "Nouveau ticket créé 🚨",
        `Un nouveau ticket "${title}" a été créé par ${newTicket.client.fullName}.`,
        "warning",
        newTicket.id
      );
    }

    // ------------------------------------------------------ //

    res.status(200).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
    return;
  } catch (error) {
    console.log("Ticket creation failed", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [tickets, totalCount] = await Promise.all([
      prisma.ticket.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          client: { select: { fullName: true, email: true } },
          assignedDev: { select: { fullName: true, email: true } },
        },
      }),
      prisma.ticket.count(),
    ]);

    const total: number = Number(totalCount); // 👈 ajout du cast si nécessaire

    res.status(200).json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    console.error("Fetching tickets failed", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

export const getMyTickets = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let whereClause = {};

    if (role === "CLIENT") {
      whereClause = { clientId: userId };
    } else if (role === "DEV") {
      whereClause = { assignedDevId: userId };
    } else {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const [tickets, totalCount] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        include: {
          assignedDev: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          client: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.ticket.count(),
    ]);

    const total: number = Number(totalCount); // 👈 ajout du cast si nécessaire

    res.status(200).json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    console.error("Fetching tickets failed", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;
    const userId = req.user?.id;

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { client: true },
    });

    if (!ticket) {
      res.status(400).json({ message: "Cannot find ticket" });
      return;
    }

    if (
      (role === "CLIENT" && ticket?.clientId !== userId) ||
      (role === "DEV" && ticket?.assignedDevId !== userId)
    ) {
      res.status(403).json({ message: "Not authorized to view this ticket" });
      return;
    }

    res.status(200).json({ ticket });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/*export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, projectName, status } = req.body;

    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { title, description, priority, projectName, status },
    });

    res.status(200).json({ message: "Ticket updated", ticket: updatedTicket });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};*/

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, projectName } = req.body;

    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { title, description, priority, projectName },
      include: { client: true, assignedDev: true },
    });

    const currentUser = req.user;

    // Si c'est le client qui modifie → notifier dev + admins (selon leurs settings)
    if (currentUser?.role === "CLIENT") {
      if (updatedTicket.assignedDev) {
        const devSettings = await prisma.userSettings.findUnique({
          where: { userId: updatedTicket.assignedDev.id },
        });

        if (devSettings?.receiveTicketUpdateNotification) {
          await notificationService.createNotification(
            updatedTicket.assignedDev.id,
            "Un ticket a été modifié",
            `Le client ${updatedTicket.client.fullName} a modifié le ticket "${updatedTicket.title}".`,
            "warning",
            updatedTicket.id
          );
        }
      }

      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      for (const admin of admins) {
        const adminSettings = await prisma.userSettings.findUnique({
          where: { userId: admin.id },
        });

        if (adminSettings?.receiveTicketUpdateNotification) {
          await notificationService.createNotification(
            admin.id,
            "Un ticket a été modifié",
            `Le client ${updatedTicket.client.fullName} a modifié le ticket "${updatedTicket.title}".`,
            "warning",
            updatedTicket.id
          );
        }
      }
    }

    res.status(200).json({ message: "Ticket updated", ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/*export const updateTicketStatus = async (req: Request, res: Response) => {
  const ticketId = Number(req.params.id);
  const { status } = req.body;
  const user = req.user;

  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found!!" });
      return;
    }

    if (user?.role === "DEV" && ticket?.assignedDevId !== user.id) {
      res.status(403).json({ message: "Not autorized to update this ticket" });
      return;
    }

    const updateStatus = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    res.status(200).json({ ticket: updateStatus });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};*/

export const updateTicketStatus = async (req: Request, res: Response) => {
  const ticketId = Number(req.params.id);
  const { status } = req.body;
  const user = req.user;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { client: true },
    });

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found!!" });
      return;
    }

    if (user?.role === "DEV" && ticket?.assignedDevId !== user.id) {
      res.status(403).json({ message: "Not authorized to update this ticket" });
      return;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
      include: { client: true },
    });

    // === NOTIFICATIONS ===

    // 1️⃣ Client : message spécifique si RESOLVED
    const clientMessage =
      status === "RESOLVED"
        ? `Bonjour ${updatedTicket.client.fullName}, votre ticket "${updatedTicket.title}" a été résolu ✅.`
        : `Le statut de votre ticket "${updatedTicket.title}" est maintenant "${status}".`;

    await notificationService.createNotification(
      updatedTicket.client.id,
      "Mise à jour de votre ticket",
      clientMessage,
      "info",
      updatedTicket.id
    );

    // Email client si autorisé
    const clientSettings = await prisma.userSettings.findUnique({
      where: { userId: updatedTicket.client.id },
    });

    /*if (clientSettings?.receiveNotificationsEmail) {
      await sendEmail(
        updatedTicket.client.email,
        "Mise à jour de votre ticket",
        clientMessage
      );
    }*/

    // 2️⃣ Admins
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await notificationService.createNotification(
        admin.id,
        "Mise à jour du ticket",
        `Le ticket "${updatedTicket.title}" du client ${updatedTicket.client.fullName} est maintenant "${status}".`,
        "info",
        updatedTicket.id
      );

      const adminSettings = await prisma.userSettings.findUnique({
        where: { userId: admin.id },
      });

      /* if (adminSettings?.receiveNotificationsEmail) {
        await sendEmail(
          admin.email,
          "Mise à jour du ticket",
          `Le ticket "${updatedTicket.title}" du client ${updatedTicket.client.fullName} est maintenant "${status}".`
        );
      }*/
    }

    res.status(200).json({ ticket: updatedTicket });
  } catch (error) {
    console.error("Erreur updateTicketStatus :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.ticket.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Ticket deleted" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req: CustomRequest, res: Response) => {
  console.log("User in stats route", req.user);

  const role = req.user?.role;
  const userId = req.user?.id;
  const stats: Record<string, number> = {};
  try {
    if (role === "ADMIN") {
      stats.total = await prisma.ticket.count();
      stats.unopen = await prisma.ticket.count({ where: { status: "UNOPEN" } });
      stats.open = await prisma.ticket.count({ where: { status: "OPEN" } });
      stats.opened = await prisma.ticket.count({
        where: { status: { not: "UNOPEN" } },
      });

      stats.in_progress = await prisma.ticket.count({
        where: { status: "IN_PROGRESS" },
      });
      stats.resolved = await prisma.ticket.count({
        where: { status: "RESOLVED" },
      });
    }

    if (role === "CLIENT") {
      stats.total = await prisma.ticket.count({ where: { clientId: userId } });
      stats.open = await prisma.ticket.count({
        where: { status: "OPEN", clientId: req.user?.id },
      });

      stats.opened = await prisma.ticket.count({
        where: { status: { not: "UNOPEN" }, clientId: req.user?.id },
      });
      stats.resolved = await prisma.ticket.count({
        where: { status: "RESOLVED", clientId: req.user?.id },
      });

      stats.in_progress = await prisma.ticket.count({
        where: { status: "IN_PROGRESS", clientId: req.user?.id },
      });

      stats.create = await prisma.ticket.count({
        where: { clientId: req.user?.id },
      });
    }

    if (role === "DEV") {
      stats.totalAssign = await prisma.ticket.count({
        where: { assignedDevId: userId },
      });
      stats.in_progress = await prisma.ticket.count({
        where: { status: "IN_PROGRESS", assignedDevId: req.user?.id },
      });
      stats.resolved = await prisma.ticket.count({
        where: {
          status: "RESOLVED",
          assignedDevId: req.user?.id,
        },
      });

      stats.opened = await prisma.ticket.count({
        where: { status: { not: "UNOPEN" }, assignedDevId: req.user?.id },
      });
    }

    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const getResolvedTime = async (req: CustomRequest, res: Response) => {};
