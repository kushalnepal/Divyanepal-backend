import { Router } from "express";
import { prisma } from "../../index";
import { authentication } from "../Exception/authentication";

const bookingRouter = Router();

bookingRouter.post("/", async (req, res) => {
  try {
    const { packageId, travelDate, passengers, guestName, guestEmail, guestPhone, specialRequests } = req.body;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    let user = null;
    let guestUserId = "guest";

    if (guestEmail) {
      user = await prisma.user.findUnique({
        where: { email: guestEmail },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: guestName,
            email: guestEmail,
            password: "guest",
            role: "USER",
          },
        });
      }
      guestUserId = user.id;
    }

    const totalAmount = (pkg.discountPrice || pkg.price) * passengers;

    const booking = await prisma.booking.create({
      data: {
        userId: guestUserId,
        packageId,
        travelDate: new Date(travelDate),
        passengers,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        totalAmount,
        status: "PENDING",
      },
    });

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

bookingRouter.get("/", authentication, async (req, res) => {
  try {
    const { role, id } = (req as any).user;
    
    let where: any = {};
    if (role === "USER") {
      where.userId = id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { package: { include: { temple: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

bookingRouter.get("/:id", authentication, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { package: { include: { temple: true } } },
    });

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
});

bookingRouter.put("/:id/status", authentication, async (req, res) => {
  try {
    const { role } = (req as any).user;
    if (role !== "ADMIN") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default bookingRouter;