import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SPIN_PRIZES = [
  { id: "coin_20",  name: "+20 Bonus Koin",   emoji: "💫", type: "coins" as const, value: 20,  weight: 40 },
  { id: "coin_50",  name: "+50 Bonus Koin",   emoji: "🪙", type: "coins" as const, value: 50,  weight: 28 },
  { id: "halva",    name: "Şəki Halvası",      emoji: "🍯", type: "item"  as const,              weight: 14 },
  { id: "pakhlava", name: "Paklava Qutusu",    emoji: "🍬", type: "item"  as const,              weight: 10 },
  { id: "honey",    name: "Yerli Arı Balı",    emoji: "🫙", type: "item"  as const,              weight: 4  },
  { id: "coin_100", name: "+100 Bonus Koin",  emoji: "🎉", type: "coins" as const, value: 100, weight: 2  },
  { id: "silk",     name: "İpək Şərfə",        emoji: "🧣", type: "item"  as const,              weight: 1  },
  { id: "coin_200", name: "+200 Bonus Koin",  emoji: "💎", type: "coins" as const, value: 200, weight: 1  },
];

function pickSpinPrize() {
  const total = SPIN_PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const prize of SPIN_PRIZES) {
    r -= prize.weight;
    if (r <= 0) return prize;
  }
  return SPIN_PRIZES[0];
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Giriş tələb olunur" }, { status: 401 });
    if (session.user.role !== "TOURIST") return Response.json({ error: "İcazə yoxdur" }, { status: 403 });

    const { type, rewardName, coinCost } = await req.json();

    const profile = await prisma.touristProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return Response.json({ error: "Profil tapılmadı" }, { status: 404 });

    if (type === "reward") {
      if (!rewardName || !coinCost || coinCost <= 0) {
        return Response.json({ error: "Məlumatlar natamamdır" }, { status: 400 });
      }
      if (profile.coinBalance < coinCost) {
        return Response.json({ error: "Kifayət qədər koin yoxdur" }, { status: 400 });
      }
      const [updated] = await prisma.$transaction([
        prisma.touristProfile.update({
          where: { userId: session.user.id },
          data: { coinBalance: { decrement: coinCost } },
        }),
        prisma.coinTransaction.create({
          data: { userId: session.user.id, amount: -coinCost, reason: `Mükafat: ${rewardName}` },
        }),
      ]);
      return Response.json({ success: true, newBalance: updated.coinBalance });
    }

    if (type === "spin") {
      const SPIN_COST = 50;
      if (profile.coinBalance < SPIN_COST) {
        return Response.json({ error: "Kifayət qədər koin yoxdur (50 koin lazımdır)" }, { status: 400 });
      }
      const prize = pickSpinPrize();
      const netCost = prize.type === "coins" ? SPIN_COST - (prize.value ?? 0) : SPIN_COST;
      const updated = await prisma.$transaction(async (tx) => {
        const profile = await tx.touristProfile.update({
          where: { userId: session.user.id },
          data: { coinBalance: { decrement: netCost } },
        });
        await tx.coinTransaction.create({
          data: { userId: session.user.id, amount: -SPIN_COST, reason: "Şanslı Qutu açıldı" },
        });
        if (prize.type === "coins" && prize.value) {
          await tx.coinTransaction.create({
            data: { userId: session.user.id, amount: prize.value, reason: `Şanslı Qutu: ${prize.name}` },
          });
        }
        return profile;
      });
      return Response.json({ success: true, prize, newBalance: updated.coinBalance });
    }

    return Response.json({ error: "Növ düzgün deyil" }, { status: 400 });
  } catch {
    return Response.json({ error: "Server xətası" }, { status: 500 });
  }
}
