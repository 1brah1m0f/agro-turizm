# AgroFlow - Azəraycan Aqroturizm Platforması

**Canlı sayt:** [farmorfx.vercel.app](https://farmorfx.vercel.app)

Azərbaycanda aqroturizmi inkişaf etdirən platforma. Turistlər kənd yerlərindəki ferma, bağ və aqroturizm yerlərini tapır, bron edir. Sahibkarlar öz yerlərini əlavə edib idarə edir.

---

## Necə işləyir

**Tourist (Turist)**
- Xəritədə yerləri tap
- Fotolara, qiymətlərə, rəylərə bax
- Bron et, QR kod al
- Rəy yaz, coin qazan

**Sahibkar (Entrepreneur)**
- Qeydiyyatdan keç, biznesini təsdiqlət
- Yerlər əlavə et (foto, qiymət, koordinat)
- Bronları idarə et, analitikaya bax

**Admin**
- İstifadəçiləri, yərləri, rəyləri idarə et
- Sahibkar təsdiqləmələrini icra et

---

## Texnologiyalar

| Texnologiya | İstifadə |
|---|---|
| Next.js 16 | Full-stack framework |
| React 19 | UI |
| Tailwind CSS v4 | Dizayn |
| Prisma v7 + PostgreSQL | Verilənlər bazası |
| NextAuth v5 | Autentifikasiya |
| Google Maps API | Xəritə |
| Gemini AI | AI tövsiyələr |
| Gemini AI | ChatBot |
| Vercel | Hosting |

---

## Lokal İşə Salma

### Tələblər
- Node.js 20+
- PostgreSQL verilənlər bazası (məs. [Neon](https://neon.tech))

### Addımlar

```bash
# 1. Asılılıqları yüklə
npm install

# 2. Mühit dəyişənlərini qur
cp .env.local.example .env.local
# .env.local faylını doldur (aşağıya bax)

# 3. Verilənlər bazasını hazırla
npx prisma db push
npm run seed

# 4. Serveri işə sal
npm run dev
```

Brauzer: [http://localhost:3000](http://localhost:3000)

### `.env.local` nümunəsi

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?pgbouncer=true&connection_limit=1
NEXTAUTH_SECRET=gizli-acarin-bura-yaz
NEXTAUTH_URL=http://localhost:3000
```

---

## Layihə Strukturu

```
src/
├── app/
│   ├── (tourist)/      # Turist səhifələri
│   ├── (entrepreneur)/ # Sahibkar paneli
│   ├── (admin)/        # Admin paneli
│   ├── (auth)/         # Giriş / Qeydiyyat
│   └── api/            # API endpointlər
├── components/         # UI komponentlər
├── lib/                # Prisma, auth, utils
└── store/              # Zustand state
```

---

## İstifadəçi Rolları

| Rol | Giriş |
|---|---|
| Tourist | Qeydiyyat zamanı default |
| Entrepreneur | Qeydiyyat + admin təsdiqi |
| Admin | Manual təyin edilir |

---

## Töhfə

1. Fork et
2. Branch aç: `git checkout -b feature/adi`
3. Commit et: `git commit -m "feat: ..."`
4. PR aç

---

## Lisenziya

MIT
