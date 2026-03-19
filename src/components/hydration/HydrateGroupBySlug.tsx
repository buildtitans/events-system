"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  getEmailOfGroupOrganizer,
  getGroupEvents,
  getNumMembers,
  groupOpened,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { EventsPages } from "@/src/lib/store/slices/events/types";
import { useRefreshGroupEvents } from "@/src/lib/hooks/hydration/useRefreshGroupEvents";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { getCurrentRole } from "@/src/lib/store/slices/viewer/PermissionsSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { wait } from "@/src/lib/utils/rendering/wait";

export default function HydrateGroupBySlug({
  slug,
}: {
  slug: string;
}): React.ReactNode {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();
  useRefreshGroupEvents();

  useEffect(() => {
    const handleSyncGroupOpened = (group: GroupSchemaType) => {
      dispatch(
        groupOpened({
          status: "ready",
          data: group,
        }),
      );
    };

    const handleSyncEventsOfGroup = (events: EventsPages) => {
      if (events.length > 0) {
        dispatch(
          getGroupEvents({
            status: "ready",
            data: events,
          }),
        );
        return;
      }
      dispatch(
        getGroupEvents({
          status: "warning",
          message: "No events have been scheduled for this group",
        }),
      );
    };

    const handlePayload = async (
      group: GroupSchemaType | null,
      events: EventsPages,
      role: GroupMemberSchemaType["role"],
      numMembers: number
    ): Promise<void> => {
      if (!group) {
        dispatch(
          groupOpened({
            status: "failed",
            error: "Group hydration error",
          }),
        );
        return;
      }

      dispatch(getNumMembers(numMembers));
      handleSyncGroupOpened(group);
      handleSyncEventsOfGroup(events);
      dispatch(getCurrentRole(role));
    };

    const executeHydration = async () => {
      dispatch(groupOpened({ status: "pending" }));
      dispatch(getGroupEvents({ status: "pending" }));
      dispatch(enqueueSidebar("group"));

      await wait(800);

      const { events, group, role, numMembers } = await syncOpenedGroup(slug);


      if(group) {
        const organizerEmail = await trpcClient.groupMembers.getGroupOrganizerEmail.mutate(group?.id)
        dispatch(getEmailOfGroupOrganizer(organizerEmail.email));
      }


      await handlePayload(group, events, role, numMembers);
    };
    void executeHydration();
  }, [slug, userKind, dispatch]);

  return null;
}
