import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    }
    if (session.user.role !== "ENTREPRENEUR") {
      return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    }
    const { businessName, phone, category, location, description, logoUrl } = await req.json();
    const profile = await prisma.entrepreneurProfile.update({
      where: { userId: session.user.id },
      data: { businessName, phone, category, location, description, logoUrl },
    });
    return Response.json(profile);
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
