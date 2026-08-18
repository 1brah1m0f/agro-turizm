import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { LOCATIONS } from "../src/components/map/locations";

type LocationInput = (typeof LOCATIONS)[number];

config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoryForType = (type: LocationInput["type"]) => {
  switch (type) {
    case "beekeeping":
      return "Arıçılıq";
    case "lakeside":
      return "Kamp";
    case "animal":
      return "At minmə";
    case "farm":
      return "Ferma";
    case "citrus":
    case "tea":
    case "lavender":
      return "Məhsul yığımı";
    case "vineyard":
      return "Şərabçılıq";
    case "fish":
      return "Balıqçılıq";
    case "guesthouse":
      return "Qonaq evi";
    case "park":
    case "cultural":
      return "Kənd turizmi";
    default:
      return "Aqroturizm";
  }
};

const durationForType = (type: LocationInput["type"]) => {
  switch (type) {
    case "guesthouse":
      return 1440;
    case "lakeside":
      return 240;
    case "park":
    case "cultural":
      return 180;
    case "fish":
      return 180;
    case "vineyard":
      return 150;
    case "citrus":
    case "tea":
    case "lavender":
      return 120;
    case "beekeeping":
      return 90;
    case "animal":
      return 90;
    case "farm":
    default:
      return 120;
  }
};

const parsePrice = (value?: string) => {
  if (!value) return 0;
  const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const numeric = Number.parseFloat(match[1]);
  return Number.isFinite(numeric) ? numeric : 0;
};

const uniqueStrings = (items: string[]) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

async function ensureMapEntrepreneur() {
  const passwordHash = await bcrypt.hash("MapImport#2026", 10);

  const user = await prisma.user.upsert({
    where: { email: "map-import@agrotour.az" },
    update: {},
    create: {
      email: "map-import@agrotour.az",
      password: passwordHash,
      role: "ENTREPRENEUR",
      name: "Map Import",
    },
  });

  const profile = await prisma.entrepreneurProfile.upsert({
    where: { userId: user.id },
    update: { isVerified: true },
    create: {
      userId: user.id,
      businessName: "Map Import",
      phone: "+994 50 000 00 00",
      category: "Aqroturizm",
      location: "Azərbaycan",
      description: "Xəritə üzərindən gətirilən məkanlar",
      isVerified: true,
    },
  });

  return profile.id;
}

async function upsertLocation(profileId: string, loc: LocationInput) {
  const address = `${loc.region}, ${loc.village}`;
  const price = parsePrice(loc.price);
  const depositAmount = price > 0 ? Math.round(price * 0.3 * 100) / 100 : 0;
  const amenities = uniqueStrings([...(loc.activities ?? []), ...(loc.products ?? [])]);
  const tourDuration = durationForType(loc.type);

  const existing = await prisma.place.findFirst({
    where: { name: loc.name, address },
  });

  const data = {
    entrepreneurProfileId: profileId,
    name: loc.name,
    description: loc.description,
    category: categoryForType(loc.type),
    address,
    lat: loc.lat,
    lng: loc.lng,
    photos: loc.photos.map((photo) => photo.url),
    price,
    depositAmount,
    tourDuration,
    amenities,
    status: "APPROVED" as const,
  };

  if (existing) {
    await prisma.place.update({ where: { id: existing.id }, data });
    return { action: "updated", id: existing.id } as const;
  }

  const created = await prisma.place.create({ data });
  return { action: "created", id: created.id } as const;
}

async function main() {
  const profileId = await ensureMapEntrepreneur();

  let created = 0;
  let updated = 0;

  for (const loc of LOCATIONS) {
    const result = await upsertLocation(profileId, loc);
    if (result.action === "created") created += 1;
    else updated += 1;
  }

  console.log(`Seed map locations complete. Created: ${created}, Updated: ${updated}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
