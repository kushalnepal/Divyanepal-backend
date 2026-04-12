import { Router } from "express";
import { prisma } from "../../index";
import { authentication } from "../Exception/authentication";

const templeRouter = Router();

templeRouter.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "10", region, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (region) where.region = region;
    if (type) where.type = type;

    const [temples, total] = await Promise.all([
      prisma.temple.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.temple.count({ where }),
    ]);

    res.json({
      data: temples,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    throw new Error("Failed to fetch temples");
  }
});

templeRouter.get("/featured", async (req, res) => {
  try {
    const temples = await prisma.temple.findMany({
      where: { isFeatured: true },
      take: 6,
    });
    res.json(temples);
  } catch (error) {
    throw new Error("Failed to fetch featured temples");
  }
});

templeRouter.get("/:slug", async (req, res) => {
  try {
    const temple = await prisma.temple.findUnique({
      where: { slug: req.params.slug },
    });
    if (!temple) {
      res.status(404).json({ message: "Temple not found" });
      return;
    }
    res.json(temple);
  } catch (error) {
    throw new Error("Failed to fetch temple");
  }
});

templeRouter.post("/", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const temple = await prisma.temple.create({
      data: req.body,
    });
    res.json(temple);
  } catch (error) {
    throw new Error("Failed to create temple");
  }
});

templeRouter.put("/:id", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const temple = await prisma.temple.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(temple);
  } catch (error) {
    throw new Error("Failed to update temple");
  }
});

templeRouter.delete("/:id", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await prisma.temple.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Temple deleted" });
  } catch (error) {
    throw new Error("Failed to delete temple");
  }
});

export default templeRouter;