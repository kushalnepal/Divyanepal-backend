import { compareSync } from "bcryptjs";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import prisma from "../../../prisma-client";
import { JWT_SECRET } from "../../../secret";
import { BadRequest } from "../../Exception/bad-request";
import { NotFoundException } from "../../Exception/notfound-exception";
import { ErrorCodes } from "../../Exception/root";

export const loginController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest(
      "Email and password are required",
      ErrorCodes.BAD_REQUEST,
    ); //throw vanekaii generic error throw gareko
  }
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
  }

  const isPasswordValid = compareSync(password, user!.password);

  if (!isPasswordValid) {
    throw new BadRequest("Invalid password", ErrorCodes.INVALID_PASSWORD);
  }

  const token = jwt.sign({ userId: user!.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      role: user!.role,
    },
    token,
  });
  //  catch (err: any) {
  //   if (err.name === "ZodError") {
  //     return next(
  //       new UnProcessableEntity(
  //         422,
  //         "Validation failed",
  //         ErrorCodes.UNPROCESSABLE_ENTITY,
  //         err.errors
  //       )
  //     );
  //   }
  //   console.log(err);
  //   return res.send(
  //     new UnProcessableEntity(
  //       422,
  //       "Internal server error",
  //       ErrorCodes.UNPROCESSABLE_ENTITY,
  //       err?.issues
  //     )
  //   );
  // }
};
