import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  if (session.user.role !== "ENTREPRENEUR") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return Response.json([]);
  const places = await prisma.place.findMany({
    where: { entrepreneurProfileId: profile.id },
    include: {
      reviews: { select: { rating: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(places.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    address: p.address,
    price: p.price,
    status: p.status,
    createdAt: p.createdAt,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
    bookingCount: p._count.bookings,
  })));
}
