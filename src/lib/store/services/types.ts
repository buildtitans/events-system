import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { EventsPages } from "../slices/events/types";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";

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
  group: GroupSchemaType;
  layout: EventsPages;
  role: GroupMemberSchemaType["role"];
  numMembers: number;
  organizerEmail: string;
  calandar: EventSchemaType[];
  nextEvent: EventSchemaType | undefined;
  category: CategorySchemaType | undefined;
};
