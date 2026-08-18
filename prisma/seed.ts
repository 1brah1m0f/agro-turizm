import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.place.deleteMany();
  await prisma.entrepreneurProfile.deleteMany();
  await prisma.touristProfile.deleteMany();
  await prisma.coinTransaction.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("password123", 10);
  const verifiedEntrepreneurPassword = await bcrypt.hash("Kanon005@", 10);

  const admin = await prisma.user.create({
    data: { email: "admin@farmorfx.az", password: adminPassword, role: "ADMIN", name: "Admin" },
  });

  const entrepreneurFermer = await prisma.user.create({
    data: { email: "fermer@gmail.com", password: verifiedEntrepreneurPassword, role: "ENTREPRENEUR", name: "Fermer" },
  });

  const entrepreneurVerified = await prisma.user.create({
    data: { email: "seki@farmorfx.az", password: userPassword, role: "ENTREPRENEUR", name: "Sehki Uzum Fermasi" },
  });

  const entrepreneurPending = await prisma.user.create({
    data: { email: "quba@farmorfx.az", password: userPassword, role: "ENTREPRENEUR", name: "Quba Alma Bagi" },
  });

  const tourist1 = await prisma.user.create({
    data: { email: "tourist1@farmorfx.az", password: userPassword, role: "TOURIST", name: "Aysel" },
  });

  const tourist2 = await prisma.user.create({
    data: { email: "tourist2@farmorfx.az", password: userPassword, role: "TOURIST", name: "Orxan" },
  });

  const tourist3 = await prisma.user.create({
    data: { email: "tourist3@farmorfx.az", password: userPassword, role: "TOURIST", name: "Nigar" },
  });

  const verifiedProfile = await prisma.entrepreneurProfile.create({
    data: {
      userId: entrepreneurVerified.id,
      businessName: "Seki Uzum Fermasi",
      phone: "+994501112233",
      category: "Ferma",
      location: "Seki",
      description: "Uzum yigimi ve yerli dadlar.",
      logoUrl: "https://picsum.photos/seed/seki/200",
      isVerified: true,
    },
  });

  const fermerProfile = await prisma.entrepreneurProfile.create({
    data: {
      userId: entrepreneurFermer.id,
      businessName: "Fermer Teserrufati",
      phone: "+994501998877",
      category: "Ferma",
      location: "Goygol",
      description: "Ekoloji ferma turlari ve dadim.",
      logoUrl: "https://picsum.photos/seed/fermer/200",
      isVerified: true,
    },
  });

  const pendingProfile = await prisma.entrepreneurProfile.create({
    data: {
      userId: entrepreneurPending.id,
      businessName: "Quba Alma Bagi",
      phone: "+994501112244",
      category: "Bag",
      location: "Quba",
      description: "Alma yigimi ve ailevi piknik.",
      logoUrl: "https://picsum.photos/seed/quba/200",
      isVerified: false,
    },
  });

  await prisma.touristProfile.createMany({
    data: [
      { userId: tourist1.id, phone: "+994501223300", country: "Azerbaijan", interests: ["ferma", "yemek"], coinBalance: 240 },
      { userId: tourist2.id, phone: "+994501223311", country: "Turkey", interests: ["kultura", "kamp"], coinBalance: 120 },
      { userId: tourist3.id, phone: "+994501223322", country: "Georgia", interests: ["at minme"], coinBalance: 480 },
    ],
  });

  await prisma.place.createMany({
    data: [
      {
        entrepreneurProfileId: verifiedProfile.id,
        name: "Uzum Yigimi Turu",
        description: "Uzum baglarinda yigim ve dequstasiya.",
        category: "Ferma",
        address: "Seki, Azerbaijan",
        lat: 41.190,
        lng: 47.170,
        photos: ["https://picsum.photos/seed/uzum/800/600"],
        price: 45,
        depositAmount: 13.5,
        tourDuration: 120,
        amenities: ["bələdçi", "dadım"],
        status: "APPROVED",
      },
      {
        entrepreneurProfileId: verifiedProfile.id,
        name: "Bal Dadimi ve Ariciliq",
        description: "Ariciliq prosesini izleyin ve bal dadin.",
        category: "Ariciliq",
        address: "Qax, Azerbaijan",
        lat: 41.420,
        lng: 46.920,
        photos: ["https://picsum.photos/seed/bal/800/600"],
        price: 35,
        depositAmount: 10.5,
        tourDuration: 90,
        amenities: ["qoruyucu geyim", "dadim"],
        status: "APPROVED",
      },
      {
        entrepreneurProfileId: verifiedProfile.id,
        name: "Dag Kamp Gecesi",
        description: "Lerik daglarinda kamp ve tonqal gecesi.",
        category: "Kamp",
        address: "Lerik, Azerbaijan",
        lat: 38.780,
        lng: 48.400,
        photos: ["https://picsum.photos/seed/kamp/800/600"],
        price: 60,
        depositAmount: 18,
        tourDuration: 240,
        amenities: ["camping", "tonqal"],
        status: "APPROVED",
      },
      {
        entrepreneurProfileId: verifiedProfile.id,
        name: "At Minme Mektebi",
        description: "Yeni baslayanlar ucun at minme dersleri.",
        category: "At Minme",
        address: "Naxcivan, Azerbaijan",
        lat: 39.210,
        lng: 45.420,
        photos: ["https://picsum.photos/seed/at/800/600"],
        price: 50,
        depositAmount: 15,
        tourDuration: 60,
        amenities: ["mueallim", "tehlukesizlik"],
        status: "APPROVED",
      },
      {
        entrepreneurProfileId: fermerProfile.id,
        name: "Goygol Ferma Gezintisi",
        description: "Ferma turu, heyvanlar ve yerli dadimlar.",
        category: "Ferma",
        address: "Goygol, Azerbaijan",
        lat: 40.585,
        lng: 46.319,
        photos: ["https://picsum.photos/seed/goygol/800/600"],
        price: 40,
        depositAmount: 12,
        tourDuration: 90,
        amenities: ["bələdçi", "dadım"],
        status: "APPROVED",
      },
      {
        entrepreneurProfileId: pendingProfile.id,
        name: "Quba Alma Bagi Gezintisi",
        description: "Alma baglarinda gezinti ve dadim.",
        category: "Bag",
        address: "Quba, Azerbaijan",
        lat: 41.360,
        lng: 48.510,
        photos: ["https://picsum.photos/seed/alma/800/600"],
        price: 30,
        depositAmount: 9,
        tourDuration: 75,
        amenities: ["dadim", "parking"],
        status: "PENDING",
      },
    ],
  });

  const approvedPlaces = await prisma.place.findMany({
    where: { entrepreneurProfileId: verifiedProfile.id },
    orderBy: { createdAt: "asc" },
  });

  const [place1, place2, place3, place4] = approvedPlaces;

  await prisma.booking.createMany({
    data: [
      { userId: tourist1.id, placeId: place1.id, date: new Date(), timeSlot: "10:00", participantCount: 2, totalAmount: 90, depositAmount: 27, status: "COMPLETED" },
      { userId: tourist1.id, placeId: place2.id, date: new Date(), timeSlot: "14:00", participantCount: 1, totalAmount: 35, depositAmount: 10.5, status: "CONFIRMED" },
      { userId: tourist2.id, placeId: place3.id, date: new Date(), timeSlot: "18:00", participantCount: 2, totalAmount: 120, depositAmount: 36, status: "PENDING" },
      { userId: tourist3.id, placeId: place4.id, date: new Date(), timeSlot: "09:00", participantCount: 1, totalAmount: 50, depositAmount: 15, status: "COMPLETED" },
      { userId: tourist2.id, placeId: place1.id, date: new Date(), timeSlot: "12:00", participantCount: 3, totalAmount: 135, depositAmount: 40.5, status: "COMPLETED" },
    ],
  });

  await prisma.review.createMany({
    data: [
      { userId: tourist1.id, placeId: place1.id, rating: 5, body: "Cox gozeldi, mütləq tövsiyə edirəm." },
      { userId: tourist3.id, placeId: place4.id, rating: 4, body: "Dersler aydin idi, muellim yaxsi izah etdi." },
      { userId: tourist2.id, placeId: place1.id, rating: 5, body: "Ferma ab-havasi ela idi." },
    ],
  });

  await prisma.coinTransaction.createMany({
    data: [
      { userId: tourist1.id, amount: 50, reason: "Yer ziyarəti tamamlandı" },
      { userId: tourist1.id, amount: 20, reason: "Rəy yazıldı" },
      { userId: tourist3.id, amount: 50, reason: "Yer ziyarəti tamamlandı" },
      { userId: tourist3.id, amount: 20, reason: "Rəy yazıldı" },
      { userId: tourist2.id, amount: 50, reason: "Yer ziyarəti tamamlandı" },
    ],
  });

  void admin;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
