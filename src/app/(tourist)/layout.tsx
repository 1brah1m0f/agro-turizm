import TouristSidebar from "@/components/layout/TouristSidebar";
import TouristNav from "@/components/layout/TouristNav";

export default function TouristLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-primary">
      <TouristSidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      <TouristNav />
    </div>
  );
}
