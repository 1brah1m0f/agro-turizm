import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
    }
    const { id } = await params;
    const { status } = await req.json();
    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
    }
    const place = await prisma.place.update({ where: { id }, data: { status } });
    return Response.json(place);
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
