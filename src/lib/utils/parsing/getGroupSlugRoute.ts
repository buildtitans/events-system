import { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";


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