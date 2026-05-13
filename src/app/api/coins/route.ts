import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
  }
  if (session.user.role !== "TOURIST") {
    return Response.json({ error: "İcazə yoxdur" }, { status: 403 });
  }
  const profile = await prisma.touristProfile.findUnique({
    where: { userId: session.user.id },
  });
  const transactions = await prisma.coinTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return Response.json({ coinBalance: profile?.coinBalance ?? 0, transactions });
}
