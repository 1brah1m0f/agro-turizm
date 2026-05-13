import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  if (session.user.role === "TOURIST") {
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { place: { select: { name: true, address: true } } },
    });
    return Response.json(bookings.map((b) => ({
      id: b.id,
      placeId: b.placeId,
      placeName: b.place.name,
      address: b.place.address,
      date: b.date,
      status: b.status,
      qrCode: b.qrCode,
    })));
  }
  if (session.user.role === "ENTREPRENEUR") {
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
    const bookings = await prisma.booking.findMany({
      where: { place: { entrepreneurProfileId: profile?.id } },
      include: { user: { select: { name: true } }, place: { select: { name: true } } },
    });
    return Response.json(bookings.map((b) => ({
      id: b.id,
      touristName: b.user.name,
      placeName: b.place.name,
      placeId: b.placeId,
      date: b.date,
      timeSlot: b.timeSlot,
      participantCount: b.participantCount,
      totalAmount: b.totalAmount,
      status: b.status,
    })));
  }
  return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
}
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    if (session.user.role !== "TOURIST") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    const { placeId, date, timeSlot, participantCount } = await req.json();
    if (!placeId || !date || !timeSlot || !participantCount) return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
    if (participantCount <= 0) return Response.json({ error: "İştirakçı sayı düzgün deyil" }, { status: 400 });
    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (!place || place.status !== "APPROVED") return Response.json({ error: "Məkan mövcud deyil" }, { status: 400 });
    const totalAmount = place.price * participantCount;
    const depositAmount = totalAmount * 0.3;
    const booking = await prisma.booking.create({
      data: { userId: session.user.id, placeId, date: new Date(date), timeSlot, participantCount, totalAmount, depositAmount },
    });
    return Response.json(booking, { status: 201 });
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
