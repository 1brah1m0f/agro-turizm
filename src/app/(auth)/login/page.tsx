import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-8 shadow-card-hover border border-accent/10">
        <h1 className="font-serif text-2xl font-bold text-text-light mb-1">Xoş gəlmisiniz</h1>
        <p className="text-muted text-sm mb-8">Hesabınıza daxil olun</p>

        <form className="space-y-4">
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">E-poçt</label>
            <Input type="email" placeholder="email@nümunə.az" />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Şifrə</label>
            <div className="relative">
              <Input type="password" placeholder="••••••••" className="pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent">
                <Eye size={16} />
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Link href="#" className="text-xs text-muted hover:text-accent">Şifrəni unutdum?</Link>
          </div>
          <Button className="w-full" size="lg" variant="gradient">Daxil ol</Button>
        </form>

        <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-muted">
          Hesab yoxdur?{" "}
          <Link href="/register" className="text-accent hover:underline font-semibold">Qeydiyyat</Link>
        </div>
      </div>
    </div>
  );
}
