import { RootState } from "@/src/lib/store";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { renderSidebarContents } from "./renderAuthenticatedSidebar";
import { GroupSchemaType } from "@/src/schemas/groupSchema";


export const sidebarPipeline = (group_id: GroupSchemaType["id"]): JSX.Element | null => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const access = useSelector((s: RootState) => s.groupMembers.accessPermissions);
    const role = access[group_id];

    switch (userKind) {
        case "authenticated":
            return (
                renderSidebarContents(role, group_id)
            )
        case "anonymous":
            return null

        default: {
            return null;
        }
    }
};