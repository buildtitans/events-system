import type {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type { NewOrganizerInput } from "../../types";
import { IAuthorization } from "../../auth/authorization";
import { IGroupLifecycleHandler } from "./types";
import { GroupServiceDb } from "../../services/types";

export class GroupLifecycleHandler implements IGroupLifecycleHandler {
  constructor(
    private readonly api: GroupServiceDb,
    private readonly policy: IAuthorization,
  ) {}

  async createNewGroup(
    user_id: string | undefined | null,
    newGroupInput: NewGroupInputSchemaType,
  ): Promise<
    { ok: true; data: GroupSchemaType } | { ok: false; error: string }
  > {
    const id = this.policy.requireAuthenticated(user_id);

    try {
      const group = await this.api.groups.write.createGroup(newGroupInput, id);

      await this.assignOrganizerToNewGroup({
        user_id: group.organizer_id,
        group_id: group.id,
      });

      return {
        ok: true,
        data: group,
      };
    } catch (err) {
      console.error(err);
      return { ok: false, error: `Unexpected error: ${err}` };
    }
  }

  private async assignOrganizerToNewGroup(
    organizer: NewOrganizerInput,
  ): Promise<GroupMemberSchemaType> {
    return await this.api.groupMembers.write.addOrganizer(organizer);
  }
}
