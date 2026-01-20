import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import type { CategoryMap } from "@/src/components/ui/stack/groupsContainer";

function getCategoryName(category_id: GroupSchemaType["category_id"], map: CategoryMap): string | null {
    if (!category_id) return null;
    const name = map.get(category_id) ?? null;
    return name
};

export { getCategoryName };