import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { LOCATIONS } from "@/components/map/locations";
import { REGIONS } from "@/constants/regions";

type ChatMessage = { role: "user" | "assistant"; content: string };

type SearchArgs = {
  query?: string;
  category?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
};

type PlaceResult = {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  price: number | null;
  lat: number | null;
  lng: number | null;
  entrepreneurRegion: string | null;
};

const SYSTEM_PROMPT = `Siz "AgroTour Azerbaijan" platformasinin resmi reqemsal bələdçisisiniz.

Missiya:
- Istifadecileri Azerbaycanda aqroturizm mekanlari ile tanis edin.
- Interaktiv xeritə, birbasa rezervasiya ve kateqoriya filtrlerinin istifadesini izah edin.
- Yerli ferma ve aqro tecrubeleri teşviq edin.

Uslub:
- Həmişə səlis Azerbaijani dilində cavab verin.
- Peşəkar, dost, biznes yonumlu (startup founder estetigi).
- Uzun cumlelerden qacin, məlumatlari aydin bəndlər şəklində verin.

Qaydalar:
- Qiymet qeyd edilende mutleq AZN yazin.
- Mekanlar qeyd edilende rayon/bolge vurğulanmalidir.
- Məlumat yoxdursa uydurmayin.
- Istifadeci "bu sayt nedir?" ya da "siz kimsiniz?" deyerse, platformanin vizyonunu ve xeritə funksiyasini izah edin.`;

const CATEGORY_KEYWORDS: { keywords: string[]; category: string; label: string }[] = [
  { keywords: ["arı", "ari", "arıçılıq", "ariciliq", "bal"], category: "Ariciliq", label: "Arıçılıq" },
  { keywords: ["kamp", "camp", "kamping"], category: "Kamp", label: "Kamp" },
  { keywords: ["at minmə", "at minme", "atçılıq", "horse"], category: "At Minme", label: "At Minmə" },
  { keywords: ["ferma", "farm", "fermalar"], category: "Ferma", label: "Ferma" },
  { keywords: ["bağ", "bag", "orchard", "meyvə", "meyve", "alma"], category: "Bag", label: "Bağ" },
];

const QUERY_KEYWORDS: { keywords: string[]; query: string }[] = [
  { keywords: ["şərab", "sarab", "wine"], query: "üzüm" },
  { keywords: ["üzüm", "uzum"], query: "üzüm" },
  { keywords: ["balıq", "baliq", "balıqçılıq", "baliqcilik"], query: "balıq" },
];

const SEARCH_TRIGGER_WORDS = [
  "azn",
  "manat",
  "qiymət",
  "qiymet",
  "ucuz",
  "baha",
  "category",
  "kateqoriya",
  "rayon",
  "region",
  "bolge",
  "bölgə",
  "xəritə",
  "xerite",
  "mekan",
  "məkan",
];

const priceNumber = (value: string) => Number.parseFloat(value.replace(",", "."));

const extractPriceRange = (text: string): { minPrice?: number; maxPrice?: number } => {
  const normalized = text.toLowerCase();

  const rangeMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:[.,]\d+)?)/);
  if (rangeMatch) {
    const minPrice = priceNumber(rangeMatch[1]);
    const maxPrice = priceNumber(rangeMatch[2]);
    return Number.isFinite(minPrice) && Number.isFinite(maxPrice) ? { minPrice, maxPrice } : {};
  }

  const underMatch = normalized.match(/(under|altında|asagi|aşağı|qədər|qeder|max|<=)\s*(\d+(?:[.,]\d+)?)/);
  if (underMatch) {
    const maxPrice = priceNumber(underMatch[2]);
    return Number.isFinite(maxPrice) ? { maxPrice } : {};
  }

  const overMatch = normalized.match(/(yuxarı|minimum|min|>=)\s*(\d+(?:[.,]\d+)?)/);
  if (overMatch) {
    const minPrice = priceNumber(overMatch[2]);
    return Number.isFinite(minPrice) ? { minPrice } : {};
  }

  const amountMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:azn|manat)/);
  if (amountMatch) {
    const maxPrice = priceNumber(amountMatch[1]);
    return Number.isFinite(maxPrice) ? { maxPrice } : {};
  }

  return {};
};

const extractRegion = (text: string): string | undefined => {
  const normalized = text.toLowerCase();
  return REGIONS.find((region) => normalized.includes(region.toLowerCase()));
};

const extractCategory = (text: string): { category?: string; label?: string } => {
  const normalized = text.toLowerCase();
  for (const entry of CATEGORY_KEYWORDS) {
    const hit = entry.keywords.some((k) => {
      if (k.length <= 3) {
        const wordRegex = new RegExp(`\\b${k}\\b`, "i");
        return wordRegex.test(normalized);
      }
      return normalized.includes(k);
    });
    if (hit) return { category: entry.category, label: entry.label };
  }
  return {};
};

const NAME_QUERY_PATTERNS = [
  "haqqinda melumat ver",
  "haqqında məlumat ver",
  "haqqinda melumat",
  "haqqında məlumat",
  "haqqinda",
  "haqqında",
  "barede",
  "barədə",
  "melumat ver",
  "məlumat ver",
];

const extractNameQuery = (text: string): string | undefined => {
  const normalized = text
    .toLowerCase()
    .replace(/["'“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!NAME_QUERY_PATTERNS.some((pattern) => normalized.includes(pattern))) {
    return undefined;
  }

  let cleaned = normalized;
  for (const pattern of NAME_QUERY_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ").trim();
  }

  cleaned = cleaned.replace(/[^a-z0-9əöğışçü\s-]/gi, " ").replace(/\s+/g, " ").trim();
  if (cleaned.length < 3) return undefined;
  return cleaned;
};

const extractQuery = (text: string): string | undefined => {
  const normalized = text.toLowerCase();
  for (const entry of QUERY_KEYWORDS) {
    if (entry.keywords.some((k) => normalized.includes(k))) return entry.query;
  }
  return undefined;
};

const isSearchRequest = (text: string) => {
  const normalized = text.toLowerCase();
  if (SEARCH_TRIGGER_WORDS.some((word) => normalized.includes(word))) return true;
  if (extractRegion(text)) return true;
  if (extractCategory(text).category) return true;
  if (extractQuery(text)) return true;
  if (extractNameQuery(text)) return true;
  if (/(\d+(?:[.,]\d+)?)\s*(azn|manat)/i.test(text)) return true;
  return false;
};

const mapRegion = (address: string, fallback?: string | null) => {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) return parts[0] || parts[1];
  return parts[0] || fallback || "Azərbaycan";
};

const shortText = (text: string, max = 100) => {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}…`;
};

const parsePrice = (value?: string) => {
  if (!value) return null;
  const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const numeric = Number.parseFloat(match[1]);
  return Number.isFinite(numeric) ? numeric : null;
};

const staticCategoryForType = (type: string) => {
  switch (type) {
    case "beekeeping":
      return "Ariciliq";
    case "lakeside":
      return "Kamp";
    case "animal":
      return "At Minme";
    case "farm":
      return "Ferma";
    case "citrus":
      return "Bag";
    case "vineyard":
      return "Uzum";
    case "fish":
      return "Baliqcilik";
    case "guesthouse":
      return "Qonaq evi";
    case "tea":
      return "Cay";
    case "lavender":
      return "Lavanda";
    case "park":
      return "Park";
    case "cultural":
      return "Kend";
    default:
      return "Mekan";
  }
};

const searchStaticLocations = (args: SearchArgs): PlaceResult[] => {
  const regionNeedle = (args.region ?? "").toLowerCase();
  const categoryNeedle = (args.category ?? "").toLowerCase();
  const queryNeedle = (args.query ?? "").toLowerCase();

  return LOCATIONS.filter((loc) => {
    if (regionNeedle) {
      const regionMatch = loc.region.toLowerCase().includes(regionNeedle) || loc.village.toLowerCase().includes(regionNeedle);
      if (!regionMatch) return false;
    }

    if (categoryNeedle) {
      const cat = staticCategoryForType(loc.type).toLowerCase();
      if (!cat.includes(categoryNeedle)) return false;
    }

    if (queryNeedle) {
      const haystack = [loc.name, loc.description, loc.activities.join(" "), loc.products.join(" ")].join(" ").toLowerCase();
      if (!haystack.includes(queryNeedle)) return false;
    }

    const numericPrice = parsePrice(loc.price);
    if (args.minPrice && (!numericPrice || numericPrice < args.minPrice)) return false;
    if (args.maxPrice && (!numericPrice || numericPrice > args.maxPrice)) return false;

    return true;
  }).map((loc) => ({
    id: `static-${loc.id}`,
    name: loc.name,
    description: loc.description,
    category: staticCategoryForType(loc.type),
    address: `${loc.region}, ${loc.village}`,
    price: parsePrice(loc.price),
    lat: loc.lat,
    lng: loc.lng,
    entrepreneurRegion: loc.region,
  }));
};

const searchServices = async (args: SearchArgs): Promise<PlaceResult[]> => {
  const andFilters: Array<Record<string, unknown>> = [];

  if (args.region) {
    andFilters.push({
      OR: [
        { address: { contains: args.region, mode: "insensitive" } },
        { entrepreneur: { location: { contains: args.region, mode: "insensitive" } } },
      ],
    });
  }

  if (args.query) {
    andFilters.push({
      OR: [
        { name: { contains: args.query, mode: "insensitive" } },
        { description: { contains: args.query, mode: "insensitive" } },
      ],
    });
  }

  const where: Record<string, unknown> = {
    status: "APPROVED",
    ...(args.category ? { category: { contains: args.category, mode: "insensitive" } } : {}),
    ...(args.minPrice || args.maxPrice
      ? { price: { ...(args.minPrice ? { gte: args.minPrice } : {}), ...(args.maxPrice ? { lte: args.maxPrice } : {}) } }
      : {}),
    ...(andFilters.length ? { AND: andFilters } : {}),
  };

  const dbResults = await prisma.place.findMany({
    where,
    include: { entrepreneur: { select: { location: true } } },
    take: 6,
    orderBy: { price: "asc" },
  });

  const staticResults = searchStaticLocations(args);

  const normalizedDb = dbResults.map((place) => ({
    id: place.id,
    name: place.name,
    description: place.description,
    category: place.category,
    address: place.address,
    price: place.price,
    lat: place.lat ?? null,
    lng: place.lng ?? null,
    entrepreneurRegion: place.entrepreneur?.location ?? null,
  }));

  const combined = [...normalizedDb, ...staticResults];
  const uniqueByName = new Map<string, PlaceResult>();
  combined.forEach((item) => {
    const key = item.name.trim().toLowerCase();
    if (!uniqueByName.has(key)) uniqueByName.set(key, item);
  });

  return Array.from(uniqueByName.values())
    .sort((a, b) => {
      if (a.price == null && b.price == null) return 0;
      if (a.price == null) return 1;
      if (b.price == null) return -1;
      return a.price - b.price;
    })
    .slice(0, 8);
};

const buildSearchReply = (places: PlaceResult[], args: SearchArgs & { categoryLabel?: string }) => {
  if (!places.length) {
    return "Bu kriteriyalara uyğun məkan tapılmadı. Zəhmət olmasa filtr və ya bölgəni dəyişin.";
  }

  const scopeParts: string[] = [];
  if (args.categoryLabel) scopeParts.push(`${args.categoryLabel} üzrə`);
  if (args.region) scopeParts.push(`${args.region} bölgəsində`);
  const scope = scopeParts.length ? ` ${scopeParts.join(" ")}` : "";

  const header = `Əlbəttə!${scope} ən uyğun yerləri tapdım:`;

  const bullets = places.map((place) => {
    const region = mapRegion(place.address, place.entrepreneurRegion);
    const mapQuery = place.lat && place.lng
      ? `${place.lat},${place.lng}`
      : encodeURIComponent(place.address || region);
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    const desc = shortText(place.description, 110);
    const priceLabel = place.price == null ? "Qiymət: Məlum deyil" : `Qiymət: ${place.price} AZN`;
    return `- 📍 ${place.name} (${region}) — ${desc} | ${priceLabel} | Xəritə: ${mapLink}`;
  });

  return [header, "", ...bullets].join("\n");
};

const needsVisionAnswer = (text: string) => {
  const normalized = text.toLowerCase();
  return [
    "bu sayt",
    "bu platforma",
    "siz kimsiniz",
    "siz kim",
    "kimisiniz",
    "sayt nədir",
    "sayt nedir",
    "platforma nədir",
    "platforma nedir",
    "sayt nə üçündür",
    "sayt ne ucundur",
    "platforma nə üçündür",
    "platforma ne ucundur",
  ].some((k) => normalized.includes(k));
};

const buildVisionReply = () => {
  return [
    "Əlbəttə! AgroTour Azerbaijan platformasının məqsədi:",
    "",
    "- Azərbaycanın ilk interaktiv aqroturizm xəritəsi kimi şəhər sakinlərini kənd həyatı ilə birləşdirmək",
    "- Orqanik məhsullar, yerli fermalar və aqro təcrübələri bir araya gətirmək",
    "- Xəritə üzərindən məkanları görmək, qiymət və xidmətləri müqayisə etmək, birbaşa rezervasiya etmək",
  ].join("\n");
};

const buildPlaceSummaryPrompt = (places: PlaceResult[]) => {
  const facts = places.map((place, index) => {
    const region = mapRegion(place.address, place.entrepreneurRegion);
    return [
      `#${index + 1}`,
      `Ad: ${place.name}`,
      `Region: ${region}`,
      `Kateqoriya: ${place.category}`,
      `Aciqlama: ${place.description}`,
      `Qiymet: ${place.price == null ? "Məlum deyil" : `${place.price} AZN`}`,
    ].join(" | ");
  });

  return [
    "Aşağıdakı faktlara əsasən qısa və dəqiq xülasə yaz.",
    "Yalnız verilən məlumatlardan istifadə et, əlavə fakt uydurma.",
    "Hər məkan üçün 1-2 cümləlik xülasə yaz və regionu mütləq vurğula.",
    "Format: hər məkan üçün ayrı bənd (•).",
    "",
    ...facts,
  ].join("\n");
};

const getGeminiModel = () => {
  const apiKey = (process.env.GEMINI_API_KEY ?? "").trim();
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = (process.env.GEMINI_MODEL ?? "gemini-flash-latest").trim();
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
  });
};

const generateSummary = async (places: PlaceResult[]) => {
  const model = getGeminiModel();
  if (!model) return null;
  const prompt = buildPlaceSummaryPrompt(places);
  const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
  const reply = result.response.text().trim();
  return reply || null;
};

export async function POST(req: Request) {
  try {
    const { message, history } = (await req.json()) as { message?: string; history?: ChatMessage[] };
    const text = (message ?? "").trim();
    if (!text) return Response.json({ reply: "Zəhmət olmasa sorğunuzu yazın." }, { status: 400 });

    if (needsVisionAnswer(text)) {
      return Response.json({ reply: buildVisionReply() });
    }

    if (isSearchRequest(text)) {
      const { minPrice, maxPrice } = extractPriceRange(text);
      const region = extractRegion(text);
      const { category, label: categoryLabel } = extractCategory(text);
      const query = extractQuery(text) ?? extractNameQuery(text);
      const places = await searchServices({ query, category, region, minPrice, maxPrice });
      const baseReply = buildSearchReply(places, { categoryLabel, region, minPrice, maxPrice, query });
      if (!places.length) return Response.json({ reply: baseReply });

      try {
        const summary = await generateSummary(places);
        if (summary) {
          return Response.json({ reply: `${baseReply}\n\nQısa xülasə:\n${summary}` });
        }
      } catch {
        // Fallback to base reply if summary fails.
      }

      return Response.json({ reply: baseReply });
    }

    const model = getGeminiModel();
    if (!model) return Response.json({ reply: "Gemini API açarı tapılmadı. Zəhmət olmasa GEMINI_API_KEY əlavə edin." }, { status: 500 });

    const contents = (Array.isArray(history) ? history : []).map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));

    contents.push({ role: "user", parts: [{ text }] });

    const result = await model.generateContent({ contents });
    const reply = result.response.text().trim();
    return Response.json({ reply: reply || "Bu məlumatı tapa bilmədim. Zəhmət olmasa sorğunu bir az fərqli formada yazın." });
  } catch (error) {
    console.error(error);
    return Response.json({ reply: "Server xətası baş verdi. Zəhmət olmasa yenidən cəhd edin." }, { status: 500 });
  }
}
