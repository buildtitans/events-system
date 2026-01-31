import type { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groupSchema";

export type OrganizerAndUserIdsType = {
    groupId: string | undefined | null,
    organizerId: string | undefined | null
}

function getIdsBySlug(path: string, groups: GroupsSchemaType): OrganizerAndUserIdsType {

    const slug = path.split('/').filter(Boolean).pop();

    const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);

    const groupId = currentGroup?.id;
    const organizerId = currentGroup?.organizer_id

    return { groupId, organizerId }
};

export { getIdsBySlug };