import type { NewEventInput } from "@/src/lib/types/hooks/types";
import { getPicDate } from "@/src/lib/utils/dates/getPicDate";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export function createInitialNewEventState(
  group_id: GroupSchemaType["id"],
): NewEventInput {
  return {
    title: "",
    description: "",
    starts_at: "",
    group_id: group_id,
    img: `https://picsum.photos/800/450?random=${getPicDate()}`,
    meeting_location: "",
    tag: null,
  };
}
