import type { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groups/groupSchema";

export type OrganizerAndUserIdsType = {
    groupId: string | undefined | null,
    organizerId: string | undefined | null,
    name: string | undefined | null
}

function getIdsAndNameBySlug(path: string, groups: GroupsSchemaType): OrganizerAndUserIdsType {

    const slug = path.split('/').filter(Boolean).pop();

    const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);

    const groupId = currentGroup?.id;
    const organizerId = currentGroup?.organizer_id;
    const name = currentGroup?.name;

    return { groupId, organizerId, name }
};

export { getIdsAndNameBySlug };