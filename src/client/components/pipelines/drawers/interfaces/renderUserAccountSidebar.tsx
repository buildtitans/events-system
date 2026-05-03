"use client";
import type { JSX } from "react";
import type { RootState } from "@/src/lib/store";
import { shallowEqual, useSelector } from "react-redux";
import SidebarSkeleton from "@/src/client/components/ui/skeletons/sidebarSkeleton";
import UserAccountSidebarMenu from "@/src/client/components/ui/menus/userAccountSidebarMenu";


export function RenderUserAccountSidebar(): JSX.Element {
    const { email, myGroups, participations } = useSelector((s:RootState) => s.user, shallowEqual);
     

    if((email.status !== "ready") || (myGroups.status !== "ready" || (participations.status !== "ready"))) {


        return (
            <SidebarSkeleton />
        )
    }


    return (
        <UserAccountSidebarMenu />
    )
}