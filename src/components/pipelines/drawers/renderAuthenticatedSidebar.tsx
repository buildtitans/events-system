import JoinGroupButton from "../../ui/buttons/joinGroupButton";
import GroupOranizerOnly from "../../sections/group/GroupOrganizerOnly";
import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import type { JSX } from "react";
import MemberActionsMenu from "../../ui/menus/memberActionsMenu";

export const RenderSidebarContents = (
    role: GroupMembersSchemaType["role"],
    group_id: GroupMembersSchemaType["group_id"]
): JSX.Element | null => {

    switch (role) {
        case "organizer":
            return (
                <GroupOranizerOnly
                    roleType={role}
                />
            );

        case "anonymous":
            return (<JoinGroupButton
                group_id={group_id}
            />)

        case "member":
            return (
                <MemberActionsMenu />
            )


        default: {
            return null;
        }

    }
}