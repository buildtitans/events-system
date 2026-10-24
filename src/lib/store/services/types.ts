import { GroupHydratedSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventsPages } from "../slices/events/types";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";

export type SyncOpenGroupPayload =
  | {
      ok: true;
      data: OpenedGroupPayload;
    }
  | {
      ok: false;
      error: "Failed to hydrate group selected";
    };

export type OpenedGroupPayload = {
  hydrated: GroupHydratedSchemaType;
  layout: EventsPages;
  role: GroupMemberSchemaType["role"];
  calandar: TimelineElementSchemaType[];
};
