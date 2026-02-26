import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
export type CategoryLookupType = Record<string, string[]>;

export function createCategoryLookup(
    groups: GroupsSchemaType
): CategoryLookupType {

    const hash: CategoryLookupType = {};

    for (let i = 0; i < groups.length; i++) {
        let cat_id = groups[i].category_id;
        let arr: string[] = [];
        groups.forEach((group) => {
            if (group.category_id === cat_id) {
                arr.push(group.id);
            }
        })
        if (cat_id) hash[cat_id] = arr
    }
    return hash;
};