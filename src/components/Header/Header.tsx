import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

export default function Header() {
  return (
    <>
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 transition-all ease-linear bg-gradient-to-r from-background via-secondary/30 to-background border-b border-border/50">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-6 bg-border/50"
          />
          <div className="flex items-center gap-4 ml-auto pr-2">
            <ModeToggle className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-accent/50 transition-all duration-200" />
          </div>
        </div>
      </header>
      <Separator className="bg-border/50" />
    </>
  );
}
