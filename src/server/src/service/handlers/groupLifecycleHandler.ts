import type {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { DBClient } from "../../db";
import type { NewOrganizerInput } from "../types";
import { AuthorizationService } from "../services/authorizationService";

export class GroupLifecycleHandler {
  constructor(
    private readonly api: DBClient,
    private readonly policy: AuthorizationService,
  ) {}

  async createNewGroup(
    user_id: string | undefined,
    newGroupInput: NewGroupInputSchemaType,
  ): Promise<GroupSchemaType> {
    const id = this.policy.requireAuthenticated(user_id);

    const group = await this.api.groups.createGroup(newGroupInput, id);

    await this.assignOrganizerToNewGroup({
      user_id: group.organizer_id,
      group_id: group.id,
    });

    return group;
  }

  private async assignOrganizerToNewGroup(
    organizer: NewOrganizerInput,
  ): Promise<GroupMemberSchemaType> {
    return await this.api.groupMembers.addOrganizer(organizer);
  }
}
