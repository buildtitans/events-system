import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { UpComingEventsLookup } from "@/src/server/core/service/types";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import {
  NextGroupEventLookupMapType,
  ParticipationsStatePayload,
} from "@/src/lib/store/slices/user/types";

export type UserParticipationsResult = {
  participations: ParticipationsStatePayload;
  lookup: NextGroupEventLookupMapType;
};

export class HydrateUserService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async notifications(): Promise<NotificationSchemaType[]> {
    return await this.trpc.notifications.select.new.query();
  }

  public async participations(): Promise<UserParticipationsResult> {
    const rsvps = await this.rsvps();
    const memberships = await this.memberships();
    const lookup = await this.nextEventsLookup(memberships);

    return {
      participations: { rsvps, memberships },
      lookup,
    };
  }

  private async rsvps(): Promise<RsvpSchemaType[]> {
    return await this.trpc.eventAttendants.select.rsvps.query();
  }

  private async memberships(): Promise<UserMembershipSchemaType[]> {
    return await this.trpc.users.select.memberships.query();
  }

  private async nextEventsLookup(
    memberships: UserMembershipSchemaType[],
  ): Promise<UpComingEventsLookup> {
    const ids = memberships.map((m) => m.group_id);
    return await this.trpc.groups.lookup.nextEvents.query(ids);
  }
}
