import { trpcClient } from "@/src/trpc/trpcClient";
import type {
  ParticipationsStatePayload,
  NextGroupEventLookupMapType,
} from "../slices/user/types";

export type UserParticipationsResult = {
  participations: ParticipationsStatePayload;
  lookup: NextGroupEventLookupMapType;
};

export async function syncUserParticipations(): Promise<UserParticipationsResult> {
  const rsvps = await trpcClient.eventAttendants.getUserRsvpdEvents.mutate();

  const memberships = await trpcClient.users.userMemberships.mutate();

  const ids = memberships.map((m) => m.group_id);

  const lookup = await trpcClient.groups.getNextGroupEventLookup.mutate(ids);

  const participations = { rsvps, memberships };

  return { participations, lookup };
}
