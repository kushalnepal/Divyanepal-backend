import { hashSync } from "bcryptjs";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import prisma from "../../../prisma-client";
import { JWT_SECRET } from "../../../secret";
import { BadRequest } from "../../Exception/bad-request";
import { ErrorCodes } from "../../Exception/root";
import { SignUpSchema } from "../../Schema/SignUpSchema";

export const Signup = async (req: Request, res: Response): Promise<any> => {
  SignUpSchema.parse(req.body);
  const { name, email, password, role } = req.body;
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  if (user) {
    throw new BadRequest("User already exists", ErrorCodes.USER_ALREADY_EXISTS);
  }
  const userRole = role ? role.toUpperCase() : "USER";
  const Userdata = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
      role: userRole,
    },
  });

  // Generate JWT token for the new user
  const token = jwt.sign({ userId: Userdata.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(201).json({
    message: "Signup successful",
    user: {
      id: Userdata.id,
      email: Userdata.email,
      name: Userdata.name,
      role: Userdata.role,
    },
    token,
  });
};
