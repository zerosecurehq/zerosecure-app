import { SidebarProvider } from "../ui/sidebar";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}