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
  const entrepreneurs = await prisma.entrepreneurProfile.findMany({
    where: { isVerified: false },
    include: { user: { select: { name: true, email: true } } },
  });
  return Response.json(entrepreneurs);
}
