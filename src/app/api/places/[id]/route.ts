import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await prisma.place.findUnique({
    where: { id },
    include: { reviews: { include: { user: { select: { name: true } } } }, entrepreneur: { select: { businessName: true, location: true } } },
  });
  if (!place) return Response.json({ error: "Tapılmadı" }, { status: 404 });
  const avgRating = place.reviews.length ? place.reviews.reduce((sum, review) => sum + review.rating, 0) / place.reviews.length : 0;
  return Response.json({ ...place, avgRating });
}
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    if (session.user.role !== "ENTREPRENEUR") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    const { id } = await params;
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
    const place = await prisma.place.findUnique({ where: { id } });
    if (!place || place.entrepreneurProfileId !== profile?.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    const { status: _s, entrepreneurProfileId: _ep, ...data } = await req.json();
    const updated = await prisma.place.update({ where: { id }, data });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    if (session.user.role !== "ENTREPRENEUR") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    const { id } = await params;
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
    const place = await prisma.place.findUnique({ where: { id } });
    if (!place || place.entrepreneurProfileId !== profile?.id) return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    await prisma.place.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
