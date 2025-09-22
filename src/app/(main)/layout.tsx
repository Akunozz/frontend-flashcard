import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider className="pl-2">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="p-4 min-h-dvh">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
