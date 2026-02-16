import { RootState } from "@/src/lib/store";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RenderSidebarContents } from "./renderAuthenticatedSidebar";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";


export const SidebarPipeline = (group_id: GroupSchemaType["id"]): JSX.Element | null => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const access = useSelector((s: RootState) => s.groupMembers.accessPermissions);
    const role = access[group_id];


    switch (userKind) {
        case "authenticated":
            return (
                RenderSidebarContents(role, group_id)
            )
        case "anonymous":
            return null

        default: {
            return null;
        }
    }
};