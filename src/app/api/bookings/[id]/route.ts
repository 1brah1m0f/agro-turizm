import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { place: true, user: { select: { name: true, email: true } } } });
  if (!booking) return Response.json({ error: "Tapılmadı" }, { status: 404 });
  if (session.user.role === "TOURIST" && booking.userId !== session.user.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  if (session.user.role === "ENTREPRENEUR") {
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
    if (booking.place.entrepreneurProfileId !== profile?.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  }
  return Response.json(booking);
}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const action = body?.action as string | undefined;
    if (!action) return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
    const booking = await prisma.booking.findUnique({ where: { id }, include: { place: true } });
    if (!booking) return Response.json({ error: "Tapılmadı" }, { status: 404 });
    if (action === "cancel") {
      if (session.user.role !== "TOURIST") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
      if (booking.userId !== session.user.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
      return Response.json(updated);
    }
    if (session.user.role !== "ENTREPRENEUR") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
    if (booking.place.entrepreneurProfileId !== profile?.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    if (action === "reject") {
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
      return Response.json(updated);
    }
    if (action === "confirm") {
      const updated = await prisma.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
      return Response.json(updated);
    }
    if (action === "scan") {
      const earnedCoins = Math.max(1, Math.round(booking.totalAmount * 0.1));
      const [updated, profileUpdate] = await prisma.$transaction([
        prisma.booking.update({ where: { id }, data: { status: "COMPLETED" } }),
        prisma.touristProfile.update({ where: { userId: booking.userId }, data: { coinBalance: { increment: earnedCoins } } }),
        prisma.coinTransaction.create({ data: { userId: booking.userId, amount: earnedCoins, reason: "Ödənişin 10% koin qaytarımı" } }),
      ]);
      return Response.json({ booking: updated, coinBalance: profileUpdate.coinBalance });
    }
    return Response.json({ error: "Əməliyyat düzgün deyil" }, { status: 400 });
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
