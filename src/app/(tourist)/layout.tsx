import TouristSidebar from "@/components/layout/TouristSidebar";

export default function TouristLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#F7F8F5", fontFamily: "var(--font-sans)" }}
    >
      <TouristSidebar />
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
