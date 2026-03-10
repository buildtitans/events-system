'use client';
import UserAccountMenu from "@/src/components/ui/menus/userAccountMenu";
import SidebarSkeleton from "@/src/components/ui/skeletons/sidebarSkeleton";
import type { UserEmailType } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";


export default function RenderUserAccountMenu(
   { email} : {email: UserEmailType}
): JSX.Element | null{

    switch(email.status) {
        case "pending": {
            return (
                <SidebarSkeleton />
            )
        }
        
case "ready": {
    return (
        <UserAccountMenu email={email.data} />
    )
}

        default: {
            return null;
        }
    }
}
