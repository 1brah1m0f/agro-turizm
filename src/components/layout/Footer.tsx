import Link from "next/link";
import { Leaf, Globe } from "lucide-react";

const columns = [
  { title: "Platforma", links: ["Necə işləyir", "Məkanlar", "Fəaliyyətlər", "Koin Sistemi", "Mobil Tətbiq"] },
  { title: "Sahibkarlar", links: ["Qoşulun", "Doğrulama Prosesi", "Analitika", "Dəstək", "Uğur Hekayələri"] },
  { title: "Şirkət", links: ["Haqqımızda", "Komanda", "Karyera", "Bloq", "Əlaqə"] },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-accent/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-serif font-bold text-xl text-text-dark">FarMorfX</span>
            </div>
            <p className="font-serif text-muted italic text-sm">Kəndi Yenidən Kəşf Et</p>
            <div className="flex items-center gap-3 pt-2">
              {["Instagram", "Facebook", "LinkedIn", "YouTube"].map(label => (
                <button key={label} className="text-muted hover:text-accent transition-colors" title={label}>
                  <Globe size={18} />
                </button>
              ))}
            </div>
            <p className="text-muted text-xs pt-2">© 2024 FarMorfX. Bütün hüquqlar qorunur.</p>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-text-dark font-semibold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-muted text-sm hover:text-accent transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-accent/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-xs text-muted">
          <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-accent transition-colors">Cookie Siyasəti</Link>
        </div>
      </div>
    </footer>
  );
}
