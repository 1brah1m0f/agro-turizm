import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  }
  const { id, role } = session.user;
  if (role === "TOURIST") {
    const profile = await prisma.touristProfile.findUnique({ where: { userId: id } });
    return Response.json({ user: session.user, profile });
  }
  if (role === "ENTREPRENEUR") {
    const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: id } });
    const placesCount = profile ? await prisma.place.count({ where: { entrepreneurProfileId: profile.id } }) : 0;
    return Response.json({ user: session.user, profile: profile ? { ...profile, placesCount } : null });
  }
  return Response.json({ user: session.user });
}
