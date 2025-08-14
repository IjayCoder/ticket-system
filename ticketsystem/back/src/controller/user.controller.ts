import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

const prisma = new PrismaClient();

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.user!;

    const Profile = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!Profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile connected", user: Profile });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDev = async (req: CustomRequest, res: Response) => {
  try {
    const devs = await prisma.user.findMany({
      where: { role: "DEV" },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (devs.length === 0) {
      res.status(400).json({ message: "No DEV found!!" });
      return;
    }

    res.status(200).json({ devs });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server errors" });
  }
};

export const UpdateUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, fullName } = req.body;

    const UpdateProfile = await prisma.user.update({
      where: { id: id },
      data: { email, fullName },
    });

    res
      .status(200)
      .json({ message: "Profile Updated", profile: UpdateProfile });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
