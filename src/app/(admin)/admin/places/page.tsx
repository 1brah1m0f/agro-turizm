import { CheckCircle, XCircle, Eye, Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const places = [
  { id: "1", name: "Gəncə Yaşıl Ferma", category: "Fermalar", owner: "Murad K.", date: "12 Noy", status: "pending", emoji: "🌿" },
  { id: "2", name: "Lənkəran Çay Bağı", category: "Meyvə Yığımı", owner: "Samirə A.", date: "11 Noy", status: "pending", emoji: "🍵" },
  { id: "3", name: "Qobustan At Ferması", category: "At Minmə", owner: "Vüsal H.", date: "10 Noy", status: "approved", emoji: "🐴" },
  { id: "4", name: "Naxçıvan Üzüm Bağı", category: "Fermalar", owner: "Anar R.", date: "9 Noy", status: "rejected", emoji: "🍇" },
];

const statusMap = {
  pending: { label: "Gözlənilir", badge: "amber" as const },
  approved: { label: "Təsdiqləndi", badge: "accent" as const },
  rejected: { label: "Rədd edildi", badge: "red" as const },
};

export default function AdminPlacesPage() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Məkan Təsdiqləri</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {places.map(place => {
          const cfg = statusMap[place.status as keyof typeof statusMap];
          return (
            <div key={place.id} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-dark flex items-center justify-center text-2xl flex-shrink-0">{place.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-text-light">{place.name}</h3>
                    <Badge variant={cfg.badge} className="text-[10px] flex-shrink-0">{cfg.label}</Badge>
                  </div>
                  <p className="text-muted text-xs">{place.category} · {place.owner}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar size={10} className="text-muted" />
                    <span className="text-muted text-xs">{place.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-primary/10">
                <button className="flex items-center gap-1.5 text-xs text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors flex-1 justify-center">
                  <Eye size={13} /> Bax
                </button>
                {place.status === "pending" && (
                  <>
                    <button className="flex items-center gap-1.5 text-xs text-green-400 border border-green-500/30 rounded-lg px-3 py-2 hover:bg-green-500/5 transition-colors flex-1 justify-center">
                      <CheckCircle size={13} /> Təsdiqlə
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg px-3 py-2 hover:bg-red-500/5 transition-colors flex-1 justify-center">
                      <XCircle size={13} /> Rədd et
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
