"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

export default function Header() {


    return (
        <>
            <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">

                <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />

                    <div className="flex items-center gap-4 ml-auto pr-2">
                        {/* Botão dark mode */}
                        <ModeToggle className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                </div>
            </header>
        </>
    )
}
