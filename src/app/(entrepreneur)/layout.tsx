import EntrepreneurSidebar from "@/components/layout/EntrepreneurSidebar";

export default function EntrepreneurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-primary">
      <EntrepreneurSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
