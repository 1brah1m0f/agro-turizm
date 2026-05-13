import { Star, Flag, Trash2, Bell, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

const reviews = [
  { id: "1", tourist: "Nigar Ə.", place: "Şəki Üzüm Bağı", date: "13 Noy", rating: 5, text: "Fantastik təcrübə idi! Ferma sahibi çox mehriban.", reports: 0, status: "ok" },
  { id: "2", tourist: "Anon123", place: "Quba Alma Bağı", date: "12 Noy", rating: 1, text: "Reklam spamu... !!!click here!!! fake", reports: 3, status: "flagged" },
  { id: "3", tourist: "Rauf M.", place: "Gəncə Kamp", date: "11 Noy", rating: 4, text: "Güzəl yer, uşaqlar çox sevdi.", reports: 0, status: "ok" },
  { id: "4", tourist: "Murad K.", place: "Qax Dağ Ferması", date: "10 Noy", rating: 2, text: "Rəhbər gec gəldi, narazıyıq.", reports: 1, status: "flagged" },
];

export default function AdminReviewsPage() {
  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Rəy Moderasiyası</h1>

      <div className="bg-card rounded-xl shadow-card border border-accent/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-xs text-muted">
              <th className="px-4 py-3 font-semibold">Turist</th>
              <th className="px-4 py-3 font-semibold hidden md:table-cell">Məkan</th>
              <th className="px-4 py-3 font-semibold hidden lg:table-cell">Rəy</th>
              <th className="px-4 py-3 font-semibold">Reytinq</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(rev => (
              <tr key={rev.id} className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-text-light font-medium">{rev.tourist}</p>
                    <p className="text-muted text-xs">{rev.date}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted text-xs">{rev.place}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-muted text-xs line-clamp-2 max-w-xs">{rev.text}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-accent text-accent" />
                    <span className="text-text-light text-xs">{rev.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {rev.status === "flagged"
                    ? <Badge variant="red" className="text-[10px] gap-1"><Flag size={8} /> {rev.reports} şikayət</Badge>
                    : <Badge variant="accent" className="text-[10px] gap-1"><CheckCircle size={8} /> Təmiz</Badge>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg border border-muted/20 flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors" title="Burax">
                      <CheckCircle size={13} />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/5 transition-colors" title="Sil">
                      <Trash2 size={13} />
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/5 transition-colors" title="Xəbərdar et">
                      <Bell size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
