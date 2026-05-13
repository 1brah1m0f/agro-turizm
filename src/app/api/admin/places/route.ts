import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  }
  const places = await prisma.place.findMany({
    where: { status: "PENDING" },
    include: { entrepreneur: { select: { businessName: true, phone: true, user: { select: { email: true, name: true } } } } },
  });
  return Response.json(places);
}
