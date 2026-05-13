import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    }
    if (session.user.role !== "TOURIST") {
      return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    }
    const { placeId, rating, body } = await req.json();
    if (!placeId || !rating || !body) {
      return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Qiymət düzgün deyil" }, { status: 400 });
    }
    const booking = await prisma.booking.findFirst({
      where: { userId: session.user.id, placeId, status: "COMPLETED" },
    });
    if (!booking) {
      return Response.json({ error: "Bu yeri ziyarət etmədən rəy yaza bilməzsiniz" }, { status: 403 });
    }
    const [review] = await prisma.$transaction([
      prisma.review.create({ data: { userId: session.user.id, placeId, rating, body } }),
      prisma.coinTransaction.create({
        data: { userId: session.user.id, amount: 20, reason: "Rəy yazıldı" },
      }),
      prisma.touristProfile.update({
        where: { userId: session.user.id },
        data: { coinBalance: { increment: 20 } },
      }),
    ]);
    return Response.json(review, { status: 201 });
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
