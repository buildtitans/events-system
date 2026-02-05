import { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groupSchema";
import { EventSchemaType } from "@/src/schemas/eventSchema";


function getGroupSlugRoute(groups: GroupsSchemaType, event: EventSchemaType | null): string {
    if (!event) {
        return "/"
    }
    const group = groups.find((group) =>
        group.id === event?.group_id
    ) as GroupSchemaType;
    const route = `/group/${group.slug}`;
    return route
};

export { getGroupSlugRoute };