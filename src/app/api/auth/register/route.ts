import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();
    if (!email || !password || !name || !role) {
      return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
    }
    if (!["TOURIST", "ENTREPRENEUR", "ADMIN"].includes(role)) {
      return Response.json({ error: "Rol düzgün deyil" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email artıq mövcuddur" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (role === "TOURIST") {
      await prisma.$transaction([
        prisma.touristProfile.create({ data: { userId: user.id, interests: [], coinBalance: 100 } }),
        prisma.coinTransaction.create({ data: { userId: user.id, amount: 100, reason: "Qeydiyyat bonusu" } }),
      ]);
    }
    if (role === "ENTREPRENEUR") {
      await prisma.entrepreneurProfile.create({
        data: { userId: user.id, businessName: name, phone: "", category: "", location: "" },
      });
    }
    return Response.json(user, { status: 201 });
  } catch (err) {
    console.error("register error:", err);
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
