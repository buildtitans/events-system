import type { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";


function chunkGroupsIntoPages(groups: GroupsSchemaType, size: number = 6): GroupsSchemaType[] {
    const chunked: GroupsSchemaType[] = []

    for (let i = 0; i < groups.length; i += size) {

        const chunk: GroupsSchemaType = groups.slice(i, i + size);

        chunked.push(chunk);
    }

    return chunked;
};

export { chunkGroupsIntoPages };