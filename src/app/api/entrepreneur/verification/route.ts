import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  if (session.user.role !== "ENTREPRENEUR") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  const profile = await prisma.entrepreneurProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return Response.json({ error: "Profil tapılmadı" }, { status: 404 });
  return Response.json({ isVerified: profile.isVerified });
}
