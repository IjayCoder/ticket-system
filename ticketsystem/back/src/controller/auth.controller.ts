import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const Register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    //check the fields
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    //check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(409).json({ message: "This email is already used !" });
      return;
    }

    //check role

    let role: "CLIENT" | "DEV" | "ADMIN" = "CLIENT";
    if (fullName.endsWith("_@dev")) {
      role = "DEV";
    } else if (fullName.startsWith("@admin")) {
      role = "ADMIN";
    }

    //hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new user
    const newUser = await prisma.user.create({
      data: { email, password: passwordHash, fullName, role },
    });

    res.status(200).json({
      message: "Registration successful !!",
      user: {
        id: newUser.id,
        email: newUser.email,

        role: newUser.role,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error." });
    return;
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecondes
    });

    res.status(200).json({
      message: "Sign in Successfull",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server Error" });
    return;
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logout Successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};
