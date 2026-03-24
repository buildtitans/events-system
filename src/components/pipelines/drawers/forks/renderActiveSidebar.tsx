"use client";
import type { JSX } from "react";
import { ActiveSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { RenderGroupSidebar } from "../interfaces/renderGroupSidebar";
import RenderUserAccountMenu from "./renderUserAccountMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type RenderActiveSidebarProps = {
    sidebar: ActiveSidebar,
}

export function RenderActiveSidebar({
    sidebar,
}: RenderActiveSidebarProps): JSX.Element | null {
    const email = useSelector((s: RootState) => s.user.email);

    switch(sidebar) {
        case "group": {
            return (
                <RenderGroupSidebar />
            )
        }

        case "user": {
           return (<RenderUserAccountMenu 
           email={email}
           />)
        }

        case null: {
            return null;
        }

        default: {
            return null;
        }
    }
}