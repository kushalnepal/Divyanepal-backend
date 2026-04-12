import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const Port = Number(process.env.PORT) || 5006;
export const JWT_SECRET = process.env.JWT_SECRET!;
