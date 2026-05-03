"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  getEmailOfGroupOrganizer,
  getFlattenedGroupEvents,
  getGroupEvents,
  getGroupHistory,
  getNumMembers,
  groupOpened,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { EventsPages } from "@/src/lib/store/slices/events/types";
import { useRefreshGroupEvents } from "@/src/lib/hooks/hydration/useRefreshGroupEvents";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { getCurrentRole } from "@/src/lib/store/slices/viewer/ViewerSlice";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

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

    const handlePayload = (
      group: GroupSchemaType | null,
      events: EventsPages,
      role: GroupMemberSchemaType["role"],
      numMembers: number,
      organizerEmail: string,
      allGroupEvents: EventSchemaType[]
    ): void => {
      if (!group) {
        dispatch(
          groupOpened({
            status: "failed",
            error: "Group hydration error",
          }),
        );
        return;
      }
      dispatch(getEmailOfGroupOrganizer(organizerEmail));
      dispatch(getNumMembers(numMembers));
      handleSyncGroupOpened(group);
      handleSyncEventsOfGroup(events);
      dispatch(getCurrentRole(role));
      dispatch(getFlattenedGroupEvents({ status: "ready", data: allGroupEvents}));
    };

    const executeHydration = async () => {
      dispatch(groupOpened({ status: "pending" }));
      dispatch(getGroupHistory({ status: "initial"}))
      dispatch(getGroupEvents({ status: "pending" }));
      dispatch(getFlattenedGroupEvents({ status: "pending" }))
      dispatch(enqueueSidebar("group"));

      try{
      const { events, group, role, numMembers, organizerEmail, allGroupEvents } =
        await syncOpenedGroup(slug);  
      
      handlePayload(group, events, role, numMembers, organizerEmail, allGroupEvents);
      } catch (err) {
        console.error(err);
        dispatch(groupOpened({ status: "failed", error: "Group hydration error"}));
      }
      
    };
    void executeHydration();
  }, [slug, userKind, dispatch]);

  return null;
}
