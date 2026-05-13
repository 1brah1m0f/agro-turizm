export interface Tour {
  id: string;
  agencyName: string;
  agencyInitials: string;
  agencyColor: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  dateRange: string;
  duration: string;
  minPeople: number;
  price: number;
  stopIds: string[];
  routeColor: string;
}

export const TOURS: Tour[] = [
  {
    id: "greenways",
    agencyName: "GreenWays Travel",
    agencyInitials: "GW",
    agencyColor: "#27AE60",
    name: "Qəbələ Lavanda & Arıçılıq Turu",
    rating: 4.8,
    location: "Qəbələ, Azərbaycan",
    description: "Qəbələnin 26 hektar lavanda tarlası, Zarağan arıçılığı və Ləkit bal evini bir tur içində kəşf et.",
    dateRange: "25 may – 26 may",
    duration: "2 gün / 1 gecə",
    minPeople: 8,
    price: 129,
    stopIds: ["essenso_lavender", "tofiqoglu_ariciliq", "lekit_bal_evi"],
    routeColor: "#27AE60",
  },
  {
    id: "naturestep",
    agencyName: "Nature Step",
    agencyInitials: "NS",
    agencyColor: "#3498DB",
    name: "İsmayıllı Kənd & Meyvə Turu",
    rating: 4.6,
    location: "İsmayıllı, Azərbaycan",
    description: "İsmayıllının göl kənarı ferması, alma bağları kotecləri, Lahıcın mis sənətkarlığı.",
    dateRange: "1 iyun – 2 iyun",
    duration: "2 gün / 1 gecə",
    minPeople: 12,
    price: 115,
    stopIds: ["lakeside", "alma_baglari", "lahij"],
    routeColor: "#3498DB",
  },
  {
    id: "azeradventure",
    agencyName: "Azer Adventure",
    agencyInitials: "AA",
    agencyColor: "#E74C3C",
    name: "Şamaxı Şərab & Alpaka Macərası",
    rating: 4.9,
    location: "Şamaxı, Azərbaycan",
    description: "Alpaka ferması, Meysari şərabxanası turu, Ballı Bağça çəllək şərabı dadımı.",
    dateRange: "7 iyun – 8 iyun",
    duration: "2 gün / 1 gecə",
    minPeople: 10,
    price: 139,
    stopIds: ["alpaca", "meysari", "balli_bagca"],
    routeColor: "#E74C3C",
  },
  {
    id: "ruralxp",
    agencyName: "Rural Experience",
    agencyInitials: "RE",
    agencyColor: "#F39C12",
    name: "Lənkəran Cənub Turu",
    rating: 4.5,
    location: "Lənkəran, Azərbaycan",
    description: "Çay plantasiyası, sitrus vadisi, Hirkan milli parkı — Azərbaycanın subtropik cənubu.",
    dateRange: "15 iyun – 17 iyun",
    duration: "3 gün / 2 gecə",
    minPeople: 14,
    price: 185,
    stopIds: ["teafarm", "citrus", "hirkan"],
    routeColor: "#F39C12",
  },
  {
    id: "silk_road",
    agencyName: "Silk Road Tours",
    agencyInitials: "SR",
    agencyColor: "#8E44AD",
    name: "Şəki & Zaqatala Dağ Turu",
    rating: 4.7,
    location: "Şəki, Azərbaycan",
    description: "BioGarden üzvi ferması, Zaqatala Hope Lake, Balakən qoz bağı — qafqaz dağlarının ətəyi.",
    dateRange: "20 iyun – 22 iyun",
    duration: "3 gün / 2 gecə",
    minPeople: 6,
    price: 210,
    stopIds: ["biogarden", "hope_lake", "balaken_qoz"],
    routeColor: "#8E44AD",
  },
];
