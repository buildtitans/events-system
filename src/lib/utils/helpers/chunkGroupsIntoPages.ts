import type { GroupsSchemaType } from "@/src/schemas/groupSchema";


function chunkGroupsIntoPages(groups: GroupsSchemaType, size: number = 8): GroupsSchemaType[] {
    const chunked: GroupsSchemaType[] = []


    for (let i = 0; i < groups.length; i += size) {

        let chunk: GroupsSchemaType = groups.slice(i, size);

        chunked.push(chunk);
    }

    return chunked;
};

export { chunkGroupsIntoPages };