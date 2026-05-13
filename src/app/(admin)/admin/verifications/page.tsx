import { CheckCircle, XCircle, Eye, Clock, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const queue = [
  {
    id: "1", business: "Şəki Üzüm Ferması", owner: "Elçin Həsənov", date: "12 Noy 2024",
    docs: { id: true, photos: true, location: false, phone: true },
  },
  {
    id: "2", business: "Quba Alma Bağı", owner: "Nigar Əliyeva", date: "11 Noy 2024",
    docs: { id: true, photos: true, location: true, phone: true },
  },
  {
    id: "3", business: "Gəncə Kamp Sahəsi", owner: "Tural Hüseynov", date: "10 Noy 2024",
    docs: { id: true, photos: false, location: false, phone: true },
  },
];

const docLabels: Record<string, string> = { id: "Şəxsiyyət", photos: "Şəkillər", location: "Məkan", phone: "Telefon" };

export default function VerificationsPage() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Sahibkar Yoxlaması</h1>

      <div className="space-y-4">
        {queue.map(item => {
          const allDone = Object.values(item.docs).every(Boolean);
          return (
            <div key={item.id} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-text-light">{item.business}</h3>
                  <p className="text-muted text-sm">{item.owner} · {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {allDone
                    ? <Badge variant="accent" className="text-xs"><Check size={10} /> Tam</Badge>
                    : <Badge variant="amber" className="text-xs"><Clock size={10} /> Natamam</Badge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 my-4">
                {Object.entries(item.docs).map(([key, done]) => (
                  <span key={key} className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full border ${
                    done ? "border-accent/30 text-accent bg-accent/5" : "border-red-500/30 text-red-400 bg-red-500/5"
                  }`}>
                    {done ? <CheckCircle size={10} /> : <X size={10} />}
                    {docLabels[key]}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors">
                  <Eye size={14} /> Yoxla
                </button>
                <button className="flex items-center gap-1.5 text-sm text-green-400 border border-green-500/30 rounded-lg px-3 py-2 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                  <CheckCircle size={14} /> Təsdiqlə
                </button>
                <button className="flex items-center gap-1.5 text-sm text-red-400 border border-red-500/30 rounded-lg px-3 py-2 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                  <XCircle size={14} /> Rədd et
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
