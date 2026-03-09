"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import { ActiveSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { RenderGroupSidebar } from "../interfaces/renderGroupSidebar";

type RenderActiveSidebarProps = {
    sidebar: ActiveSidebar
}

export function RenderActiveSidebar({
    sidebar
}: RenderActiveSidebarProps) {

    switch(sidebar) {
        case "group": {
            return (
                <RenderGroupSidebar />
            )
        }

        case "user": {
            
        }

        default: {
            return null;
        }
    }
}