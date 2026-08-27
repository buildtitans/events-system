import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { UpComingEventsLookup } from "@/src/server/core/service/types";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import {
  NextGroupEventLookupMapType,
  ParticipationsStatePayload,
} from "@/src/lib/store/slices/user/types";
import { AttendanceDictionaryType } from "@/src/lib/types/hooks/types";

interface IHydrateUserService {
  recoverSession(): Promise<{
    session: {
      id: string;
      expires_at: Date;
      user_id: string;
    };
    email: string;
  } | null>;
  notifications(): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }>;
  participations(): Promise<UserParticipationsResult>;
  attendance(): Promise<AttendanceDictionaryType>;
}

export type UserParticipationsResult = {
  participations: ParticipationsStatePayload;
  lookup: NextGroupEventLookupMapType;
};

export class HydrateUserService implements IHydrateUserService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async recoverSession(): Promise<{
    session: {
      id: string;
      expires_at: Date;
      user_id: string;
    };
    email: string;
  } | null> {
    return await this.trpc.auth.status.recover.query();
  }

  public async notifications(): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }> {
    return await this.trpc.notifications.select.newAndViewed.query();
  }

  public async participations(): Promise<UserParticipationsResult> {
    return this.participationsMetaData();
  }

  public async attendance(): Promise<AttendanceDictionaryType> {
    return await this.trpc.users.select.attendanceDictionary.query();
  }

  private async participationsMetaData(): Promise<UserParticipationsResult> {
    const [rsvps, lookup, memberships] = await Promise.all([
      this.rsvps(),
      this.nextEventsLookup(),
      this.memberships(),
    ]);

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

  private async nextEventsLookup(): Promise<UpComingEventsLookup> {
    return await this.trpc.groups.lookup.nextEvents.query();
  }
}
