import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import type { JSX } from "react";

//TODO: render predetermined layouts based on role type & userKind for event drawer contents

export const renderEventDrawer = (
    role: GroupMembersSchemaType["role"]
): JSX.Element | null => {

    switch (role) {
        case "member":
        case "organizer":
        case "anonymous":

        default: {

            return null;
        }
    }

}