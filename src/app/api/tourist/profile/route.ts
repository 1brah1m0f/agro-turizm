import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    }
    if (session.user.role !== "TOURIST") {
      return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    }
    const { phone, country, interests } = await req.json();
    const profile = await prisma.touristProfile.update({
      where: { userId: session.user.id },
      data: { phone, country, interests },
    });
    return Response.json(profile);
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
