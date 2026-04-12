import { Router } from "express";
import { prisma } from "../../index";
import { authentication } from "../Exception/authentication";

const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    res.json({ message: "Message sent successfully", id: contact.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

contactRouter.get("/", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default contactRouter;