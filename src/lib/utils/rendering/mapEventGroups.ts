import type { GroupNameByGroupID } from "@/src/lib/store/slices/EventsSlice";
import {
    GroupSchemaType,
    GroupsSchemaType
} from "@/src/schemas/groupSchema";

function mapEventGroups(groups: GroupsSchemaType): GroupNameByGroupID {

    let groupNameById: GroupNameByGroupID = {}


    groups.forEach((group: GroupSchemaType) => {

        groupNameById[group.id] = group.name;
    });

    return groupNameById;
};


export { mapEventGroups };