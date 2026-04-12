import { Router } from "express";
import { prisma } from "../../index";
import { authentication } from "../Exception/authentication";

const packageRouter = Router();

packageRouter.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "10", templeId, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (templeId) where.templeId = templeId;
    if (category) where.category = category;

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: Number(limit),
        include: { temple: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.package.count({ where }),
    ]);

    res.json({
      data: packages,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    throw new Error("Failed to fetch packages");
  }
});

packageRouter.get("/featured", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isFeatured: true, isActive: true },
      take: 6,
      include: { temple: true },
    });
    res.json(packages);
  } catch (error) {
    throw new Error("Failed to fetch featured packages");
  }
});

packageRouter.get("/:slug", async (req, res) => {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug: req.params.slug },
      include: { temple: true },
    });
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.json(pkg);
  } catch (error) {
    throw new Error("Failed to fetch package");
  }
});

packageRouter.get("/temple/:templeId", async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      where: { templeId: req.params.templeId, isActive: true },
      include: { temple: true },
    });
    res.json(packages);
  } catch (error) {
    throw new Error("Failed to fetch packages");
  }
});

packageRouter.post("/", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const pkg = await prisma.package.create({
      data: req.body,
    });
    res.json(pkg);
  } catch (error) {
    throw new Error("Failed to create package");
  }
});

packageRouter.put("/:id", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const pkg = await prisma.package.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(pkg);
  } catch (error) {
    throw new Error("Failed to update package");
  }
});

export default packageRouter;