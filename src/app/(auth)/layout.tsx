import { Leaf } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col relative overflow-hidden">
      {/* Bg orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <div className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-serif font-bold text-lg text-text-dark">FarMorfX</span>
        </Link>
        <button className="text-muted text-sm hover:text-accent transition-colors">AZ | EN</button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        {children}
      </div>
    </div>
  );
}
